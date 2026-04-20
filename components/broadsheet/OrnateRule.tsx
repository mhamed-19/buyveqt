interface OrnateRuleProps {
  /** Optional category label rendered in the centre of the rule. */
  label?: string;
  /** "asterism" (default), "diamond", or "single" */
  ornament?: "asterism" | "diamond" | "single";
  className?: string;
}

const ORNAMENT: Record<string, string> = {
  asterism: "⁂",
  diamond: "◆",
  single: "•",
};

export default function OrnateRule({
  label,
  ornament = "asterism",
  className = "",
}: OrnateRuleProps) {
  return (
    <div className={`bs-rule-ornate ${className}`} role="separator">
      {label ? (
        <span className="bs-stamp tracking-[0.3em] px-2">{label}</span>
      ) : (
        <span aria-hidden className="text-[var(--rule)]">
          {ORNAMENT[ornament]}
        </span>
      )}
    </div>
  );
}
