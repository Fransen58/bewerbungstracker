// Date helpers. Dates are stored as local calendar days (YYYY-MM-DD).

export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ISO day strings compare correctly as plain strings.
export function isOverdue(date: string | null): boolean {
  return date !== null && date < todayISO();
}

export function formatDate(date: string, locale: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

// Adds days to an ISO day string (YYYY-MM-DD), in local time.
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(y, m - 1, d + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
}
