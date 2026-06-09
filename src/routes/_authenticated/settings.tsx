import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const [form, setForm] = useState<any>({});

  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  async function save() {
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, institution: form.institution, student_year: form.student_year,
      monthly_income: Number(form.monthly_income) || 0, payday_date: Number(form.payday_date) || 25,
      impulse_threshold: Number(form.impulse_threshold) || 500,
    }).eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Saved ✅");
  }

  async function exportAll() {
    const tables = ["transactions", "budgets", "savings_goals", "subscriptions", "debts"];
    const out: any = {};
    for (const t of tables) {
      const { data } = await supabase.from(t as any).select("*").eq("user_id", user!.id);
      out[t] = data;
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "budgetwise-export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl md:text-3xl mb-4">Settings</h1>

      <div className="card-surface p-5 mb-4 space-y-3">
        <div className="text-sm font-semibold mb-1">Profile</div>
        <Input label="Full name" value={form.full_name || ""} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Input label="Institution" value={form.institution || ""} onChange={(v) => setForm({ ...form, institution: v })} />
        <Input label="Year of study" value={form.student_year || ""} onChange={(v) => setForm({ ...form, student_year: v })} />
      </div>

      <div className="card-surface p-5 mb-4 space-y-3">
        <div className="text-sm font-semibold mb-1">Money</div>
        <Input label="Monthly income (R)" type="number" value={String(form.monthly_income || 0)} onChange={(v) => setForm({ ...form, monthly_income: v })} />
        <Input label="Payday date (1-31)" type="number" value={String(form.payday_date || 25)} onChange={(v) => setForm({ ...form, payday_date: v })} />
        <Input label="Impulse threshold (R)" type="number" value={String(form.impulse_threshold || 500)} onChange={(v) => setForm({ ...form, impulse_threshold: v })} />
      </div>

      <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold mb-3">Save changes</button>
      <button onClick={exportAll} className="w-full h-11 rounded-lg border border-border bg-card text-sm mb-3">Export all data (JSON)</button>
      <button onClick={async () => { await signOut(); navigate({ to: "/auth", replace: true }); }} className="w-full h-11 rounded-lg border border-destructive/50 text-destructive text-sm flex items-center justify-center gap-2"><LogOut className="size-4" /> Sign out</button>

      <div className="text-center text-xs text-muted-foreground mt-8 pb-4">
        BudgetWise SA · Track smart. Save harder.
      </div>
    </AppShell>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}
