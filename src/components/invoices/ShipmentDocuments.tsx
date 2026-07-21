"use client";

import { formatMoney } from "@/lib/shipment-pricing";
import { siteConfig } from "@/data/site";

export interface ShipmentDocumentBox {
  boxNumber: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  actualWeightKg: number;
  chargeableWeightKg: number;
  slabWeightKg?: number | null;
  referenceSlabPrice?: number | null;
  boxPrice: number;
  goods: Array<{ description: string; quantity: number; declaredValue?: number | null }>;
}

export interface ShipmentDocumentData {
  trackingNumber: string;
  createdAt: string;
  currency: string;
  status: string;
  totalPrice: number;
  totalCompanyCharge: number;
  agentProfit: number;
  agent: {
    businessName?: string | null;
    address: string;
    city: string;
    phone: string;
    user: { name?: string | null; email: string };
  };
  booking?: {
    destination: string;
    destinationCountry: string;
    recipientName: string;
    recipientPhone: string;
    customer: { name?: string | null; email: string; phone?: string | null };
  } | null;
  boxes: ShipmentDocumentBox[];
}

function DocumentHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 border-b border-navy-200 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-navy-900">{siteConfig.name}</p>
          <p className="text-sm text-navy-500">{siteConfig.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          <p className="text-sm text-navy-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function BoxTable({
  boxes,
  currency,
  showCompanyCharge,
  showCustomerCharge,
}: {
  boxes: ShipmentDocumentBox[];
  currency: string;
  showCompanyCharge: boolean;
  showCustomerCharge: boolean;
}) {
  return (
    <table className="mb-6 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-navy-200 bg-surface text-left text-navy-600">
          <th className="px-3 py-2">Carton</th>
          <th className="px-3 py-2">Dimensions</th>
          <th className="px-3 py-2">Weight</th>
          <th className="px-3 py-2">Slab</th>
          <th className="px-3 py-2">Goods</th>
          {showCompanyCharge && <th className="px-3 py-2">Company Rate</th>}
          {showCustomerCharge && <th className="px-3 py-2">Amount</th>}
        </tr>
      </thead>
      <tbody>
        {boxes.map((box) => (
          <tr key={box.boxNumber} className="border-b border-navy-100">
            <td className="px-3 py-3 font-medium">#{box.boxNumber}</td>
            <td className="px-3 py-3">
              {box.lengthCm}×{box.widthCm}×{box.heightCm} cm
            </td>
            <td className="px-3 py-3">
              {box.actualWeightKg} kg actual
              <br />
              <span className="text-navy-500">{box.chargeableWeightKg} kg chargeable</span>
            </td>
            <td className="px-3 py-3">{box.slabWeightKg ? `${box.slabWeightKg} kg` : "—"}</td>
            <td className="px-3 py-3">
              {box.goods.map((g) => (
                <div key={g.description}>
                  {g.description} × {g.quantity}
                </div>
              ))}
            </td>
            {showCompanyCharge && (
              <td className="px-3 py-3 font-medium">
                {box.referenceSlabPrice != null
                  ? formatMoney(box.referenceSlabPrice, currency)
                  : "—"}
              </td>
            )}
            {showCustomerCharge && (
              <td className="px-3 py-3 font-semibold">{formatMoney(box.boxPrice, currency)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CustomerSlipDocument({ shipment }: { shipment: ShipmentDocumentData }) {
  const booking = shipment.booking;

  return (
    <div className="document-print mx-auto max-w-4xl bg-white p-8 text-navy-900">
      <DocumentHeader title="Customer Receipt" subtitle="Shipping charge slip for customer" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <p className="font-semibold text-navy-700">Tracking Number</p>
          <p className="font-mono text-lg">{shipment.trackingNumber}</p>
          <p className="mt-2 text-navy-500">
            Date: {new Date(shipment.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-navy-700">Agent</p>
          <p>{shipment.agent.user.name ?? shipment.agent.businessName}</p>
          <p className="text-navy-500">
            {shipment.agent.address}, {shipment.agent.city}
          </p>
          <p className="text-navy-500">{shipment.agent.phone}</p>
        </div>
        {booking && (
          <>
            <div>
              <p className="font-semibold text-navy-700">Customer</p>
              <p>{booking.customer.name}</p>
              <p className="text-navy-500">{booking.customer.email}</p>
            </div>
            <div>
              <p className="font-semibold text-navy-700">Destination</p>
              <p>
                {booking.destination}, {booking.destinationCountry}
              </p>
              <p className="text-navy-500">
                To: {booking.recipientName} · {booking.recipientPhone}
              </p>
            </div>
          </>
        )}
      </div>

      <BoxTable boxes={shipment.boxes} currency={shipment.currency} showCompanyCharge={false} showCustomerCharge />

      <div className="flex justify-end border-t border-navy-200 pt-4">
        <div className="text-right">
          <p className="text-sm text-navy-500">Total charged to customer</p>
          <p className="text-2xl font-bold text-navy-900">
            {formatMoney(shipment.totalPrice, shipment.currency)}
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-navy-400">
        This slip reflects the amount charged by the agent to the customer. Keep for your records.
      </p>
    </div>
  );
}

export function AgentInvoiceDocument({ shipment }: { shipment: ShipmentDocumentData }) {
  return (
    <div className="document-print mx-auto max-w-4xl bg-white p-8 text-navy-900">
      <DocumentHeader title="Agent Invoice" subtitle="Company charges payable by agent" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <p className="font-semibold text-navy-700">Invoice Ref</p>
          <p className="font-mono text-lg">{shipment.trackingNumber}</p>
          <p className="mt-2 text-navy-500">
            Date: {new Date(shipment.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-navy-700">Bill To (Agent)</p>
          <p>{shipment.agent.user.name ?? shipment.agent.businessName}</p>
          <p className="text-navy-500">{shipment.agent.user.email}</p>
          <p className="text-navy-500">
            {shipment.agent.address}, {shipment.agent.city} · {shipment.agent.phone}
          </p>
        </div>
        {shipment.booking && (
          <div className="sm:col-span-2">
            <p className="font-semibold text-navy-700">Shipment</p>
            <p>
              {shipment.booking.destination}, {shipment.booking.destinationCountry}
            </p>
          </div>
        )}
      </div>

      <BoxTable
        boxes={shipment.boxes}
        currency={shipment.currency}
        showCompanyCharge
        showCustomerCharge={false}
      />

      <div className="space-y-2 border-t border-navy-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-navy-600">Company charge (slab rates)</span>
          <span className="font-semibold">
            {formatMoney(shipment.totalCompanyCharge, shipment.currency)}
          </span>
        </div>
        <div className="flex justify-between text-navy-500">
          <span>Customer paid (reference)</span>
          <span>{formatMoney(shipment.totalPrice, shipment.currency)}</span>
        </div>
        <div className="flex justify-between border-t border-navy-100 pt-2 text-base">
          <span className="font-semibold text-green-700">Your earnings (profit)</span>
          <span className="font-bold text-green-700">
            {formatMoney(shipment.agentProfit, shipment.currency)}
          </span>
        </div>
      </div>

      <p className="mt-8 text-xs text-navy-400">
        This invoice shows what {siteConfig.name} charges the agent per admin slab rates. Agent
        profit = customer charge minus company charge.
      </p>
    </div>
  );
}

export function ProfitSummaryCard({
  currency,
  totalCompanyCharge,
  totalCustomerCharge,
  agentProfit,
}: {
  currency: string;
  totalCompanyCharge: number;
  totalCustomerCharge: number;
  agentProfit: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-navy-100 bg-surface p-4">
        <p className="text-xs text-navy-500">Company charges (slab)</p>
        <p className="text-xl font-bold text-navy-900">
          {formatMoney(totalCompanyCharge, currency)}
        </p>
      </div>
      <div className="rounded-lg border border-navy-100 bg-surface p-4">
        <p className="text-xs text-navy-500">You charge customer</p>
        <p className="text-xl font-bold text-navy-900">
          {formatMoney(totalCustomerCharge, currency)}
        </p>
      </div>
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-xs text-green-700">Your profit / earnings</p>
        <p className="text-xl font-bold text-green-800">{formatMoney(agentProfit, currency)}</p>
      </div>
    </div>
  );
}
