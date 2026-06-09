const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2
});
const money = (n) => zar.format(Number(n ?? 0));
function daysUntilPayday(payday = 25, today = /* @__PURE__ */ new Date()) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(t.getFullYear(), t.getMonth(), payday);
  if (next < t) next = new Date(t.getFullYear(), t.getMonth() + 1, payday);
  const ms = next.getTime() - t.getTime();
  return Math.round(ms / 864e5);
}
const monthKey = (d = /* @__PURE__ */ new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const prettyMonth = (d = /* @__PURE__ */ new Date()) => d.toLocaleString("en-ZA", { month: "long", year: "numeric" });
function startOfMonth(d = /* @__PURE__ */ new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d = /* @__PURE__ */ new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function isoDate(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().slice(0, 10);
}
export {
  monthKey as a,
  daysUntilPayday as d,
  endOfMonth as e,
  isoDate as i,
  money as m,
  prettyMonth as p,
  startOfMonth as s
};
