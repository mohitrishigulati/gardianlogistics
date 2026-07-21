import { Suspense } from "react";
import { TrackPageClient } from "@/components/tracking/TrackPageClient";
import { TrackingSkeleton } from "@/components/tracking/TrackingSkeleton";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Track Shipment",
  description:
    "Track your Gardian Logistics shipment in real time. Enter your AWB or tracking number for live status updates across our global partner carrier network.",
  path: "/track",
});

function TrackFallback() {
  return (
    <div className="container-site section-padding">
      <TrackingSkeleton />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackPageClient />
    </Suspense>
  );
}
