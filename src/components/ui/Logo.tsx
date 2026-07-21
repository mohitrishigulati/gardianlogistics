interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}

export function Logo({ className = "", showText = true, variant = "dark" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-navy-900";
  const subColor = variant === "light" ? "text-navy-200" : "text-navy-600";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M18 2L4 8v12c0 7.5 6 13.5 14 14 8-.5 14-6.5 14-14V8L18 2z"
          fill="#1e1b4b"
        />
        <path
          d="M18 6l10 4.5v9.5c0 5.5-4.5 10-10 10.5-5.5-.5-10-5-10-10.5v-9.5L18 6z"
          fill="#312e81"
        />
        <path
          d="M18 10l-6 8h4v6l6-8h-4v-6z"
          fill="#f59e0b"
        />
        <path
          d="M18 2L4 8v2l14-6 14 6V8L18 2z"
          fill="#4338ca"
          opacity="0.6"
        />
      </svg>
      {showText && (
        <div className="leading-tight">
          <span className={`block text-lg font-bold tracking-tight ${textColor}`}>
            Gardian
          </span>
          <span className={`block text-xs font-medium uppercase tracking-widest ${subColor}`}>
            Logistics
          </span>
        </div>
      )}
    </div>
  );
}
