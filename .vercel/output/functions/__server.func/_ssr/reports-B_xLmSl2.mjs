import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useTransactions } from "./useData-BVBR7PZP.mjs";
import { i as isoDate, s as startOfMonth, e as endOfMonth, m as money, p as prettyMonth } from "./format-CoFwZzXF.mjs";
import { c as catInfo } from "./categories-Ca1bLiXQ.mjs";
import "../_libs/sonner.mjs";
import { f as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, b as Pie, C as Cell, T as Tooltip, c as Legend, B as BarChart, X as XAxis, Y as YAxis, d as Bar, L as LineChart, a as Line } from "../_libs/recharts.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./router-DxPZX18F.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-28R2oWI3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function ReportsPage() {
  const {
    data: txs = []
  } = useTransactions({
    limit: 500
  });
  const [offset, setOffset] = reactExports.useState(0);
  const viewMonth = reactExports.useMemo(() => {
    const d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() + offset);
    return d;
  }, [offset]);
  const monthTxs = reactExports.useMemo(() => {
    const from = isoDate(startOfMonth(viewMonth));
    const to = isoDate(endOfMonth(viewMonth));
    return txs.filter((t) => t.date >= from && t.date <= to);
  }, [txs, viewMonth]);
  const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const net = income - expense;
  const savingsRate = income > 0 ? Math.round(net / income * 100) : 0;
  const byCat = reactExports.useMemo(() => {
    const m = {};
    monthTxs.forEach((t) => {
      if (t.type === "expense") m[t.category] = (m[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(m).map(([k, v]) => ({
      name: catInfo(k).label,
      value: v
    }));
  }, [monthTxs]);
  const sixMonths = reactExports.useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() - i);
      const f = isoDate(startOfMonth(d));
      const t = isoDate(endOfMonth(d));
      const inc = txs.filter((tx) => tx.type === "income" && tx.date >= f && tx.date <= t).reduce((s, x) => s + Number(x.amount), 0);
      const exp = txs.filter((tx) => tx.type === "expense" && tx.date >= f && tx.date <= t).reduce((s, x) => s + Number(x.amount), 0);
      arr.push({
        month: d.toLocaleDateString("en-ZA", {
          month: "short"
        }),
        Income: inc,
        Expenses: exp
      });
    }
    return arr;
  }, [txs]);
  const growth = reactExports.useMemo(() => {
    let cum = 0;
    return sixMonths.map((m) => {
      cum += m.Income - m.Expenses;
      return {
        month: m.month,
        total: cum
      };
    });
  }, [sixMonths]);
  const daysInMonth = endOfMonth(viewMonth).getDate();
  const heatmap = Array.from({
    length: daysInMonth
  }, (_, i) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
    const key = isoDate(d);
    const spend = monthTxs.filter((t) => t.type === "expense" && t.date === key).reduce((s, t) => s + Number(t.amount), 0);
    return {
      day: i + 1,
      spend
    };
  });
  const maxSpend = Math.max(1, ...heatmap.map((h) => h.spend));
  const noSpendDays = heatmap.filter((h) => h.spend === 0 && new Date(viewMonth.getFullYear(), viewMonth.getMonth(), h.day) <= /* @__PURE__ */ new Date()).length;
  const topCat = [...byCat].sort((a, b) => b.value - a.value)[0];
  const insights = [];
  if (topCat && income > 0) insights.push(`You spent ${money(topCat.value)} on ${topCat.name} — ${Math.round(topCat.value / income * 100)}% of income`);
  if (savingsRate > 20) insights.push("🔥 Solid savings month — keep it up!");
  if (expense > income && income > 0) insights.push("⚠️ Expenses are above income this month. Time to tighten up.");
  const grades = reactExports.useMemo(() => byCat.map((c) => {
    const pct = income > 0 ? c.value / income * 100 : 0;
    const grade = pct < 25 ? "A" : pct < 35 ? "B" : pct < 45 ? "C" : pct < 60 ? "D" : "F";
    return {
      name: c.name,
      value: c.value,
      grade
    };
  }), [byCat, income]);
  const COLORS = ["#00E676", "#00BFA5", "#FFB300", "#FF4444", "#8A8D9A", "#F5F5F0"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Reports" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOffset((o) => o - 1), className: "size-11 rounded-lg border border-border bg-card grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium min-w-[128px] text-center", children: prettyMonth(viewMonth) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOffset((o) => Math.min(0, o + 1)), className: "size-11 rounded-lg border border-border bg-card grid place-items-center disabled:opacity-30", disabled: offset >= 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sum, { label: "Income", value: money(income) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sum, { label: "Expenses", value: money(expense) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sum, { label: "Net", value: money(net), color: net >= 0 ? "text-primary" : "text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sum, { label: "Savings Rate", value: `${savingsRate}%`, color: "text-primary" })
    ] }),
    insights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3 mb-4", children: insights.map((i, k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-surface p-4 text-sm", children: i }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-2", children: "Spending by category" }),
        byCat.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 grid place-items-center text-muted-foreground text-sm", children: "No expenses yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: byCat, dataKey: "value", innerRadius: 40, outerRadius: 80, stroke: "none", children: byCat.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1A1D27",
            border: "1px solid #3A3D4A"
          }, formatter: (v) => money(v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { layout: "horizontal", align: "center", verticalAlign: "bottom", wrapperStyle: {
            fontSize: 11
          } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-2", children: "Income vs Expenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scroll-hide -mx-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[500px] h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: sixMonths, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: {
            fill: "#8A8D9A",
            fontSize: 11
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fill: "#8A8D9A",
            fontSize: 11
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1A1D27",
            border: "1px solid #3A3D4A"
          }, formatter: (v) => money(v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
            fontSize: 11
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Income", fill: "#00E676", radius: 3 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Expenses", fill: "#FF4444", radius: 3 })
        ] }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-2", children: "Savings growth" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scroll-hide -mx-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[500px] h-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: growth, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: {
          fill: "#8A8D9A",
          fontSize: 11
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fill: "#8A8D9A",
          fontSize: 11
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "#1A1D27",
          border: "1px solid #3A3D4A"
        }, formatter: (v) => money(v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "total", stroke: "#00E676", strokeWidth: 2.5, dot: {
          fill: "#00E676"
        } })
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Daily spend heatmap" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: heatmap.map((h) => {
        const intensity = h.spend / maxSpend;
        const bg = h.spend === 0 ? "#1A1D27" : `rgba(0, 230, 118, ${0.15 + intensity * 0.85})`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square min-w-[32px] rounded-md grid place-items-center text-[10px] text-muted-foreground border border-border", style: {
          backgroundColor: bg
        }, title: `${money(h.spend)} on ${h.day}`, children: h.day }, h.day);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-3", children: [
        "No-spend days this month: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: noSpendDays })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4 bg-[#F5F5F0] text-[#0F1117]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase mb-3 opacity-70", children: "— Monthly Report Card —" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl mb-3", children: prettyMonth(viewMonth) }),
      grades.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-70", children: "No spend tracked yet this month." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-black/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-1.5", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5", children: "Spent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 w-8 shrink-0", children: "Grade" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: grades.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-black/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5", children: g.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right tabular-nums", children: money(g.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right font-bold", children: g.grade })
        ] }, i)) })
      ] }) })
    ] })
  ] });
}
function Sum({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display text-lg mt-1 tabular-nums ${color || ""}`, children: value })
  ] });
}
export {
  ReportsPage as component
};
