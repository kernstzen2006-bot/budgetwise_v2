import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useTransactions } from "@/hooks/useData";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { awardXp } from "@/lib/xp";
import { money, isoDate } from "@/lib/format";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, catInfo } from "@/lib/categories";
import { Plus, Search, Trash2, X, Filter, Download } from "lucide-react";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data: txs = [] } = useTransactions();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = useMemo(() => {
    return txs.filter((t: any) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (search && !`${t.note || ""} ${t.category || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [txs, search, typeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtered.forEach((t: any) => {
      const k = t.date;
      if (!groups[k]) groups[k] = [];
      groups[k].push(t);
    });
    return Object.entries(groups);
  }, [filtered]);

  const today = isoDate();
  const ydtDate = new Date(); ydtDate.setDate(ydtDate.getDate() - 1);
  const yesterday = isoDate(ydtDate);

  function exportCsv() {
    const rows = [["date", "type", "category", "amount", "note"], ...txs.map((t: any) => [t.date, t.type, t.category, t.amount, (t.note || "").replaceAll(",", ";")])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteTx(id: string) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["transactions"] });
    }
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Transactions</h1>
        <button onClick={exportCsv} className="size-11 rounded-lg border border-border bg-card grid place-items-center hover:border-primary/50 transition" title="Export CSV">
          <Download className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 h-11 rounded-lg border border-border bg-card px-3 focus-within:border-primary">
          <Search className="size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="h-11 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary max-w-[100px] sm:max-w-none">
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {grouped.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <div className="text-5xl mb-3">📋</div>
          <div className="text-muted-foreground">No transactions yet — tap + to add your first!</div>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
                {date === today ? "Today" : date === yesterday ? "Yesterday" : new Date(date).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}
              </div>
              <div className="card-surface divide-y divide-border">
                {items.map((t: any) => {
                  const cat = catInfo(t.category);
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-3 group">
                      <span className="text-2xl">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{cat.label}</div>
                        {t.note && <div className="text-xs text-muted-foreground truncate">{t.note}</div>}
                      </div>
                      <div className={`text-sm font-semibold tabular-nums ${t.type === "income" ? "text-primary" : "text-foreground"}`}>
                        {t.type === "income" ? "+" : "−"}{money(Number(t.amount))}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteTx(t.id); }} className="p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition text-muted-foreground md:text-destructive"><Trash2 className="size-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 size-14 rounded-full bg-primary text-primary-foreground grid place-items-center glow-green shadow-lg z-50"
      >
        <Plus className="size-6" />
      </button>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 h-12 px-5 rounded-full bg-primary text-primary-foreground items-center gap-2 font-semibold glow-green shadow-lg z-20"
      >
        <Plus className="size-5" /> Add transaction
      </button>

      {open && <AddTransaction onClose={() => setOpen(false)} />}
    </AppShell>
  );
}

function AddTransaction({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(isoDate());
  const [busy, setBusy] = useState(false);
  const [impulseModal, setImpulseModal] = useState(false);
  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function save(skipImpulseCheck = false) {
    const amt = Number(amount);
    if (!amt || !category) return toast.error("Add an amount and category");
    if (type === "expense" && !skipImpulseCheck && amt > (Number(profile?.impulse_threshold) || 500)) {
      setImpulseModal(true);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user!.id, amount: amt, type, category, note: note || null, date,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    awardXp(10, "Transaction logged");
    onClose();
  }

  async function addToWishlist() {
    const expiresAt = new Date(); expiresAt.setHours(expiresAt.getHours() + 24);
    await supabase.from("wishlist_items").insert({
      user_id: user!.id, name: note || catInfo(category).label, price: Number(amount), expires_at: expiresAt.toISOString(),
    });
    toast.success("Added to wishlist for 24 hours 💚");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-md bg-background border-t md:border border-border md:rounded-2xl rounded-t-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto overscroll-contain">
        <div className="md:hidden mx-auto w-10 h-1 rounded-full bg-border mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">New transaction</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="size-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-card rounded-lg mb-4">
          {(["expense", "income", "transfer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`h-9 rounded-md text-sm font-medium capitalize transition ${type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >{t}</button>
          ))}
        </div>

        <div className="flex items-center justify-center my-6">
          <span className="font-display text-4xl text-muted-foreground mr-2">R</span>
          <input
            type="number" inputMode="decimal" autoFocus
            value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
            className="w-full bg-transparent outline-none text-left font-display text-5xl tabular-nums"
          />
        </div>

        <div className="text-xs uppercase text-muted-foreground font-semibold mb-2">Category</div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`aspect-square rounded-lg border text-2xl flex flex-col items-center justify-center transition ${
                category === c.key ? "border-primary bg-primary/10 glow-green" : "border-border bg-card hover:border-primary/50"
              }`}
              title={c.label}
            >
              {c.emoji}
            </button>
          ))}
        </div>

        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="w-full h-12 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary mb-3" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary mb-4" />

        <button onClick={() => save()} disabled={busy} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50">
          {busy ? "Saving…" : "Save transaction"}
        </button>

        {impulseModal && (
          <div className="fixed inset-0 z-[60] bg-black/80 grid place-items-center p-4" onClick={() => setImpulseModal(false)}>
            <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 max-w-sm w-full">
              <div className="text-4xl mb-3">👀</div>
              <h3 className="font-display text-xl mb-2">Whoa, that's a big one</h3>
              <p className="text-sm text-muted-foreground mb-4">This is above your {money(Number(profile?.impulse_threshold) || 500)} impulse limit. Want to add it to your wishlist for 24 hours instead?</p>
              <div className="flex gap-2">
                <button onClick={() => { setImpulseModal(false); addToWishlist(); }} className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">Yes, wishlist it</button>
                <button onClick={() => { setImpulseModal(false); save(true); }} className="flex-1 h-11 rounded-lg border border-border text-sm">No, it's necessary</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
