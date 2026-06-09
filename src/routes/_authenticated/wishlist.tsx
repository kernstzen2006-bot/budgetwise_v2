import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";
import { Plus, X, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  async function load() {
    const { data } = await supabase.from("wishlist_items").select("*").eq("user_id", user!.id).eq("purchased", false).order("added_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { if (user) load(); }, [user]);

  function countdown(item: any) {
    if (!item.expires_at) return null;
    const ms = new Date(item.expires_at).getTime() - Date.now();
    if (ms <= 0) return "ready ✅";
    const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m left`;
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Wishlist</h1>
        <button onClick={() => setAdding(true)} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5"><Plus className="size-4" /> Add</button>
      </div>

      {items.length === 0 ? (
        <div className="card-surface p-10 text-center"><div className="text-5xl mb-2">💝</div><div className="text-muted-foreground">No wishlist items — keep that money safe!</div></div>
      ) : (
        <div className="space-y-2">
          {items.map(i => {
            const cd = countdown(i);
            return (
              <div key={i.id} className={`card-surface p-4 flex items-center gap-3 ${cd && cd !== "ready ✅" ? "border-warning/30" : ""}`}>
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{money(i.price)}{cd && <> · ⏳ {cd}</>}</div>
                </div>
                <button onClick={async () => { await supabase.from("wishlist_items").update({ purchased: true }).eq("id", i.id); load(); toast.success("Marked as purchased"); }} className="size-11 rounded-lg bg-primary/10 text-primary grid place-items-center"><Check className="size-4" /></button>
                <button onClick={async () => { await supabase.from("wishlist_items").delete().eq("id", i.id); load(); }} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      {adding && <AddItem userId={user!.id} onClose={() => { setAdding(false); load(); }} />}
    </AppShell>
  );
}

function AddItem({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [name, setName] = useState(""); const [price, setPrice] = useState("");
  async function save() {
    if (!name || !price) return;
    await supabase.from("wishlist_items").insert({ user_id: userId, name, price: Number(price) });
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-surface p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl">New wishlist item</h3><button onClick={onClose}><X className="size-5 text-muted-foreground" /></button></div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="What is it?" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-3 outline-none focus:border-primary" />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (R)" className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-4 outline-none focus:border-primary" />
        <button onClick={save} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold">Add to wishlist</button>
      </div>
    </div>
  );
}
