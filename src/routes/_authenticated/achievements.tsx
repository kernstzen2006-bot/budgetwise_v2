import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useGamification } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LEVELS, levelFor, nextLevel, progressToNext } from "@/lib/levels";
import { isoDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const { user } = useAuth();
  const { data: gam } = useGamification();
  const xp = gam?.total_xp ?? 0;
  const level = levelFor(xp);
  const next = nextLevel(xp);
  const pct = progressToNext(xp);

  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("xp_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(15).then(({ data }) => setHistory(data || []));
  }, [user, gam]);

  // 30-day heatmap (no-spend style)
  const heat = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return { key: isoDate(d), filled: Math.random() > 0.5 }; // placeholder visual
  });

  return (
    <AppShell>
      <h1 className="font-display text-2xl md:text-3xl mb-4">Achievements</h1>

      <div className="card-surface p-6 mb-4 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-3xl" />
        {level.icon ? (
          <img src={level.icon} alt={level.name} className="size-24 mx-auto rounded-full object-cover mb-4 shadow-lg shadow-black/50" />
        ) : (
          <div className="text-7xl mb-2">{level.badge}</div>
        )}
        <div className="font-display text-3xl" style={{ color: level.color }}>{level.name}</div>
        <div className="text-sm text-muted-foreground mt-1">{xp.toLocaleString("en-ZA")} XP</div>
        <div className="mt-4 max-w-xs mx-auto">
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary to-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2">{next ? `${(next.min - xp).toLocaleString("en-ZA")} XP to ${next.name}` : "Max level — Financial Legend 💎"}</div>
        </div>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-3">Level road</div>
        <div className="relative -mx-5">
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
          <div className="flex items-center gap-1 overflow-x-auto scroll-hide pb-2 px-5">
            {LEVELS.map((l) => {
              const reached = xp >= l.min;
              const current = level.name === l.name;
              return (
                <div key={l.name} className="flex flex-col items-center gap-1 min-w-[88px]">
                  <div className={`size-14 rounded-full flex items-center justify-center text-2xl border-2 ${current ? "border-primary glow-green animate-pulse-glow" : reached ? "border-primary/50 bg-primary/10" : "border-border bg-card opacity-40"} overflow-hidden`}>
                    {l.icon ? <img src={l.icon} alt={l.name} className="size-full object-cover" /> : l.badge}
                  </div>
                  <div className={`text-[10px] font-semibold text-center ${current ? "text-primary" : "text-muted-foreground"}`}>{l.name}</div>
                  <div className="text-[9px] text-muted-foreground tabular-nums">{l.min}+</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-3">Weekly challenges</div>
        <div className="space-y-3">
          {[
            { name: "Log 7 transactions", target: 7, current: Math.min(7, history.filter(h => h.action === "Transaction logged").length), xp: 150 },
            { name: "Stay under daily budget 3 days", target: 3, current: 0, xp: 150 },
            { name: "Add money to a savings goal", target: 1, current: 0, xp: 100 },
          ].map((c, i) => {
            const pct = Math.min(100, (c.current / c.target) * 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1 gap-2">
                  <span className="break-words">{c.name}</span>
                  <span className="text-primary text-xs font-semibold shrink-0">+{c.xp} XP</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.current} / {c.target}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-3">XP history</div>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground">No XP earned yet — log a transaction to start 💪</div>
        ) : (
          <ul className="divide-y divide-border">
            {history.map(h => (
              <li key={h.id} className="py-2 flex items-center justify-between text-sm gap-2">
                <span className="text-muted-foreground truncate flex-1">{h.action}</span>
                <span className="text-primary font-semibold shrink-0">+{h.amount} XP</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
