import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useTransactions } from "./useData-BVBR7PZP.mjs";
import { u as useProfile } from "./useProfile-DaGpqxO1.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { a as awardXp } from "./xp-DDK5X-To.mjs";
import { i as isoDate, m as money } from "./format-CoFwZzXF.mjs";
import { c as catInfo, I as INCOME_CATEGORIES, E as EXPENSE_CATEGORIES } from "./categories-Ca1bLiXQ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { D as Download, S as Search, T as Trash2, P as Plus, X } from "../_libs/lucide-react.mjs";
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
function TransactionsPage() {
  const {
    data: txs = []
  } = useTransactions();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const filtered = reactExports.useMemo(() => {
    return txs.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (search && !`${t.note || ""} ${t.category || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [txs, search, typeFilter]);
  const grouped = reactExports.useMemo(() => {
    const groups = {};
    filtered.forEach((t) => {
      const k = t.date;
      if (!groups[k]) groups[k] = [];
      groups[k].push(t);
    });
    return Object.entries(groups);
  }, [filtered]);
  const today = isoDate();
  const ydtDate = /* @__PURE__ */ new Date();
  ydtDate.setDate(ydtDate.getDate() - 1);
  const yesterday = isoDate(ydtDate);
  function exportCsv() {
    const rows = [["date", "type", "category", "amount", "note"], ...txs.map((t) => [t.date, t.type, t.category, t.amount, (t.note || "").replaceAll(",", ";")])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function deleteTx(id) {
    const {
      error
    } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["transactions"]
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportCsv, className: "size-11 rounded-lg border border-border bg-card grid place-items-center hover:border-primary/50 transition", title: "Export CSV", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 h-11 rounded-lg border border-border bg-card px-3 focus-within:border-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search transactions", className: "flex-1 bg-transparent outline-none text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "h-11 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary max-w-[100px] sm:max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "income", children: "Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "expense", children: "Expense" })
      ] })
    ] }),
    grouped.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "📋" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "No transactions yet — tap + to add your first!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: grouped.map(([date, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1", children: date === today ? "Today" : date === yesterday ? "Yesterday" : new Date(date).toLocaleDateString("en-ZA", {
        weekday: "short",
        day: "numeric",
        month: "short"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-surface divide-y divide-border", children: items.map((t) => {
        const cat = catInfo(t.category);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: cat.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: cat.label }),
            t.note && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: t.note })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-semibold tabular-nums ${t.type === "income" ? "text-primary" : "text-foreground"}`, children: [
            t.type === "income" ? "+" : "−",
            money(Number(t.amount))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            deleteTx(t.id);
          }, className: "p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition text-muted-foreground md:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] }, t.id);
      }) })
    ] }, date)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "md:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 size-14 rounded-full bg-primary text-primary-foreground grid place-items-center glow-green shadow-lg z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "hidden md:flex fixed bottom-6 right-6 h-12 px-5 rounded-full bg-primary text-primary-foreground items-center gap-2 font-semibold glow-green shadow-lg z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5" }),
      " Add transaction"
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(AddTransaction, { onClose: () => setOpen(false) })
  ] });
}
function AddTransaction({
  onClose
}) {
  const {
    user
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const [type, setType] = reactExports.useState("expense");
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(isoDate());
  const [busy, setBusy] = reactExports.useState(false);
  const [impulseModal, setImpulseModal] = reactExports.useState(false);
  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  async function save(skipImpulseCheck = false) {
    const amt = Number(amount);
    if (!amt || !category) return toast.error("Add an amount and category");
    if (type === "expense" && !skipImpulseCheck && amt > (Number(profile?.impulse_threshold) || 500)) {
      setImpulseModal(true);
      return;
    }
    setBusy(true);
    const {
      error
    } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: amt,
      type,
      category,
      note: note || null,
      date
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    awardXp(10, "Transaction logged");
    onClose();
  }
  async function addToWishlist() {
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await supabase.from("wishlist_items").insert({
      user_id: user.id,
      name: note || catInfo(category).label,
      price: Number(amount),
      expires_at: expiresAt.toISOString()
    });
    toast.success("Added to wishlist for 24 hours 💚");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full md:max-w-md bg-background border-t md:border border-border md:rounded-2xl rounded-t-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto overscroll-contain", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden mx-auto w-10 h-1 rounded-full bg-border mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "New transaction" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-foreground p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 p-1 bg-card rounded-lg mb-4", children: ["expense", "income", "transfer"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setType(t), className: `h-9 rounded-md text-sm font-medium capitalize transition ${type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`, children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center my-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl text-muted-foreground mr-2", children: "R" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", inputMode: "decimal", autoFocus: true, value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0", className: "w-full bg-transparent outline-none text-left font-display text-5xl tabular-nums" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground font-semibold mb-2", children: "Category" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4", children: cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c.key), className: `aspect-square rounded-lg border text-2xl flex flex-col items-center justify-center transition ${category === c.key ? "border-primary bg-primary/10 glow-green" : "border-border bg-card hover:border-primary/50"}`, title: c.label, children: c.emoji }, c.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Note (optional)", className: "w-full h-12 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "w-full h-12 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save(), disabled: busy, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50", children: busy ? "Saving…" : "Save transaction" }),
    impulseModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[60] bg-black/80 grid place-items-center p-4", onClick: () => setImpulseModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 max-w-sm w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "👀" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mb-2", children: "Whoa, that's a big one" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
        "This is above your ",
        money(Number(profile?.impulse_threshold) || 500),
        " impulse limit. Want to add it to your wishlist for 24 hours instead?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setImpulseModal(false);
          addToWishlist();
        }, className: "flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm", children: "Yes, wishlist it" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setImpulseModal(false);
          save(true);
        }, className: "flex-1 h-11 rounded-lg border border-border text-sm", children: "No, it's necessary" })
      ] })
    ] }) })
  ] }) });
}
export {
  TransactionsPage as component
};
