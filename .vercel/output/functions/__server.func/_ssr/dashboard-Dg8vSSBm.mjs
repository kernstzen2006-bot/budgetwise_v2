import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { u as useProfile, a as useGamification } from "./useProfile-DaGpqxO1.mjs";
import { u as useTransactions, b as useBudgets, a as useSavingsGoals } from "./useData-BVBR7PZP.mjs";
import { a as monthKey, d as daysUntilPayday, i as isoDate, m as money } from "./format-CoFwZzXF.mjs";
import { c as catInfo } from "./categories-Ca1bLiXQ.mjs";
import { l as levelFor, n as nextLevel, p as progressToNext } from "./levels-DsfGMUMN.mjs";
import "../_libs/sonner.mjs";
import { h as TrendingUp, i as TrendingDown, j as PiggyBank, W as Wallet, F as Flame, P as Plus } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, b as Pie, C as Cell, L as LineChart, X as XAxis, T as Tooltip, a as Line, e as RadialBarChart, f as RadialBar } from "../_libs/recharts.mjs";
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
function useCountUp(target, duration = 900) {
  const [val, setVal] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
function Dashboard() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    data: profile,
    isLoading: pLoad
  } = useProfile();
  const {
    data: gam
  } = useGamification();
  const {
    data: txs = []
  } = useTransactions({
    sinceMonth: true
  });
  const {
    data: allTxs = []
  } = useTransactions({
    limit: 60
  });
  const {
    data: budgets = []
  } = useBudgets(monthKey());
  const {
    data: goals = []
  } = useSavingsGoals();
  reactExports.useEffect(() => {
    if (profile && profile.onboarding_complete === false) navigate({
      to: "/onboarding"
    });
  }, [profile, navigate]);
  const payday = profile?.payday_date ?? 25;
  const daysToPay = daysUntilPayday(payday);
  const isPaydayToday = daysToPay === 0;
  const income = reactExports.useMemo(() => txs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0), [txs]);
  const expense = reactExports.useMemo(() => txs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0), [txs]);
  const net = income - expense;
  const balance = income - expense;
  const animatedBalance = useCountUp(balance);
  const totalSaved = reactExports.useMemo(() => goals.reduce((s, g) => s + Number(g.current_amount || 0), 0), [goals]);
  const budgetTotal = budgets.reduce((s, b) => s + Number(b.budget_amount || 0), 0);
  const budgetUsedPct = budgetTotal > 0 ? Math.min(100, Math.round(expense / budgetTotal * 100)) : 0;
  const donutData = [{
    name: "Used",
    value: Math.min(expense, budgetTotal || 1)
  }, {
    name: "Remaining",
    value: Math.max(0, (budgetTotal || 0) - expense)
  }];
  const donutColor = budgetUsedPct >= 100 ? "#FF4444" : budgetUsedPct >= 80 ? "#FFB300" : "#00E676";
  const weekData = reactExports.useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = isoDate(d);
      const spend = allTxs.filter((t) => t.type === "expense" && t.date === key).reduce((s, t) => s + Number(t.amount), 0);
      days.push({
        day: d.toLocaleDateString("en-ZA", {
          weekday: "short"
        }).slice(0, 2),
        spend
      });
    }
    return days;
  }, [allTxs]);
  const streak = reactExports.useMemo(() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = isoDate(d);
      const hasActivity = allTxs.some((t) => t.date === key);
      if (hasActivity) {
        s++;
      } else {
        if (i === 0) continue;
        else break;
      }
    }
    return s;
  }, [allTxs]);
  const savingsRate = income > 0 ? Math.max(0, net / income * 100) : 0;
  const healthScore = Math.min(100, Math.round((budgetUsedPct > 100 ? 0 : 100 - budgetUsedPct) * 0.5 + savingsRate * 0.5));
  const healthColor = healthScore >= 70 ? "#00E676" : healthScore >= 40 ? "#FFB300" : "#FF4444";
  const recentTxs = allTxs.slice(0, 5);
  const xp = gam?.total_xp ?? 0;
  const level = levelFor(xp);
  const nxt = nextLevel(xp);
  const pct = progressToNext(xp);
  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "there").split(" ")[0];
  if (pLoad) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-full bg-card border border-border grid place-items-center text-lg shrink-0", children: firstName.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg truncate", children: [
            "Hey, ",
            firstName,
            " 👋"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 w-40 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
            width: `${pct}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: nxt ? `${nxt.min - xp} XP to ${nxt.name}` : "Maxed out 💎" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 shrink-0", children: [
        level.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: level.icon, alt: level.name, className: "size-5 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: level.badge }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: level.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-surface p-5 mb-4 ${isPaydayToday ? "border-primary animate-pulse-glow" : "border-primary/40"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-primary font-bold mb-1", children: isPaydayToday ? "💸 Payday TODAY!" : "Payday" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl", children: isPaydayToday ? "Time to plan the month!" : `In ${daysToPay} day${daysToPay === 1 ? "" : "s"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: isPaydayToday ? "Update your budget below 💪" : daysToPay <= 3 ? "Hang tight. You've got this 💪" : "Stay sharp this week." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-6 mb-4 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 size-48 rounded-full bg-primary/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: "Current Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl sm:text-5xl mt-2 text-glow-green truncate", children: money(animatedBalance) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Income", value: money(income), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Spent", value: money(expense), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-4 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Saved", value: money(totalSaved), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "size-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Net", value: money(net), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: `size-4 ${net >= 0 ? "text-primary" : "text-destructive"}` }), valueColor: net >= 0 ? "text-primary" : "text-destructive" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Monthly spending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
          money(expense),
          " of ",
          money(budgetTotal)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-48 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Pie, { data: donutData, dataKey: "value", innerRadius: 55, outerRadius: 75, startAngle: 90, endAngle: -270, stroke: "none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: donutColor }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: "#3A3D4A" })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-3xl", children: [
              budgetUsedPct,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase", children: "used" })
          ] }) })
        ] }),
        budgets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budget", className: "block text-center text-xs text-primary mt-2 hover:underline", children: "Set up a budget →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Weekly spend" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Last 7 days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scroll-hide -mx-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[500px] h-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: weekData, margin: {
          top: 10,
          right: 10,
          left: 0,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", tick: {
            fill: "#8A8D9A",
            fontSize: 11
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#1A1D27",
            border: "1px solid #3A3D4A",
            borderRadius: 8
          }, labelStyle: {
            color: "#F5F5F0"
          }, formatter: (v) => money(v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "spend", stroke: "#00E676", strokeWidth: 2.5, dot: {
            fill: "#00E676",
            r: 3
          } })
        ] }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4 mb-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: `size-6 ${streak > 0 ? "text-warning" : "text-muted-foreground"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: streak > 0 ? `${streak} day${streak === 1 ? "" : "s"} active streak` : "Start your streak today!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: streak > 0 ? "Keep it going 🔥" : "Log a transaction to ignite it." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Recent transactions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/transactions", className: "text-xs text-primary hover:underline", children: "See all →" })
        ] }),
        recentTxs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No transactions yet — tap + to add your first!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: recentTxs.map((t) => {
          const cat = catInfo(t.category);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: cat.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate", children: t.note || cat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.date })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-semibold tabular-nums ${t.type === "income" ? "text-primary" : "text-foreground"}`, children: [
              t.type === "income" ? "+" : "−",
              money(Number(t.amount))
            ] })
          ] }, t.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Financial health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-36 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBarChart, { innerRadius: "70%", outerRadius: "100%", data: [{
            value: healthScore,
            fill: healthColor
          }], startAngle: 90, endAngle: -270, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBar, { dataKey: "value", cornerRadius: 20, background: {
            fill: "#3A3D4A"
          } }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl sm:text-3xl", style: {
            color: healthColor
          }, children: healthScore }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-center mt-2", children: healthScore >= 70 ? "Sharp! Keep it up." : healthScore >= 40 ? "Solid — bit more saving." : "Let's tighten up next week." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Savings goals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/savings", className: "text-xs text-primary hover:underline", children: "All goals →" })
      ] }),
      goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No goals yet — what are you saving for?", cta: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/savings", className: "inline-flex items-center gap-1 text-primary text-sm mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Create one"
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: goals.slice(0, 3).map((g) => {
        const pct2 = Math.min(100, Math.round(Number(g.current_amount) / Number(g.target_amount) * 100));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-1 gap-1 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 truncate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: g.emoji || "🎯" }),
              g.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground tabular-nums text-xs", children: [
              money(g.current_amount),
              " / ",
              money(g.target_amount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-primary to-secondary", style: {
            width: `${pct2}%`
          } }) })
        ] }, g.id);
      }) })
    ] })
  ] });
}
function StatCard({
  label,
  value,
  icon,
  valueColor
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display text-base sm:text-lg mt-1 tabular-nums truncate ${valueColor || ""}`, children: value })
  ] });
}
function EmptyState({
  text,
  cta
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 text-muted-foreground text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2", children: "🌱" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: text }),
    cta
  ] });
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-surface p-6 h-32 animate-pulse" }, i)) });
}
export {
  EmptyState,
  Dashboard as component
};
