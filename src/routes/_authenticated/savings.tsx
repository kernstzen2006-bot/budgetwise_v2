import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSavingsGoals } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { awardXp } from "@/lib/xp";
import { money } from "@/lib/format";
import { Plus, X, Lock, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/savings")({
  component: SavingsPage,
});

function SavingsPage() {
  const { user } = useAuth();
  const { data: goals = [] } = useSavingsGoals();
  const [creating, setCreating] = useState(false);
  const [addingTo, setAddingTo] = useState<any>(null);
  const [jar, setJar] = useState(0);
  const [whatIf, setWhatIf] = useState(500);

  // What-if projection
  const months = 12;
  const projection = Array.from({ length: months + 1 }, (_, i) => ({
    month: `M${i}`,
    amount: i * whatIf,
  }));

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Savings</h1>
        <button onClick={() => setCreating(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Plus className="size-4" /> New goal
        </button>
      </div>

      {/* Round-up jar */}
      <div className="card-surface p-5 mb-4 relative overflow-hidden">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Spare Change Jar</div>
        <div className="font-display text-3xl mt-1">{money(jar)}</div>
        <div className="text-xs text-muted-foreground mt-1">Every purchase rounded up to the nearest R10</div>
        <div className="mt-3 h-3 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: `${Math.min(100, (jar / 500) * 100)}%` }} />
        </div>
        <button onClick={() => { if (confirm("Withdraw the spare change?")) setJar(0); }} className="text-xs text-primary mt-2 hover:underline">Withdraw</button>
      </div>

      {/* Goals */}
      {goals.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <div className="text-5xl mb-3">🎯</div>
          <div className="text-muted-foreground mb-3">No goals yet — what are you saving for?</div>
          <button onClick={() => setCreating(true)} className="text-primary">+ Create your first goal</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {goals.map((g: any) => <GoalCard key={g.id} goal={g} onAdd={() => setAddingTo(g)} />)}
        </div>
      )}

      {/* What-If calculator */}
      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-3">💭 What if you saved…</div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-muted-foreground">R</span>
          <input type="range" min={100} max={5000} step={50} value={whatIf} onChange={(e) => setWhatIf(Number(e.target.value))} className="w-full accent-[#00E676]" style={{ width: '100%', touchAction: 'manipulation' }} />
          <span className="font-display text-base sm:text-lg w-20 sm:w-24 text-right tabular-nums shrink-0">{money(whatIf)}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-3">per month for the next 12 months</div>
        <div className="h-32">
          <ResponsiveContainer>
            <LineChart data={projection}>
              <XAxis dataKey="month" tick={{ fill: "#8A8D9A", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8A8D9A", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A" }} formatter={(v: number) => money(v)} />
              <Line type="monotone" dataKey="amount" stroke="#00E676" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-primary mt-2 font-medium">You'll have {money(whatIf * 12)} in a year ✨</div>
      </div>

      {creating && <NewGoalModal userId={user!.id} onClose={() => setCreating(false)} />}
      {addingTo && <AddMoneyModal goal={addingTo} userId={user!.id} onClose={() => setAddingTo(null)} />}
    </AppShell>
  );
}

function GoalCard({ goal, onAdd }: { goal: any; onAdd: () => void }) {
  const pct = Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100));
  const remaining = Number(goal.target_amount) - Number(goal.current_amount);
  return (
    <div className="card-surface p-4 relative overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{goal.emoji || "🎯"}</span>
            <div className="font-display text-base md:text-lg truncate">{goal.name}</div>
            {goal.is_locked && <Lock className="size-3.5 text-warning shrink-0" />}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{money(goal.current_amount)} of {money(goal.target_amount)}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-xl text-primary">{pct}%</div>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-border overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-secondary to-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-1.5 mb-3 text-sm">
        {pct >= 25 && <span title="25%">🌱</span>}
        {pct >= 50 && <span title="50%">🌿</span>}
        {pct >= 75 && <span title="75%">💪</span>}
        {pct >= 100 && <Trophy className="size-4 text-warning" />}
      </div>
      <button onClick={onAdd} className="w-full h-11 rounded-md bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20">
        + Add money
      </button>
    </div>
  );
}

function NewGoalModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");
  const EMOJIS = ["🎯","💻","📱","🏖️","🚗","🎓","🎁","👟","🎮","✈️","🏠","💍"];

  async function save() {
    if (!name || !target) return toast.error("Add a name and target");
    const { error } = await supabase.from("savings_goals").insert({
      user_id: userId, name, emoji, target_amount: Number(target), target_date: date || null, current_amount: 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Goal created 🎯");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-md max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">New goal</h3>
          <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name e.g. New Laptop" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <div className="grid grid-cols-6 gap-2 mb-3">
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} className={`aspect-square rounded-lg border text-xl ${emoji === e ? "border-primary bg-primary/10" : "border-border bg-card"}`}>{e}</button>
          ))}
        </div>
        <div className="flex items-center h-12 rounded-lg border border-border bg-card px-4 mb-3">
          <span className="text-muted-foreground mr-2">R</span>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target amount" className="flex-1 bg-transparent outline-none" />
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" />
        <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold">Create goal</button>
      </div>
    </div>
  );
}

function AddMoneyModal({ goal, userId, onClose }: { goal: any; userId: string; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  async function save() {
    const amt = Number(amount);
    if (!amt) return;
    const newAmount = Number(goal.current_amount) + amt;
    const oldPct = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
    const newPct = (newAmount / Number(goal.target_amount)) * 100;
    await supabase.from("savings_contributions").insert({ goal_id: goal.id, user_id: userId, amount: amt });
    await supabase.from("savings_goals").update({ current_amount: newAmount }).eq("id", goal.id);
    // milestone XP
    const milestones = [{ pct: 25, xp: 100 }, { pct: 50, xp: 200 }, { pct: 75, xp: 300 }, { pct: 100, xp: 500 }];
    for (const m of milestones) {
      if (oldPct < m.pct && newPct >= m.pct) {
        awardXp(m.xp, `Goal at ${m.pct}%`);
        toast.success(`🎉 ${m.pct}% reached!`, { description: goal.name });
      }
    }
    toast.success(`+${money(amt)} added to ${goal.name}`);
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-xl">Add to {goal.name}</h3>
          <button onClick={onClose} className="p-1 -mr-1"><X className="size-5 text-muted-foreground" /></button>
        </div>
        <div className="text-sm text-muted-foreground mb-4">{money(goal.current_amount)} of {money(goal.target_amount)}</div>
        <div className="flex items-center h-14 rounded-lg border border-border bg-card px-4 mb-4">
          <span className="text-2xl font-display text-muted-foreground mr-2">R</span>
          <input type="number" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="flex-1 bg-transparent outline-none text-2xl font-display" />
        </div>
        <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
          <Sparkles className="size-4" /> Add
        </button>
      </div>
    </div>
  );
}
