"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  chargeableWeightKg,
  volumetricWeightKg,
} from "@/lib/shipment-utils";
import { FRANCE_EXAMPLE_CARTON } from "@/data/rates/dpd-europe-duty-paid";
import { ProfitSummaryCard } from "@/components/invoices/ShipmentDocuments";
import { calcBoxProfit, formatMoney } from "@/lib/shipment-pricing";
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
  selectedSlabKg: string;
  customerCharge: string;
  chargeTouched: boolean;
  goods: GoodsItem[];
}

interface BookingOption {
  id: string;
  label: string;
  destinationCountry: string;
}

interface ZoneSlab {
  weightKg: number;
  price: number;
}

interface ZoneInfo {
  id: string;
  name: string;
  serviceName: string;
  currency: string;
  slabs: ZoneSlab[];
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
  selectedSlabKg: "",
  customerCharge: "",
  chargeTouched: false,
  goods: [emptyGoods()],
});

function currencySymbol(currency: string): string {
  if (currency === "INR") return "₹";
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "GBP") return "£";
  return currency;
}

export default function CreateReceiptPage() {
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [zone, setZone] = useState<ZoneInfo | null>(null);
  const [boxes, setBoxes] = useState<BoxForm[]>([emptyBox()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    trackingNumber: string;
    totalPrice: number;
    totalCompanyCharge: number;
    agentProfit: number;
    currency: string;
  } | null>(null);
  const [error, setError] = useState("");

  const selectedBooking = bookings.find((b) => b.id === bookingId);
  const destinationCountry = selectedBooking?.destinationCountry ?? "";
  const currency = zone?.currency ?? "INR";
  const symbol = currencySymbol(currency);

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
    if (!destinationCountry) {
      setZone(null);
      return;
    }

    fetch(`/api/rates/lookup?country=${encodeURIComponent(destinationCountry)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.zone) {
          setZone({
            id: d.zone.id,
            name: d.zone.name,
            serviceName: d.zone.serviceName,
            currency: d.zone.currency,
            slabs: d.zone.slabs ?? [],
          });
        } else {
          setZone(null);
        }
      });
  }, [destinationCountry]);

  const getReferencePrice = useCallback(
    (slabKg: number) => zone?.slabs.find((slab) => slab.weightKg === slabKg)?.price ?? null,
    [zone]
  );

  const suggestSlabKg = useCallback(
    (chargeable: number) => {
      if (!zone?.slabs.length || !chargeable) return "";
      const target = Math.ceil(chargeable);
      const weights = zone.slabs.map((slab) => slab.weightKg).sort((a, b) => a - b);
      const match = weights.find((kg) => kg >= target) ?? weights[weights.length - 1];
      return String(match);
    },
    [zone]
  );

  const totalEstimate = useMemo(() => {
    return boxes.reduce((sum, box) => sum + (parseFloat(box.customerCharge) || 0), 0);
  }, [boxes]);

  const profitSummary = useMemo(() => {
    const totalCompanyCharge = boxes.reduce((sum, box) => {
      const ref = box.selectedSlabKg ? getReferencePrice(parseInt(box.selectedSlabKg)) : null;
      return sum + (ref ?? 0);
    }, 0);
    const totalCustomerCharge = totalEstimate;
    const agentProfit = Math.round((totalCustomerCharge - totalCompanyCharge) * 100) / 100;
    return { totalCompanyCharge, totalCustomerCharge, agentProfit };
  }, [boxes, totalEstimate, getReferencePrice]);

  function updateBoxField(index: number, field: keyof BoxForm, value: string) {
    setBoxes((prev) =>
      prev.map((box, i) => {
        if (i !== index) return box;
        const next = { ...box, [field]: value };

        if (field === "lengthCm" || field === "widthCm" || field === "heightCm" || field === "actualWeightKg") {
          const l = parseFloat(field === "lengthCm" ? value : box.lengthCm) || 0;
          const w = parseFloat(field === "widthCm" ? value : box.widthCm) || 0;
          const h = parseFloat(field === "heightCm" ? value : box.heightCm) || 0;
          const actual = parseFloat(field === "actualWeightKg" ? value : box.actualWeightKg) || 0;

          if (l && w && h && actual && zone) {
            const chargeable = chargeableWeightKg(actual, l, w, h);
            const suggested = suggestSlabKg(chargeable);
            if (suggested && !box.chargeTouched) {
              const ref = getReferencePrice(Number(suggested));
              next.selectedSlabKg = suggested;
              if (ref !== null) next.customerCharge = String(ref);
            }
          }
        }

        if (field === "selectedSlabKg") {
          const ref = getReferencePrice(Number(value));
          if (ref !== null && !box.chargeTouched) {
            next.customerCharge = String(ref);
          }
        }

        if (field === "customerCharge") {
          next.chargeTouched = true;
        }

        return next;
      })
    );
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
    const suggestedSlab = "14";
    const refPrice = zone?.slabs.find((s) => s.weightKg === 14)?.price ?? 592;

    setBoxes([
      {
        lengthCm: FRANCE_EXAMPLE_CARTON.lengthCm,
        widthCm: FRANCE_EXAMPLE_CARTON.widthCm,
        heightCm: FRANCE_EXAMPLE_CARTON.heightCm,
        actualWeightKg: FRANCE_EXAMPLE_CARTON.actualWeightKg,
        selectedSlabKg: suggestedSlab,
        customerCharge: String(refPrice),
        chargeTouched: false,
        goods: FRANCE_EXAMPLE_CARTON.goods.map((g) => ({ ...g })),
      },
    ]);
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
        slabWeightKg: box.selectedSlabKg ? parseInt(box.selectedSlabKg) : undefined,
        customerCharge: parseFloat(box.customerCharge),
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
      id: data.shipment.id,
      trackingNumber: data.shipment.trackingNumber,
      totalPrice: data.shipment.totalPrice,
      totalCompanyCharge: data.shipment.totalCompanyCharge ?? 0,
      agentProfit: data.shipment.agentProfit ?? 0,
      currency: data.shipment.currency ?? currency,
    });
  }

  if (result) {
    const resultSymbol = currencySymbol(result.currency);
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <DashboardCard>
          <h1 className="text-xl font-bold text-green-800">Tracker Receipt Created</h1>
          <p className="mt-2 text-navy-600">Tracking number:</p>
          <p className="mt-2 font-mono text-2xl font-bold text-navy-900">{result.trackingNumber}</p>

          <div className="mt-6">
            <ProfitSummaryCard
              currency={result.currency}
              totalCompanyCharge={result.totalCompanyCharge}
              totalCustomerCharge={result.totalPrice}
              agentProfit={result.agentProfit}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/agent/shipments/${result.id}/customer-slip`} className="btn-primary">
              Customer Slip
            </Link>
            <Link href={`/agent/shipments/${result.id}/agent-invoice`} className="btn-secondary">
              Agent Invoice
            </Link>
          </div>

          <p className="mt-4 text-sm text-navy-500">
            Customer slip shows what you charged ({resultSymbol}
            {result.totalPrice.toLocaleString("en-IN")}). Agent invoice shows company slab charges (
            {resultSymbol}
            {result.totalCompanyCharge.toLocaleString("en-IN")}). Your earnings: {resultSymbol}
            {result.agentProfit.toLocaleString("en-IN")}.
          </p>
          <p className="mt-2 text-sm text-navy-500">
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
        Select country and weight slab — reference price shows automatically. You can charge the
        customer any amount you want.
      </p>

      <div className="mb-6">
        <button type="button" className="btn-secondary text-sm" onClick={fillFranceExample}>
          Fill example — 1 carton (clothes + cookware)
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

        {destinationCountry && (
          <DashboardCard title="Destination & Slab Sheet">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-navy-500">Destination country</p>
                <p className="font-semibold text-navy-900">{destinationCountry}</p>
              </div>
              {zone ? (
                <>
                  <div>
                    <p className="text-xs text-navy-500">Rate zone</p>
                    <p className="font-semibold text-navy-900">{zone.name}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-navy-500">Service</p>
                    <p className="text-sm text-navy-700">{zone.serviceName}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-amber-700 sm:col-span-2">
                  No slab sheet configured for this country. Ask admin to add one, or enter customer
                  charge manually.
                </p>
              )}
            </div>
          </DashboardCard>
        )}

        {boxes.map((box, boxIndex) => {
          const l = parseFloat(box.lengthCm) || 0;
          const w = parseFloat(box.widthCm) || 0;
          const h = parseFloat(box.heightCm) || 0;
          const actual = parseFloat(box.actualWeightKg) || 0;
          const vol = l && w && h ? volumetricWeightKg(l, w, h) : 0;
          const chargeable = l && w && h && actual ? chargeableWeightKg(actual, l, w, h) : 0;
          const referencePrice = box.selectedSlabKg
            ? getReferencePrice(parseInt(box.selectedSlabKg))
            : null;

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
                      onChange={(e) => updateBoxField(boxIndex, dim, e.target.value)}
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
                    onChange={(e) => updateBoxField(boxIndex, "actualWeightKg", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div className="rounded bg-surface p-3 text-sm">
                  <p className="text-navy-500">Volumetric Wt</p>
                  <p className="font-semibold">{vol || "—"} kg</p>
                </div>
                <div className="rounded bg-surface p-3 text-sm">
                  <p className="text-navy-500">Chargeable Wt</p>
                  <p className="font-semibold">{chargeable || "—"} kg</p>
                  {chargeable > 0 && zone && (
                    <p className="mt-1 text-xs text-navy-500">
                      Suggested slab: {suggestSlabKg(chargeable)} kg
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-600">Weight Slab (kg) *</label>
                  {zone?.slabs.length ? (
                    <select
                      required
                      value={box.selectedSlabKg}
                      onChange={(e) => updateBoxField(boxIndex, "selectedSlabKg", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                    >
                      <option value="">Select slab...</option>
                      {zone.slabs.map((slab) => (
                        <option key={slab.weightKg} value={slab.weightKg}>
                          {slab.weightKg} kg — {symbol}
                          {slab.price.toLocaleString("en-IN")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required
                      type="number"
                      min="1"
                      value={box.selectedSlabKg}
                      onChange={(e) => updateBoxField(boxIndex, "selectedSlabKg", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                    />
                  )}
                </div>
                <div className="rounded bg-accent-50 p-3 text-sm">
                  <p className="text-navy-500">Company charges (slab)</p>
                  <p className="font-semibold text-navy-800">
                    {referencePrice !== null ? `${symbol}${referencePrice.toLocaleString("en-IN")}` : "—"}
                  </p>
                  <p className="mt-1 text-xs text-navy-500">What company charges you</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-navy-700">
                    Charge to Customer ({symbol}) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={box.customerCharge}
                    onChange={(e) => updateBoxField(boxIndex, "customerCharge", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  />
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:col-span-2">
                  <p className="text-xs text-green-700">Your profit on this carton</p>
                  <p className="text-lg font-bold text-green-800">
                    {formatMoney(
                      calcBoxProfit(parseFloat(box.customerCharge) || 0, referencePrice),
                      currency
                    )}
                  </p>
                  <p className="mt-1 text-xs text-navy-500">
                    Customer charge − company slab rate
                  </p>
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
                      placeholder="Declared value"
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

        <DashboardCard title="Summary & Submit">
          <ProfitSummaryCard
            currency={currency}
            totalCompanyCharge={profitSummary.totalCompanyCharge}
            totalCustomerCharge={profitSummary.totalCustomerCharge}
            agentProfit={profitSummary.agentProfit}
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-4">
            {loading ? "Submitting..." : "Submit & Generate Slips"}
          </button>
        </DashboardCard>
      </form>
    </DashboardShell>
  );
}
