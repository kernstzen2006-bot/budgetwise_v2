import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-CBGTsuQm.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { u as useProfile } from "./useProfile-DaGpqxO1.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as LogOut } from "../_libs/lucide-react.mjs";
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
function SettingsPage() {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const [form, setForm] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);
  async function save() {
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: form.full_name,
      institution: form.institution,
      student_year: form.student_year,
      monthly_income: Number(form.monthly_income) || 0,
      payday_date: Number(form.payday_date) || 25,
      impulse_threshold: Number(form.impulse_threshold) || 500
    }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Saved ✅");
  }
  async function exportAll() {
    const tables = ["transactions", "budgets", "savings_goals", "subscriptions", "debts"];
    const out = {};
    for (const t of tables) {
      const {
        data
      } = await supabase.from(t).select("*").eq("user_id", user.id);
      out[t] = data;
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budgetwise-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl mb-4", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Full name", value: form.full_name || "", onChange: (v) => setForm({
        ...form,
        full_name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Institution", value: form.institution || "", onChange: (v) => setForm({
        ...form,
        institution: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Year of study", value: form.student_year || "", onChange: (v) => setForm({
        ...form,
        student_year: v
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5 mb-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Money" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Monthly income (R)", type: "number", value: String(form.monthly_income || 0), onChange: (v) => setForm({
        ...form,
        monthly_income: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Payday date (1-31)", type: "number", value: String(form.payday_date || 25), onChange: (v) => setForm({
        ...form,
        payday_date: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Impulse threshold (R)", type: "number", value: String(form.impulse_threshold || 500), onChange: (v) => setForm({
        ...form,
        impulse_threshold: v
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold mb-3", children: "Save changes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportAll, className: "w-full h-11 rounded-lg border border-border bg-card text-sm mb-3", children: "Export all data (JSON)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
      await signOut();
      navigate({
        to: "/auth",
        replace: true
      });
    }, className: "w-full h-11 rounded-lg border border-destructive/50 text-destructive text-sm flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
      " Sign out"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground mt-8 pb-4", children: "BudgetWise SA · Track smart. Save harder." })
  ] });
}
function Input({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), className: "w-full h-11 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary" })
  ] });
}
export {
  SettingsPage as component
};
