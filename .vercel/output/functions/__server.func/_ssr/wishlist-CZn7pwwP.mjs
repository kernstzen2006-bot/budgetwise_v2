import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { m as money } from "./format-CoFwZzXF.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, C as Check, T as Trash2, X } from "../_libs/lucide-react.mjs";
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
function WishlistPage() {
  const {
    user
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [adding, setAdding] = reactExports.useState(false);
  async function load() {
    const {
      data
    } = await supabase.from("wishlist_items").select("*").eq("user_id", user.id).eq("purchased", false).order("added_at", {
      ascending: false
    });
    setItems(data || []);
  }
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  function countdown(item) {
    if (!item.expires_at) return null;
    const ms = new Date(item.expires_at).getTime() - Date.now();
    if (ms <= 0) return "ready ✅";
    const h = Math.floor(ms / 36e5);
    const m = Math.floor(ms % 36e5 / 6e4);
    return `${h}h ${m}m left`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Wishlist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAdding(true), className: "h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Add"
      ] })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: "💝" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "No wishlist items — keep that money safe!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((i) => {
      const cd = countdown(i);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-surface p-4 flex items-center gap-3 ${cd && cd !== "ready ✅" ? "border-warning/30" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: i.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            money(i.price),
            cd && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · ⏳ ",
              cd
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await supabase.from("wishlist_items").update({
            purchased: true
          }).eq("id", i.id);
          load();
          toast.success("Marked as purchased");
        }, className: "size-11 rounded-lg bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await supabase.from("wishlist_items").delete().eq("id", i.id);
          load();
        }, className: "p-2 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
      ] }, i.id);
    }) }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsx(AddItem, { userId: user.id, onClose: () => {
      setAdding(false);
      load();
    } })
  ] });
}
function AddItem({
  userId,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  async function save() {
    if (!name || !price) return;
    await supabase.from("wishlist_items").insert({
      user_id: userId,
      name,
      price: Number(price)
    });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 grid place-items-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "card-surface p-6 w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: "New wishlist item" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "What is it?", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: price, onChange: (e) => setPrice(e.target.value), placeholder: "Price (R)", className: "w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold", children: "Add to wishlist" })
  ] }) });
}
export {
  WishlistPage as component
};
