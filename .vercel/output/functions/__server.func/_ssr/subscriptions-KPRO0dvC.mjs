import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { m as money } from "./format-CoFwZzXF.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, R as Repeat, T as Trash2, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function SubsPage() {
  const {
    user
  } = useAuth();
  const [subs, setSubs] = reactExports.useState([]);
  const [adding, setAdding] = reactExports.useState(false);
  async function load() {
    const {
      data
    } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).order("next_due_date");
    setSubs(data || []);
  }
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  const monthlyTotal = subs.filter((s) => s.is_active).reduce((sum, s) => {
    const a = Number(s.amount);
    return sum + (s.billing_cycle === "yearly" ? a / 12 : s.billing_cycle === "weekly" ? a * 4.33 : a);
  }, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Subscriptions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAdding(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold", children: "Monthly total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl mt-1", children: money(monthlyTotal) })
    ] }),
    subs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: "🔁" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "No subscriptions tracked" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subs.map((s) => {
      const due = new Date(s.next_due_date);
      const days = Math.ceil((due.getTime() - Date.now()) / 864e5);
      const soon = days <= 3 && days >= 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-surface p-4 flex items-center gap-3 ${soon ? "border-warning/50" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "size-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
            s.billing_cycle,
            " · next ",
            due.toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short"
            }),
            soon && " · 🔔 due soon"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold tabular-nums", children: money(s.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await supabase.from("subscriptions").delete().eq("id", s.id);
          load();
        }, className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
      ] }, s.id);
    }) }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsx(AddSub, { userId: user.id, onClose: () => {
      setAdding(false);
      load();
    } })
  ] });
}
function AddSub({
  userId,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [cycle, setCycle] = reactExports.useState("monthly");
  const [date, setDate] = reactExports.useState("");
  async function save() {
    if (!name || !amount) return toast.error("Name and amount required");
    await supabase.from("subscriptions").insert({
      user_id: userId,
      name,
      amount: Number(amount),
      billing_cycle: cycle,
      next_due_date: date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    toast.success("Saved");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 grid place-items-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: "New subscription" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Name e.g. Showmax", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Amount (R)", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: cycle, onChange: (e) => setCycle(e.target.value), className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "weekly", children: "Weekly" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: "Monthly" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yearly", children: "Yearly" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold", children: "Save" })
  ] }) });
}
export {
  SubsPage as component
};
