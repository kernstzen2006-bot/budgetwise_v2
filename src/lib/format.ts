export const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

export const zarShort = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export const money = (n: number | null | undefined) =>
  zar.format(Number(n ?? 0));

export const moneyShort = (n: number | null | undefined) =>
  zarShort.format(Number(n ?? 0));

/** Days until next payday (default 25th). */
export function daysUntilPayday(payday = 25, today = new Date()): number {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(t.getFullYear(), t.getMonth(), payday);
  if (next < t) next = new Date(t.getFullYear(), t.getMonth() + 1, payday);
  const ms = next.getTime() - t.getTime();
  return Math.round(ms / 86400000);
}

export const monthKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const prettyMonth = (d = new Date()) =>
  d.toLocaleString("en-ZA", { month: "long", year: "numeric" });

export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
export function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
export function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
