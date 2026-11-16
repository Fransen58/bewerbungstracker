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

// Two-digit day and month keep dates aligned in tables (mono font).
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export function formatDate(date: string, locale: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, DATE_FORMAT);
}

// Same format for full timestamps (e.g. created_at), in local time.
export function formatTimestamp(timestamp: string, locale: string): string {
  return new Date(timestamp).toLocaleDateString(locale, DATE_FORMAT);
}

// Adds days to an ISO day string (YYYY-MM-DD), in local time.
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(y, m - 1, d + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
}
