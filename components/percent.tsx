import { useT } from "@/lib/i18n";

// A percentage (0–100) with the same small gap before "%" in every language.
// Locale formats differ ("80 %" vs. "80%"), which made the sign jump on a
// language switch; this keeps the width identical.
export function Percent({ value }: { value: number }) {
  const t = useT();
  return (
    <>
      {new Intl.NumberFormat(t.locale, { maximumFractionDigits: 0 }).format(
        value,
      )}
      <span className="ml-[0.1em]">%</span>
    </>
  );
}
