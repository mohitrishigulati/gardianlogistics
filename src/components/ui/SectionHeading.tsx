interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = light ? "text-white" : "text-navy-900";
  const descColor = light ? "text-navy-200" : "text-navy-600";
  const eyebrowColor = light ? "text-accent-400" : "text-accent-600";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-semibold uppercase tracking-wider ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-bold tracking-tight md:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${descColor}`}>{description}</p>
      )}
    </div>
  );
}
