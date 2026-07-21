"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  calculateBoxPrice,
  chargeableWeightKg,
  DEFAULT_PRICE_PER_KG,
  volumetricWeightKg,
} from "@/lib/shipment-utils";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

interface GoodsItem {
  description: string;
  quantity: number;
  declaredValue: string;
  hsCode: string;
}

interface BoxForm {
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  actualWeightKg: string;
  pricePerKg: string;
  goods: GoodsItem[];
}

const emptyGoods = (): GoodsItem => ({
  description: "",
  quantity: 1,
  declaredValue: "",
  hsCode: "",
});

const emptyBox = (): BoxForm => ({
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  actualWeightKg: "",
  pricePerKg: String(DEFAULT_PRICE_PER_KG),
  goods: [emptyGoods()],
});

export default function CreateReceiptPage() {
  const [bookings, setBookings] = useState<Array<{ id: string; label: string }>>([]);
  const [bookingId, setBookingId] = useState("");
  const [boxes, setBoxes] = useState<BoxForm[]>([emptyBox()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ trackingNumber: string; totalPrice: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/agent/bookings")
      .then((r) => r.json())
      .then((d) => {
        const eligible = (d.bookings ?? []).filter(
          (b: { shipment: unknown; status: string }) => !b.shipment && ["ACCEPTED", "PICKED_UP", "PENDING"].includes(b.status)
        );
        setBookings(
          eligible.map((b: { id: string; customer: { name: string }; destination: string; destinationCountry: string }) => ({
            id: b.id,
            label: `${b.customer.name} → ${b.destination}, ${b.destinationCountry}`,
          }))
        );
      });
  }, []);

  const totalEstimate = useMemo(() => {
    return boxes.reduce((sum, box) => {
      const l = parseFloat(box.lengthCm) || 0;
      const w = parseFloat(box.widthCm) || 0;
      const h = parseFloat(box.heightCm) || 0;
      const actual = parseFloat(box.actualWeightKg) || 0;
      const pricePerKg = parseFloat(box.pricePerKg) || DEFAULT_PRICE_PER_KG;
      if (!l || !w || !h || !actual) return sum;
      const chargeable = chargeableWeightKg(actual, l, w, h);
      return sum + calculateBoxPrice(chargeable, pricePerKg);
    }, 0);
  }, [boxes]);

  function updateBox(index: number, field: keyof BoxForm, value: string) {
    setBoxes((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  }

  function updateGoods(boxIndex: number, goodsIndex: number, field: keyof GoodsItem, value: string | number) {
    setBoxes((prev) =>
      prev.map((box, bi) =>
        bi === boxIndex
          ? {
              ...box,
              goods: box.goods.map((g, gi) =>
                gi === goodsIndex ? { ...g, [field]: value } : g
              ),
            }
          : box
      )
    );
  }

  function addBox() {
    setBoxes((prev) => [...prev, emptyBox()]);
  }

  function addGoods(boxIndex: number) {
    setBoxes((prev) =>
      prev.map((box, i) =>
        i === boxIndex ? { ...box, goods: [...box.goods, emptyGoods()] } : box
      )
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      bookingId,
      boxes: boxes.map((box) => ({
        lengthCm: parseFloat(box.lengthCm),
        widthCm: parseFloat(box.widthCm),
        heightCm: parseFloat(box.heightCm),
        actualWeightKg: parseFloat(box.actualWeightKg),
        pricePerKg: parseFloat(box.pricePerKg) || DEFAULT_PRICE_PER_KG,
        goods: box.goods.map((g) => ({
          description: g.description,
          quantity: g.quantity,
          declaredValue: g.declaredValue ? parseFloat(g.declaredValue) : undefined,
          hsCode: g.hsCode || undefined,
        })),
      })),
    };

    const res = await fetch("/api/agent/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Failed to create receipt.");
      return;
    }

    setResult({
      trackingNumber: data.shipment.trackingNumber,
      totalPrice: data.shipment.totalPrice,
    });
  }

  if (result) {
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <DashboardCard>
          <h1 className="text-xl font-bold text-green-800">Tracker Receipt Created</h1>
          <p className="mt-2 text-navy-600">
            Tracking number (10 alphanumeric + DDMMYYYY):
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-navy-900">{result.trackingNumber}</p>
          <p className="mt-2 text-navy-600">Total price: ${result.totalPrice}</p>
          <p className="mt-4 text-sm text-navy-500">
            Submitted for admin approval. Customer can track once approved.
          </p>
        </DashboardCard>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Create Tracker Receipt</h1>
      <p className="mb-6 text-sm text-navy-600">
        Fill box-wise dimensions, weight, goods list. Price uses higher of actual weight or volumetric weight (L×W×H ÷ 5000).
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DashboardCard>
          <label className="block text-sm font-medium text-navy-700">Select Booking *</label>
          <select
            required
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
          >
            <option value="">Choose booking...</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </DashboardCard>

        {boxes.map((box, boxIndex) => {
          const l = parseFloat(box.lengthCm) || 0;
          const w = parseFloat(box.widthCm) || 0;
          const h = parseFloat(box.heightCm) || 0;
          const actual = parseFloat(box.actualWeightKg) || 0;
          const vol = l && w && h ? volumetricWeightKg(l, w, h) : 0;
          const chargeable = l && w && h && actual ? chargeableWeightKg(actual, l, w, h) : 0;
          const boxPrice = chargeable ? calculateBoxPrice(chargeable, parseFloat(box.pricePerKg) || DEFAULT_PRICE_PER_KG) : 0;

          return (
            <DashboardCard key={boxIndex} title={`Box ${boxIndex + 1}`}>
              <div className="grid gap-4 sm:grid-cols-4">
                {(["lengthCm", "widthCm", "heightCm"] as const).map((dim) => (
                  <div key={dim}>
                    <label className="block text-xs font-medium text-navy-600 capitalize">
                      {dim.replace("Cm", "")} (cm) *
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.1"
                      value={box[dim]}
                      onChange={(e) => updateBox(boxIndex, dim, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-navy-600">Actual Weight (kg) *</label>
                  <input
                    required
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={box.actualWeightKg}
                    onChange={(e) => updateBox(boxIndex, "actualWeightKg", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded bg-surface p-3 text-sm">
                  <p className="text-navy-500">Volumetric Wt</p>
                  <p className="font-semibold">{vol || "—"} kg</p>
                </div>
                <div className="rounded bg-surface p-3 text-sm">
                  <p className="text-navy-500">Chargeable Wt</p>
                  <p className="font-semibold">{chargeable || "—"} kg</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-600">Price per kg ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={box.pricePerKg}
                    onChange={(e) => updateBox(boxIndex, "pricePerKg", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-navy-500">Box price: ${boxPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-navy-700">Goods in this box *</p>
                {box.goods.map((g, gi) => (
                  <div key={gi} className="mb-3 grid gap-2 rounded border border-navy-100 p-3 sm:grid-cols-4">
                    <input
                      required
                      placeholder="Description *"
                      value={g.description}
                      onChange={(e) => updateGoods(boxIndex, gi, "description", e.target.value)}
                      className="rounded border border-navy-200 px-2 py-1.5 text-sm sm:col-span-2"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={g.quantity}
                      onChange={(e) => updateGoods(boxIndex, gi, "quantity", parseInt(e.target.value) || 1)}
                      className="rounded border border-navy-200 px-2 py-1.5 text-sm"
                    />
                    <input
                      placeholder="Declared value"
                      value={g.declaredValue}
                      onChange={(e) => updateGoods(boxIndex, gi, "declaredValue", e.target.value)}
                      className="rounded border border-navy-200 px-2 py-1.5 text-sm"
                    />
                  </div>
                ))}
                <button type="button" className="text-sm text-accent-600 hover:underline" onClick={() => addGoods(boxIndex)}>
                  + Add goods item
                </button>
              </div>
            </DashboardCard>
          );
        })}

        <button type="button" className="btn-secondary" onClick={addBox}>
          + Add Another Box
        </button>

        <DashboardCard>
          <p className="text-lg font-semibold text-navy-900">Estimated Total: ${totalEstimate.toFixed(2)}</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-4">
            {loading ? "Submitting..." : "Submit for Admin Approval"}
          </button>
        </DashboardCard>
      </form>
    </DashboardShell>
  );
}
