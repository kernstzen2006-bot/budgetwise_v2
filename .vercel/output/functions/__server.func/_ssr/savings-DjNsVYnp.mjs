import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { a as useSavingsGoals } from "./useData-BVBR7PZP.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { a as awardXp } from "./xp-DDK5X-To.mjs";
import { m as money } from "./format-CoFwZzXF.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, b as Lock, d as Trophy, X, e as Sparkles } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, L as LineChart, X as XAxis, Y as YAxis, T as Tooltip, a as Line } from "../_libs/recharts.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
function SavingsPage() {
  const {
    user
  } = useAuth();
  const {
    data: goals = []
  } = useSavingsGoals();
  const [creating, setCreating] = reactExports.useState(false);
  const [addingTo, setAddingTo] = reactExports.useState(null);
  const [jar, setJar] = reactExports.useState(0);
  const [whatIf, setWhatIf] = reactExports.useState(500);
  const months = 12;
  const projection = Array.from({
    length: months + 1
  }, (_, i) => ({
    month: `M${i}`,
    amount: i * whatIf
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Savings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCreating(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " New goal"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: "Spare Change Jar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl mt-1", children: money(jar) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Every purchase rounded up to the nearest R10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-3 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-secondary to-primary", style: {
        width: `${Math.min(100, jar / 500 * 100)}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        if (confirm("Withdraw the spare change?")) setJar(0);
      }, className: "text-xs text-primary mt-2 hover:underline", children: "Withdraw" })
    ] }),
    goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🎯" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-3", children: "No goals yet — what are you saving for?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCreating(true), className: "text-primary", children: "+ Create your first goal" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3 mb-6", children: goals.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(GoalCard, { goal: g, onAdd: () => setAddingTo(g) }, g.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "💭 What if you saved…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "R" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 100, max: 5e3, step: 50, value: whatIf, onChange: (e) => setWhatIf(Number(e.target.value)), className: "w-full accent-[#00E676]", style: {
          width: "100%",
          touchAction: "manipulation"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base sm:text-lg w-20 sm:w-24 text-right tabular-nums shrink-0", children: money(whatIf) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-3", children: "per month for the next 12 months" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: projection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: {
          fill: "#8A8D9A",
          fontSize: 10
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fill: "#8A8D9A",
          fontSize: 10
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "#1A1D27",
          border: "1px solid #3A3D4A"
        }, formatter: (v) => money(v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#00E676", strokeWidth: 2.5, dot: false })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-primary mt-2 font-medium", children: [
        "You'll have ",
        money(whatIf * 12),
        " in a year ✨"
      ] })
    ] }),
    creating && /* @__PURE__ */ jsxRuntimeExports.jsx(NewGoalModal, { userId: user.id, onClose: () => setCreating(false) }),
    addingTo && /* @__PURE__ */ jsxRuntimeExports.jsx(AddMoneyModal, { goal: addingTo, userId: user.id, onClose: () => setAddingTo(null) })
  ] });
}
function GoalCard({
  goal,
  onAdd
}) {
  const pct = Math.min(100, Math.round(Number(goal.current_amount) / Number(goal.target_amount) * 100));
  Number(goal.target_amount) - Number(goal.current_amount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 pr-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: goal.emoji || "🎯" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base md:text-lg truncate", children: goal.name }),
          goal.is_locked && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-3.5 text-warning shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
          money(goal.current_amount),
          " of ",
          money(goal.target_amount)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl text-primary", children: [
        pct,
        "%"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 rounded-full bg-border overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-secondary to-primary transition-all", style: {
      width: `${pct}%`
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3 text-sm", children: [
      pct >= 25 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "25%", children: "🌱" }),
      pct >= 50 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "50%", children: "🌿" }),
      pct >= 75 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "75%", children: "💪" }),
      pct >= 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4 text-warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAdd, className: "w-full h-11 rounded-md bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20", children: "+ Add money" })
  ] });
}
function NewGoalModal({
  userId,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [emoji, setEmoji] = reactExports.useState("🎯");
  const [target, setTarget] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const EMOJIS = ["🎯", "💻", "📱", "🏖️", "🚗", "🎓", "🎁", "👟", "🎮", "✈️", "🏠", "💍"];
  async function save() {
    if (!name || !target) return toast.error("Add a name and target");
    const {
      error
    } = await supabase.from("savings_goals").insert({
      user_id: userId,
      name,
      emoji,
      target_amount: Number(target),
      target_date: date || null,
      current_amount: 0
    });
    if (error) return toast.error(error.message);
    toast.success("Goal created 🎯");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 w-full max-w-md max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: "New goal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Goal name e.g. New Laptop", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-2 mb-3", children: EMOJIS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEmoji(e), className: `aspect-square rounded-lg border text-xl ${emoji === e ? "border-primary bg-primary/10" : "border-border bg-card"}`, children: e }, e)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-12 rounded-lg border border-border bg-card px-4 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mr-2", children: "R" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: target, onChange: (e) => setTarget(e.target.value), placeholder: "Target amount", className: "flex-1 bg-transparent outline-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold", children: "Create goal" })
  ] }) });
}
function AddMoneyModal({
  goal,
  userId,
  onClose
}) {
  const [amount, setAmount] = reactExports.useState("");
  async function save() {
    const amt = Number(amount);
    if (!amt) return;
    const newAmount = Number(goal.current_amount) + amt;
    const oldPct = Number(goal.current_amount) / Number(goal.target_amount) * 100;
    const newPct = newAmount / Number(goal.target_amount) * 100;
    await supabase.from("savings_contributions").insert({
      goal_id: goal.id,
      user_id: userId,
      amount: amt
    });
    await supabase.from("savings_goals").update({
      current_amount: newAmount
    }).eq("id", goal.id);
    const milestones = [{
      pct: 25,
      xp: 100
    }, {
      pct: 50,
      xp: 200
    }, {
      pct: 75,
      xp: 300
    }, {
      pct: 100,
      xp: 500
    }];
    for (const m of milestones) {
      if (oldPct < m.pct && newPct >= m.pct) {
        awardXp(m.xp, `Goal at ${m.pct}%`);
        toast.success(`🎉 ${m.pct}% reached!`, {
          description: goal.name
        });
      }
    }
    toast.success(`+${money(amt)} added to ${goal.name}`);
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 grid place-items-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl", children: [
        "Add to ",
        goal.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 -mr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-4", children: [
      money(goal.current_amount),
      " of ",
      money(goal.target_amount)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-14 rounded-lg border border-border bg-card px-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display text-muted-foreground mr-2", children: "R" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", autoFocus: true, value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0", className: "flex-1 bg-transparent outline-none text-2xl font-display" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: save, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
      " Add"
    ] })
  ] }) });
}
export {
  SavingsPage as component
};
