export function TrackingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="border-b border-navy-100 bg-surface px-6 py-5 md:px-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-navy-200" />
            <div className="h-6 w-48 rounded bg-navy-200" />
          </div>
          <div className="h-8 w-28 rounded-full bg-navy-200" />
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-navy-100" />
              <div className="h-4 w-36 rounded bg-navy-200" />
            </div>
          ))}
        </div>
        <div className="space-y-6 md:col-span-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 shrink-0 rounded-full bg-navy-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-navy-200" />
                <div className="h-3 w-48 rounded bg-navy-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrackingErrorState({
  title,
  message,
  code,
}: {
  title: string;
  message: string;
  code?: string;
}) {
  const icons: Record<string, string> = {
    NOT_FOUND: "🔍",
    INVALID_NUMBER: "⚠️",
    TIMEOUT: "⏱️",
    RATE_LIMIT: "🚦",
    SERVER_ERROR: "🔧",
  };

  return (
    <div
      className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center"
      role="alert"
    >
      <span className="text-4xl" aria-hidden="true">
        {icons[code ?? ""] ?? "❌"}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">{message}</p>
    </div>
  );
}
