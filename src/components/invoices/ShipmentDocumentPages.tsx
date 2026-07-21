"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AgentInvoiceDocument,
  CustomerSlipDocument,
  ProfitSummaryCard,
  type ShipmentDocumentData,
} from "@/components/invoices/ShipmentDocuments";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { formatMoney } from "@/lib/shipment-pricing";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

function PrintToolbar({
  shipmentId,
  active,
}: {
  shipmentId: string;
  active: "customer" | "agent";
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-3 print:hidden">
      <button type="button" onClick={() => window.print()} className="btn-primary">
        Print / Save PDF
      </button>
      <Link
        href={`/agent/shipments/${shipmentId}/customer-slip`}
        className={`btn-secondary ${active === "customer" ? "ring-2 ring-accent-400" : ""}`}
      >
        Customer Slip
      </Link>
      <Link
        href={`/agent/shipments/${shipmentId}/agent-invoice`}
        className={`btn-secondary ${active === "agent" ? "ring-2 ring-accent-400" : ""}`}
      >
        Agent Invoice
      </Link>
      <Link href="/agent/shipments" className="text-sm text-accent-600 hover:underline self-center">
        ← Back to shipments
      </Link>
    </div>
  );
}

function useShipmentDocument() {
  const params = useParams();
  const shipmentId = params.id as string;
  const [shipment, setShipment] = useState<ShipmentDocumentData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/agent/shipments/${shipmentId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.shipment) setShipment(d.shipment);
        else setError(d.message ?? "Shipment not found.");
      });
  }, [shipmentId]);

  return { shipmentId, shipment, error };
}

export function CustomerSlipPage() {
  const { shipmentId, shipment, error } = useShipmentDocument();

  if (error) {
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <p className="text-red-600">{error}</p>
      </DashboardShell>
    );
  }

  if (!shipment) {
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <p className="text-navy-500">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <PrintToolbar shipmentId={shipmentId} active="customer" />
      <CustomerSlipDocument shipment={shipment} />
    </DashboardShell>
  );
}

export function AgentInvoicePage() {
  const { shipmentId, shipment, error } = useShipmentDocument();

  if (error) {
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <p className="text-red-600">{error}</p>
      </DashboardShell>
    );
  }

  if (!shipment) {
    return (
      <DashboardShell title="Agent Panel" nav={nav}>
        <p className="text-navy-500">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <PrintToolbar shipmentId={shipmentId} active="agent" />
      <div className="mb-6 print:hidden">
        <ProfitSummaryCard
          currency={shipment.currency}
          totalCompanyCharge={shipment.totalCompanyCharge}
          totalCustomerCharge={shipment.totalPrice}
          agentProfit={shipment.agentProfit}
        />
        <p className="mt-3 text-sm text-navy-600">
          Company charge: {formatMoney(shipment.totalCompanyCharge, shipment.currency)} · Your
          earnings: {formatMoney(shipment.agentProfit, shipment.currency)}
        </p>
      </div>
      <AgentInvoiceDocument shipment={shipment} />
    </DashboardShell>
  );
}
