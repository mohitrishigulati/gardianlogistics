"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  chargeableWeightKg,
  DEFAULT_PRICE_PER_KG,
  volumetricWeightKg,
} from "@/lib/shipment-utils";
import {
  FRANCE_EXAMPLE_CARTON,
  isFranceDpdCountry,
} from "@/data/rates/dpd-europe-duty-paid";
import { formatSlabLabel, quoteBoxPrice, type PricingMode } from "@/lib/pricing/dpd-slabs";
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

interface BookingOption {
  id: string;
  label: string;
  destinationCountry: string;
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
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("per_kg");
  const [boxes, setBoxes] = useState<BoxForm[]>([emptyBox()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ trackingNumber: string; totalPrice: number } | null>(null);
  const [error, setError] = useState("");

  const selectedBooking = bookings.find((b) => b.id === bookingId);
  const destinationCountry = selectedBooking?.destinationCountry ?? "";
  const slabAvailable = isFranceDpdCountry(destinationCountry);

  useEffect(() => {
    fetch("/api/agent/bookings")
      .then((r) => r.json())
      .then((d) => {
        const eligible = (d.bookings ?? []).filter(
          (b: { shipment: unknown; status: string }) =>
            !b.shipment && ["ACCEPTED", "PICKED_UP", "PENDING"].includes(b.status)
        );
        setBookings(
          eligible.map(
            (b: {
              id: string;
              customer: { name: string };
              destination: string;
              destinationCountry: string;
            }) => ({
              id: b.id,
              label: `${b.customer.name} → ${b.destination}, ${b.destinationCountry}`,
              destinationCountry: b.destinationCountry,
            })
          )
        );
      });
  }, []);

  useEffect(() => {
    if (slabAvailable) {
      setPricingMode("dpd_slab");
    } else {
      setPricingMode("per_kg");
    }
  }, [slabAvailable, destinationCountry]);

  const boxQuotes = useMemo(() => {
    return boxes.map((box) =>
      quoteBoxPrice({
        pricingMode,
        destinationCountry,
        actualKg: parseFloat(box.actualWeightKg) || 0,
        lengthCm: parseFloat(box.lengthCm) || 0,
        widthCm: parseFloat(box.widthCm) || 0,
        heightCm: parseFloat(box.heightCm) || 0,
        pricePerKg: parseFloat(box.pricePerKg) || DEFAULT_PRICE_PER_KG,
      })
    );
  }, [boxes, pricingMode, destinationCountry]);

  const totalEstimate = useMemo(() => {
    return boxQuotes.reduce((sum, quote) => sum + (quote?.price ?? 0), 0);
  }, [boxQuotes]);

  const currencySymbol = boxQuotes.find((q) => q)?.currencySymbol ?? "$";

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

  function fillFranceExample() {
    setBoxes([
      {
        lengthCm: FRANCE_EXAMPLE_CARTON.lengthCm,
        widthCm: FRANCE_EXAMPLE_CARTON.widthCm,
        heightCm: FRANCE_EXAMPLE_CARTON.heightCm,
        actualWeightKg: FRANCE_EXAMPLE_CARTON.actualWeightKg,
        pricePerKg: String(DEFAULT_PRICE_PER_KG),
        goods: FRANCE_EXAMPLE_CARTON.goods.map((g) => ({ ...g })),
      },
    ]);
    setPricingMode("dpd_slab");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      bookingId,
      pricingMode,
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
          <p className="mt-2 text-navy-600">
            Total price: {pricingMode === "dpd_slab" ? "₹" : "$"}
            {result.totalPrice}
          </p>
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
      <p className="mb-4 text-sm text-navy-600">
        Fill box-wise dimensions, weight, and goods list. Chargeable weight = higher of actual weight
        or volumetric weight (L×W×H ÷ 5000).
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        <button type="button" className="btn-secondary text-sm" onClick={fillFranceExample}>
          Fill example — 1 carton (clothes + cookware → France)
        </button>
      </div>

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
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </DashboardCard>

        {bookingId && (
          <DashboardCard title="Pricing Method">
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="pricingMode"
                  checked={pricingMode === "per_kg"}
                  onChange={() => setPricingMode("per_kg")}
                  className="accent-accent-500"
                />
                Standard rate ($/kg)
              </label>
              <label
                className={`flex items-center gap-2 text-sm ${slabAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              >
                <input
                  type="radio"
                  name="pricingMode"
                  checked={pricingMode === "dpd_slab"}
                  onChange={() => slabAvailable && setPricingMode("dpd_slab")}
                  disabled={!slabAvailable}
                  className="accent-accent-500"
                />
                DPD Duty Paid slab (France / CZ / DK)
              </label>
            </div>
            {pricingMode === "dpd_slab" && slabAvailable && (
              <p className="mt-3 rounded-lg bg-accent-50 px-3 py-2 text-xs text-navy-700">
                Charge is based on the DPD Europe duty-paid weight slab for{" "}
                <strong>{destinationCountry}</strong>. Chargeable weight is rounded up to the
                nearest slab (1–30 kg).
              </p>
            )}
            {!slabAvailable && bookingId && (
              <p className="mt-2 text-xs text-navy-500">
                Slab pricing is available for France, Czech Republic, and Denmark destinations.
              </p>
            )}
          </DashboardCard>
        )}

        {boxes.map((box, boxIndex) => {
          const l = parseFloat(box.lengthCm) || 0;
          const w = parseFloat(box.widthCm) || 0;
          const h = parseFloat(box.heightCm) || 0;
          const actual = parseFloat(box.actualWeightKg) || 0;
          const vol = l && w && h ? volumetricWeightKg(l, w, h) : 0;
          const chargeable = l && w && h && actual ? chargeableWeightKg(actual, l, w, h) : 0;
          const quote = boxQuotes[boxIndex];

          return (
            <DashboardCard key={boxIndex} title={`Carton ${boxIndex + 1}`}>
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
                <div className="rounded bg-surface p-3 text-sm">
                  {pricingMode === "dpd_slab" && quote?.pricingMode === "dpd_slab" ? (
                    <>
                      <p className="text-navy-500">DPD Slab Price</p>
                      <p className="font-semibold text-accent-700">
                        {quote.currencySymbol}
                        {quote.price.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs text-navy-500">
                        {formatSlabLabel(quote.slabKg)} · {quote.chargeableKg} kg chargeable
                      </p>
                    </>
                  ) : (
                    <>
                      <label className="block text-xs font-medium text-navy-600">Price per kg ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={box.pricePerKg}
                        onChange={(e) => updateBox(boxIndex, "pricePerKg", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                      />
                      <p className="mt-1 text-xs text-navy-500">
                        Box price: ${quote?.price.toFixed(2) ?? "0.00"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-navy-700">Goods in this carton *</p>
                {box.goods.map((g, gi) => (
                  <div key={gi} className="mb-3 grid gap-2 rounded border border-navy-100 p-3 sm:grid-cols-5">
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
                      placeholder="Declared value (₹)"
                      value={g.declaredValue}
                      onChange={(e) => updateGoods(boxIndex, gi, "declaredValue", e.target.value)}
                      className="rounded border border-navy-200 px-2 py-1.5 text-sm"
                    />
                    <input
                      placeholder="HS Code"
                      value={g.hsCode}
                      onChange={(e) => updateGoods(boxIndex, gi, "hsCode", e.target.value)}
                      className="rounded border border-navy-200 px-2 py-1.5 text-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm text-accent-600 hover:underline"
                  onClick={() => addGoods(boxIndex)}
                >
                  + Add goods item
                </button>
              </div>
            </DashboardCard>
          );
        })}

        <button type="button" className="btn-secondary" onClick={addBox}>
          + Add Another Carton
        </button>

        <DashboardCard>
          <p className="text-lg font-semibold text-navy-900">
            Estimated Total: {currencySymbol}
            {totalEstimate.toLocaleString("en-IN", {
              minimumFractionDigits: pricingMode === "dpd_slab" ? 0 : 2,
              maximumFractionDigits: pricingMode === "dpd_slab" ? 0 : 2,
            })}
          </p>
          {pricingMode === "dpd_slab" && slabAvailable && (
            <p className="mt-1 text-xs text-navy-500">
              DPD Europe duty-paid slab rates for {destinationCountry}
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-4">
            {loading ? "Submitting..." : "Submit for Admin Approval"}
          </button>
        </DashboardCard>
      </form>
    </DashboardShell>
  );
}
