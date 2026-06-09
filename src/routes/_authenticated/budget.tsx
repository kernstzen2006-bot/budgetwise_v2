import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useTransactions, useBudgets } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { money, monthKey, prettyMonth, daysUntilPayday } from "@/lib/format";
import { EXPENSE_CATEGORIES, catInfo } from "@/lib/categories";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/_authenticated/budget")({
  component: BudgetPage,
});

function BudgetPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const month = monthKey();
  const { data: budgets = [] } = useBudgets(month);
  const { data: txs = [] } = useTransactions({ sinceMonth: true });

  const spentByCat = useMemo(() => {
    const map: Record<string, number> = {};
    txs.forEach((t: any) => { if (t.type === "expense" && t.category) map[t.category] = (map[t.category] || 0) + Number(t.amount); });
    return map;
  }, [txs]);

  const totalBudget = budgets.reduce((s: number, b: any) => s + Number(b.budget_amount || 0), 0);
  const income = useMemo(() => txs.filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + Number(t.amount), 0), [txs]);
  const unassigned = income - totalBudget;

  const chartData = useMemo(() => budgets.map((b: any) => ({
    name: catInfo(b.category).label.split(" ")[0],
    Budget: Number(b.budget_amount),
    Spent: spentByCat[b.category] || 0,
  })), [budgets, spentByCat]);

  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  const today = new Date();
  const showPaydayBanner = today.getDate() === (profile?.payday_date ?? 25);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Budget</h1>
          <div className="text-sm text-muted-foreground">{prettyMonth()}</div>
        </div>
        <button onClick={() => setAdding(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Plus className="size-4" /> Add
        </button>
      </div>

      {showPaydayBanner && (
        <div className="card-surface p-4 mb-4 border-primary/50 animate-pulse-glow">
          <div className="font-display">💸 It's payday! Review your budget for the month?</div>
          <div className="text-xs text-muted-foreground mt-1">Tap any category below to refresh amounts.</div>
        </div>
      )}

      <div className={`card-surface p-5 mb-4 ${unassigned < 0 ? "border-destructive/50" : unassigned < income * 0.1 ? "border-warning/50" : "border-primary/40"}`}>
        <div className="text-xs uppercase text-muted-foreground font-semibold">Unassigned</div>
        <div className={`font-display text-2xl md:text-3xl mt-1 ${unassigned < 0 ? "text-destructive" : "text-primary"}`}>{money(unassigned)}</div>
        <div className="text-xs text-muted-foreground mt-1">of {money(income)} income</div>
      </div>

      {budgets.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <div className="text-5xl mb-3">📊</div>
          <div className="text-muted-foreground mb-3">No budgets yet</div>
          <button onClick={() => setAdding(true)} className="text-primary text-sm">+ Create your first category budget</button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {budgets.map((b: any) => {
            const cat = catInfo(b.category);
            const spent = spentByCat[b.category] || 0;
            const pct = (spent / Number(b.budget_amount)) * 100;
            const color = pct > 100 ? "bg-destructive" : pct > 80 ? "bg-warning" : "bg-primary";
            return (
              <button key={b.id} onClick={() => setEditing(b)} className="card-surface p-4 w-full text-left hover:border-primary/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0"><span className="text-xl shrink-0">{cat.emoji}</span><span className="font-medium truncate max-w-[120px]">{cat.label}</span></div>
                  <div className="text-xs tabular-nums text-muted-foreground shrink-0">{money(spent)} / {money(b.budget_amount)}</div>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className={`h-full transition-all ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <div className={`text-xs mt-1.5 ${pct > 100 ? "text-destructive" : "text-muted-foreground"}`}>
                  {pct > 100 ? `${money(spent - Number(b.budget_amount))} over budget` : `${money(Number(b.budget_amount) - spent)} remaining`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {budgets.length > 0 && (
        <div className="card-surface p-5">
          <div className="text-sm font-semibold mb-3">Budget vs Actual</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#8A8D9A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis width={0} tick={{ fill: "#8A8D9A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A", borderRadius: 8 }} formatter={(v: number) => money(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Budget" fill="#3A3D4A" radius={4} />
                <Bar dataKey="Spent" fill="#00E676" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(adding || editing) && (
        <BudgetEditor
          budget={editing}
          existing={budgets.map((b: any) => b.category)}
          onClose={() => { setAdding(false); setEditing(null); }}
          userId={user!.id}
          month={month}
        />
      )}
    </AppShell>
  );
}

import { useQueryClient } from "@tanstack/react-query";

function BudgetEditor({ budget, existing, onClose, userId, month }: { budget: any; existing: string[]; onClose: () => void; userId: string; month: string }) {
  const isCustomInit = budget?.category?.startsWith("custom:") || false;
  const [category, setCategory] = useState<string>(isCustomInit ? "custom" : (budget?.category || EXPENSE_CATEGORIES.find(c => !existing.includes(c.key))?.key || "food"));
  const [customName, setCustomName] = useState(isCustomInit ? budget.category.substring(7) : "");
  const [amount, setAmount] = useState(budget?.budget_amount?.toString() || "");
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
      const { error } = await supabase.from("budgets").update({ budget_amount: amt, category: finalCategory }).eq("id", budget.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("budgets").insert({ user_id: userId, month, category: finalCategory, budget_amount: amt });
      if (error) return toast.error(error.message);
    }
    toast.success("Budget saved");
    onClose();
  }
  async function del() {
    if (!budget) return;
    const { error } = await supabase.from("budgets").delete().eq("id", budget.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["budgets"] });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-md max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">{budget ? "Edit budget" : "New budget"}</h3>
          <button onClick={onClose} className="p-1 -mr-1"><X className="size-5 text-muted-foreground" /></button>
        </div>
        {!budget && (
          <>
            <div className="text-xs uppercase text-muted-foreground font-semibold mb-2">Category</div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
              {EXPENSE_CATEGORIES.filter(c => !existing.includes(c.key)).map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)} title={c.label} className={`aspect-square rounded-lg border text-2xl flex items-center justify-center transition ${category === c.key ? "border-primary bg-primary/10 glow-green" : "border-border bg-card hover:border-primary/50"}`}>{c.emoji}</button>
              ))}
              <button onClick={() => setCategory("custom")} className={`aspect-square rounded-lg border text-xs flex flex-col items-center justify-center font-medium transition ${category === "custom" ? "border-primary bg-primary/10 text-primary glow-green" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                <Plus className="size-4 mb-1" />
                Custom
              </button>
            </div>
            {category === "custom" && (
              <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Custom category name" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" autoFocus />
            )}
          </>
        )}
        {budget && (
          <div className="flex items-center gap-2 text-lg mb-4">
            <span className="text-2xl">{catInfo(budget.category).emoji}</span>
            {category === "custom" ? (
              <input value={customName} onChange={e => setCustomName(e.target.value)} className="flex-1 bg-transparent border-b border-border outline-none focus:border-primary px-1 pb-1" placeholder="Custom name" />
            ) : (
              <span>{catInfo(budget.category).label}</span>
            )}
          </div>
        )}
        <div className="text-xs uppercase text-muted-foreground font-semibold mb-2">Amount</div>
        <div className="flex items-center h-12 rounded-lg border border-border bg-card px-4 mb-4">
          <span className="text-muted-foreground mr-2">R</span>
          <input type="number" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 bg-transparent outline-none" />
        </div>
        <div className="flex gap-2">
          {budget && <button onClick={del} className="h-11 px-4 rounded-lg border border-destructive/50 text-destructive text-sm">Delete</button>}
          <button onClick={save} className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}
