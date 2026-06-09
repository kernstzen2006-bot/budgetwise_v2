import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { H as House, k as ArrowLeftRight, l as ChartPie, j as PiggyBank, m as ChartColumn, n as CreditCard, R as Repeat, o as Heart, d as Trophy, p as Settings, c as LogOut, q as Menu, X } from "../_libs/lucide-react.mjs";
const PRIMARY = [
  { to: "/", label: "Home", icon: House },
  { to: "/transactions", label: "Tx", icon: ArrowLeftRight },
  { to: "/budget", label: "Budget", icon: ChartPie },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/reports", label: "Reports", icon: ChartColumn }
];
const SECONDARY = [
  { to: "/debts", label: "Debts", icon: CreditCard },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings }
];
function AppShell({ children }) {
  const { signOut } = useAuth();
  const loc = useLocation();
  const [showMore, setShowMore] = reactExports.useState(false);
  const MOBILE_MAIN = PRIMARY.slice(0, 3);
  const MOBILE_MORE = [...PRIMARY.slice(3), ...SECONDARY];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "fixed inset-y-0 left-0 w-60 border-r border-border bg-sidebar hidden md:flex flex-col p-4 z-30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.jpg", alt: "BudgetWise SA", className: "size-9 rounded-lg object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg leading-none", children: [
          "BudgetWise",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: " SA" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 flex flex-col gap-1", children: [...PRIMARY, ...SECONDARY].map((item) => {
        const active = loc.pathname === item.to || item.to !== "/" && loc.pathname.startsWith(item.to);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-card"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label === "Tx" ? "Transactions" : item.label })
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: signOut,
          className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
            "Sign out"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "md:pl-60 pb-28 md:pb-8 min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-5xl px-4 md:px-8 py-6", children }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 pb-[env(safe-area-inset-bottom)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4", children: [
      MOBILE_MAIN.map((item) => {
        const active = loc.pathname === item.to || item.to !== "/" && loc.pathname.startsWith(item.to);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `relative flex flex-col items-center justify-center gap-1 py-3 text-xs min-h-[44px] min-w-[44px] ${active ? "text-primary" : "text-muted-foreground"}`,
            children: [
              active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[2px] bg-primary rounded-b-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5", strokeWidth: active ? 2.5 : 2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: item.label })
            ]
          },
          item.to
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowMore(true),
          className: "relative flex flex-col items-center justify-center gap-1 py-3 text-xs min-h-[44px] min-w-[44px] text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5", strokeWidth: 2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: "More" })
          ]
        }
      )
    ] }) }),
    showMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end", onClick: () => setShowMore(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sidebar border-t border-border rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl ml-2", children: "More" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowMore(false), className: "size-11 flex items-center justify-center text-muted-foreground -mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 grid grid-cols-4 gap-y-6 gap-x-2", children: MOBILE_MORE.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            onClick: () => setShowMore(false),
            className: "flex flex-col items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-center leading-tight", children: item.label })
            ]
          },
          item.to
        );
      }) })
    ] }) })
  ] });
}
export {
  AppShell as A
};
