import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/debts")({
  component: DebtsPage,
});

function DebtsPage() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<any[]>([]);
  const [tab, setTab] = useState<"owe" | "owed">("owe");
  const [adding, setAdding] = useState(false);

  async function load() {
    const { data } = await supabase.from("debts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setDebts(data || []);
  }
  useEffect(() => { if (user) load(); }, [user]);

  const filtered = debts.filter(d => tab === "owe" ? d.direction !== "owed_to_me" : d.direction === "owed_to_me");

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Debts</h1>
        <button onClick={() => setAdding(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Plus className="size-4" /> Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-card rounded-lg mb-4">
        <button onClick={() => setTab("owe")} className={`h-11 rounded-md text-sm font-medium ${tab === "owe" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>You owe</button>
        <button onClick={() => setTab("owed")} className={`h-11 rounded-md text-sm font-medium ${tab === "owed" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>They owe you</button>
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface p-10 text-center"><div className="text-5xl mb-2">💳</div><div className="text-muted-foreground">{tab === "owe" ? "No debts tracked — clean slate!" : "Nobody owes you anything"}</div></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => {
            const paid = Number(d.total_amount) - Number(d.remaining_amount);
            const pct = (paid / Number(d.total_amount)) * 100;
            return (
              <div key={d.id} className="card-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{d.name}</div>
                  <button onClick={async () => { await supabase.from("debts").delete().eq("id", d.id); load(); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{money(d.remaining_amount)} remaining of {money(d.total_amount)}</div>
                <div className="h-2 rounded-full bg-border overflow-hidden mb-2">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                {d.monthly_payment && (
                  <div className="text-xs text-muted-foreground">{money(d.monthly_payment)}/mo<br/>{Math.ceil(Number(d.remaining_amount) / Number(d.monthly_payment))} months left</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {adding && <AddDebt userId={user!.id} onClose={() => { setAdding(false); load(); }} direction={tab === "owed" ? "owed_to_me" : "owed_by_me"} />}
    </AppShell>
  );
}

function AddDebt({ userId, onClose, direction }: { userId: string; onClose: () => void; direction: string }) {
  const [name, setName] = useState(""); const [total, setTotal] = useState(""); const [rate, setRate] = useState(""); const [monthly, setMonthly] = useState(""); const [method, setMethod] = useState("avalanche");
  async function save() {
    if (!name || !total) return toast.error("Add a name and total");
    const t = Number(total);
    await supabase.from("debts").insert({ user_id: userId, name, total_amount: t, remaining_amount: t, interest_rate: Number(rate) || 0, monthly_payment: Number(monthly) || 0, payoff_method: method, direction });
    toast.success("Saved"); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl">Add debt</h3><button onClick={onClose}><X className="size-5 text-muted-foreground" /></button></div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name e.g. NSFAS" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="Total amount (R)" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="Interest rate %" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="Monthly payment (R)" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <select value={method} onChange={e => setMethod(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary">
          <option value="avalanche">Avalanche (highest interest first)</option>
          <option value="snowball">Snowball (smallest balance first)</option>
        </select>
        <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold">Save</button>
      </div>
    </div>
  );
}
