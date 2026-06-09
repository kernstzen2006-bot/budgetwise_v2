import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";
import { Plus, X, Trash2, Repeat } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/subscriptions")({
  component: SubsPage,
});

function SubsPage() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  async function load() {
    const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).order("next_due_date");
    setSubs(data || []);
  }
  useEffect(() => { if (user) load(); }, [user]);

  const monthlyTotal = subs.filter(s => s.is_active).reduce((sum, s) => {
    const a = Number(s.amount);
    return sum + (s.billing_cycle === "yearly" ? a / 12 : s.billing_cycle === "weekly" ? a * 4.33 : a);
  }, 0);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Subscriptions</h1>
        <button onClick={() => setAdding(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5"><Plus className="size-4" /> Add</button>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-xs uppercase text-muted-foreground font-semibold">Monthly total</div>
        <div className="font-display text-3xl mt-1">{money(monthlyTotal)}</div>
      </div>

      {subs.length === 0 ? (
        <div className="card-surface p-10 text-center"><div className="text-5xl mb-2">🔁</div><div className="text-muted-foreground">No subscriptions tracked</div></div>
      ) : (
        <div className="space-y-2">
          {subs.map(s => {
            const due = new Date(s.next_due_date);
            const days = Math.ceil((due.getTime() - Date.now()) / 86400000);
            const soon = days <= 3 && days >= 0;
            return (
              <div key={s.id} className={`card-surface p-4 flex items-center gap-3 ${soon ? "border-warning/50" : ""}`}>
                <div className="size-10 rounded-lg bg-primary/10 grid place-items-center"><Repeat className="size-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.billing_cycle} · next {due.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}{soon && " · 🔔 due soon"}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{money(s.amount)}</div>
                <button onClick={async () => { await supabase.from("subscriptions").delete().eq("id", s.id); load(); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      {adding && <AddSub userId={user!.id} onClose={() => { setAdding(false); load(); }} />}
    </AppShell>
  );
}

function AddSub({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [cycle, setCycle] = useState("monthly"); const [date, setDate] = useState("");
  async function save() {
    if (!name || !amount) return toast.error("Name and amount required");
    await supabase.from("subscriptions").insert({ user_id: userId, name, amount: Number(amount), billing_cycle: cycle, next_due_date: date || new Date().toISOString().slice(0, 10) });
    toast.success("Saved"); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl">New subscription</h3><button onClick={onClose}><X className="size-5 text-muted-foreground" /></button></div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name e.g. Showmax" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (R)" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <select value={cycle} onChange={e => setCycle(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary">
          <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" />
        <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold">Save</button>
      </div>
    </div>
  );
}
