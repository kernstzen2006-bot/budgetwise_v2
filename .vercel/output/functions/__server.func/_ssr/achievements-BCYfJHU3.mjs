import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { a as useGamification } from "./useProfile-DaGpqxO1.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { l as levelFor, n as nextLevel, p as progressToNext, L as LEVELS } from "./levels-DsfGMUMN.mjs";
import { i as isoDate } from "./format-CoFwZzXF.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
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
function AchievementsPage() {
  const {
    user
  } = useAuth();
  const {
    data: gam
  } = useGamification();
  const xp = gam?.total_xp ?? 0;
  const level = levelFor(xp);
  const next = nextLevel(xp);
  const pct = progressToNext(xp);
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("xp_history").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).limit(15).then(({
      data
    }) => setHistory(data || []));
  }, [user, gam]);
  Array.from({
    length: 30
  }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      key: isoDate(d),
      filled: Math.random() > 0.5
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl mb-4", children: "Achievements" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-6 mb-4 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-3xl" }),
      level.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: level.icon, alt: level.name, className: "size-24 mx-auto rounded-full object-cover mb-4 shadow-lg shadow-black/50" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl mb-2", children: level.badge }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl", style: {
        color: level.color
      }, children: level.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
        xp.toLocaleString("en-ZA"),
        " XP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 max-w-xs mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-secondary to-primary transition-all", style: {
          width: `${pct}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-2", children: next ? `${(next.min - xp).toLocaleString("en-ZA")} XP to ${next.name}` : "Max level — Financial Legend 💎" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Level road" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative -mx-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto scroll-hide pb-2 px-5", children: LEVELS.map((l) => {
          const reached = xp >= l.min;
          const current = level.name === l.name;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 min-w-[88px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-14 rounded-full flex items-center justify-center text-2xl border-2 ${current ? "border-primary glow-green animate-pulse-glow" : reached ? "border-primary/50 bg-primary/10" : "border-border bg-card opacity-40"} overflow-hidden`, children: l.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.icon, alt: l.name, className: "size-full object-cover" }) : l.badge }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] font-semibold text-center ${current ? "text-primary" : "text-muted-foreground"}`, children: l.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground tabular-nums", children: [
              l.min,
              "+"
            ] })
          ] }, l.name);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Weekly challenges" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
        name: "Log 7 transactions",
        target: 7,
        current: Math.min(7, history.filter((h) => h.action === "Transaction logged").length),
        xp: 150
      }, {
        name: "Stay under daily budget 3 days",
        target: 3,
        current: 0,
        xp: 150
      }, {
        name: "Add money to a savings goal",
        target: 1,
        current: 0,
        xp: 100
      }].map((c, i) => {
        const pct2 = Math.min(100, c.current / c.target * 100);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary text-xs font-semibold shrink-0", children: [
              "+",
              c.xp,
              " XP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary", style: {
            width: `${pct2}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
            c.current,
            " / ",
            c.target
          ] })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "XP history" }),
      history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No XP earned yet — log a transaction to start 💪" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-2 flex items-center justify-between text-sm gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate flex-1", children: h.action }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold shrink-0", children: [
          "+",
          h.amount,
          " XP"
        ] })
      ] }, h.id)) })
    ] })
  ] });
}
export {
  AchievementsPage as component
};
