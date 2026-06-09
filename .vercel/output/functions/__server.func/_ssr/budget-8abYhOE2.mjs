import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { b as useBudgets, u as useTransactions } from "./useData-BVBR7PZP.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { u as useProfile } from "./useProfile-DaGpqxO1.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { a as monthKey, p as prettyMonth, m as money } from "./format-CoFwZzXF.mjs";
import { c as catInfo, E as EXPENSE_CATEGORIES } from "./categories-Ca1bLiXQ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { P as Plus, X } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, X as XAxis, Y as YAxis, T as Tooltip, c as Legend, d as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/tanstack__query-core.mjs";
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
function BudgetPage() {
  const {
    user
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const month = monthKey();
  const {
    data: budgets = []
  } = useBudgets(month);
  const {
    data: txs = []
  } = useTransactions({
    sinceMonth: true
  });
  const spentByCat = reactExports.useMemo(() => {
    const map = {};
    txs.forEach((t) => {
      if (t.type === "expense" && t.category) map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return map;
  }, [txs]);
  const totalBudget = budgets.reduce((s, b) => s + Number(b.budget_amount || 0), 0);
  const income = reactExports.useMemo(() => txs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0), [txs]);
  const unassigned = income - totalBudget;
  const chartData = reactExports.useMemo(() => budgets.map((b) => ({
    name: catInfo(b.category).label.split(" ")[0],
    Budget: Number(b.budget_amount),
    Spent: spentByCat[b.category] || 0
  })), [budgets, spentByCat]);
  const [editing, setEditing] = reactExports.useState(null);
  const [adding, setAdding] = reactExports.useState(false);
  const today = /* @__PURE__ */ new Date();
  const showPaydayBanner = today.getDate() === (profile?.payday_date ?? 25);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Budget" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: prettyMonth() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAdding(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Add"
      ] })
    ] }),
    showPaydayBanner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4 mb-4 border-primary/50 animate-pulse-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display", children: "💸 It's payday! Review your budget for the month?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Tap any category below to refresh amounts." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-surface p-5 mb-4 ${unassigned < 0 ? "border-destructive/50" : unassigned < income * 0.1 ? "border-warning/50" : "border-primary/40"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold", children: "Unassigned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display text-2xl md:text-3xl mt-1 ${unassigned < 0 ? "text-destructive" : "text-primary"}`, children: money(unassigned) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
        "of ",
        money(income),
        " income"
      ] })
    ] }),
    budgets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "📊" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-3", children: "No budgets yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAdding(true), className: "text-primary text-sm", children: "+ Create your first category budget" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-6", children: budgets.map((b) => {
      const cat = catInfo(b.category);
      const spent = spentByCat[b.category] || 0;
      const pct = spent / Number(b.budget_amount) * 100;
      const color = pct > 100 ? "bg-destructive" : pct > 80 ? "bg-warning" : "bg-primary";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing(b), className: "card-surface p-4 w-full text-left hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: cat.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-[120px]", children: cat.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs tabular-nums text-muted-foreground shrink-0", children: [
            money(spent),
            " / ",
            money(b.budget_amount)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full transition-all ${color}`, style: {
          width: `${Math.min(100, pct)}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs mt-1.5 ${pct > 100 ? "text-destructive" : "text-muted-foreground"}`, children: pct > 100 ? `${money(spent - Number(b.budget_amount))} over budget` : `${money(Number(b.budget_amount) - spent)} remaining` })
      ] }, b.id);
    }) }),
    budgets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Budget vs Actual" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tick: {
          fill: "#8A8D9A",
          fontSize: 10
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { width: 0, tick: {
          fill: "#8A8D9A",
          fontSize: 10
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "#1A1D27",
          border: "1px solid #3A3D4A",
          borderRadius: 8
        }, formatter: (v) => money(v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Budget", fill: "#3A3D4A", radius: 4 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Spent", fill: "#00E676", radius: 4 })
      ] }) }) })
    ] }),
    (adding || editing) && /* @__PURE__ */ jsxRuntimeExports.jsx(BudgetEditor, { budget: editing, existing: budgets.map((b) => b.category), onClose: () => {
      setAdding(false);
      setEditing(null);
    }, userId: user.id, month })
  ] });
}
function BudgetEditor({
  budget,
  existing,
  onClose,
  userId,
  month
}) {
  const isCustomInit = budget?.category?.startsWith("custom:") || false;
  const [category, setCategory] = reactExports.useState(isCustomInit ? "custom" : budget?.category || EXPENSE_CATEGORIES.find((c) => !existing.includes(c.key))?.key || "food");
  const [customName, setCustomName] = reactExports.useState(isCustomInit ? budget.category.substring(7) : "");
  const [amount, setAmount] = reactExports.useState(budget?.budget_amount?.toString() || "");
  const qc = useQueryClient();
  async function save() {
    const amt = Number(amount);
    if (!amt) return toast.error("Enter an amount");
    let finalCategory = category;
    if (category === "custom") {
      if (!customName.trim()) return toast.error("Enter a custom category name");
      finalCategory = `custom:${customName.trim()}`;
    }
    if (budget) {
      const {
        error
      } = await supabase.from("budgets").update({
        budget_amount: amt,
        category: finalCategory
      }).eq("id", budget.id);
      if (error) return toast.error(error.message);
    } else {
      const {
        error
      } = await supabase.from("budgets").insert({
        user_id: userId,
        month,
        category: finalCategory,
        budget_amount: amt
      });
      if (error) return toast.error(error.message);
    }
    toast.success("Budget saved");
    onClose();
  }
  async function del() {
    if (!budget) return;
    const {
      error
    } = await supabase.from("budgets").delete().eq("id", budget.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({
      queryKey: ["budgets"]
    });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 w-full max-w-md max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: budget ? "Edit budget" : "New budget" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 -mr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-muted-foreground" }) })
    ] }),
    !budget && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold mb-2", children: "Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4", children: [
        EXPENSE_CATEGORIES.filter((c) => !existing.includes(c.key)).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c.key), title: c.label, className: `aspect-square rounded-lg border text-2xl flex items-center justify-center transition ${category === c.key ? "border-primary bg-primary/10 glow-green" : "border-border bg-card hover:border-primary/50"}`, children: c.emoji }, c.key)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCategory("custom"), className: `aspect-square rounded-lg border text-xs flex flex-col items-center justify-center font-medium transition ${category === "custom" ? "border-primary bg-primary/10 text-primary glow-green" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mb-1" }),
          "Custom"
        ] })
      ] }),
      category === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: customName, onChange: (e) => setCustomName(e.target.value), placeholder: "Custom category name", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary", autoFocus: true })
    ] }),
    budget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-lg mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: catInfo(budget.category).emoji }),
      category === "custom" ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: customName, onChange: (e) => setCustomName(e.target.value), className: "flex-1 bg-transparent border-b border-border outline-none focus:border-primary px-1 pb-1", placeholder: "Custom name" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: catInfo(budget.category).label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold mb-2", children: "Amount" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-12 rounded-lg border border-border bg-card px-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mr-2", children: "R" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", autoFocus: true, value: amount, onChange: (e) => setAmount(e.target.value), className: "flex-1 bg-transparent outline-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      budget && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: del, className: "h-11 px-4 rounded-lg border border-destructive/50 text-destructive text-sm", children: "Delete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold", children: "Save" })
    ] })
  ] }) });
}
export {
  BudgetPage as component
};
