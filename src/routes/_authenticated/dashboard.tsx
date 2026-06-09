import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useGamification } from "@/hooks/useProfile";
import { useTransactions, useBudgets, useSavingsGoals } from "@/hooks/useData";
import { useCountUp } from "@/hooks/useCountUp";
import { money, daysUntilPayday, monthKey, isoDate } from "@/lib/format";
import { catInfo } from "@/lib/categories";
import { levelFor, nextLevel, progressToNext } from "@/lib/levels";
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Flame, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, Tooltip, RadialBarChart, RadialBar } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: pLoad } = useProfile();
  const { data: gam } = useGamification();
  const { data: txs = [] } = useTransactions({ sinceMonth: true });
  const { data: allTxs = [] } = useTransactions({ limit: 60 });
  const { data: budgets = [] } = useBudgets(monthKey());
  const { data: goals = [] } = useSavingsGoals();

  // redirect to onboarding if not done
  useEffect(() => {
    if (profile && profile.onboarding_complete === false) navigate({ to: "/onboarding" });
  }, [profile, navigate]);

  const payday = profile?.payday_date ?? 25;
  const daysToPay = daysUntilPayday(payday);
  const isPaydayToday = daysToPay === 0;

  const income = useMemo(() => txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0), [txs]);
  const expense = useMemo(() => txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0), [txs]);
  const net = income - expense;
  const balance = income - expense;
  const animatedBalance = useCountUp(balance);

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + Number(g.current_amount || 0), 0), [goals]);

  const budgetTotal = budgets.reduce((s, b) => s + Number(b.budget_amount || 0), 0);
  const budgetUsedPct = budgetTotal > 0 ? Math.min(100, Math.round((expense / budgetTotal) * 100)) : 0;
  const donutData = [
    { name: "Used", value: Math.min(expense, budgetTotal || 1) },
    { name: "Remaining", value: Math.max(0, (budgetTotal || 0) - expense) },
  ];
  const donutColor = budgetUsedPct >= 100 ? "#FF4444" : budgetUsedPct >= 80 ? "#FFB300" : "#00E676";

  // weekly sparkline (last 7 days)
  const weekData = useMemo(() => {
    const days: { day: string; spend: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = isoDate(d);
      const spend = allTxs.filter((t: any) => t.type === "expense" && t.date === key).reduce((s, t: any) => s + Number(t.amount), 0);
      days.push({ day: d.toLocaleDateString("en-ZA", { weekday: "short" }).slice(0, 2), spend });
    }
    return days;
  }, [allTxs]);

  // streak
  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = isoDate(d);
      const hasActivity = allTxs.some((t: any) => t.date === key);
      if (hasActivity) {
        s++;
      } else {
        // Don't break streak if they haven't logged anything today yet
        if (i === 0) continue;
        else break;
      }
    }
    return s;
  }, [allTxs]);

  // health score
  const savingsRate = income > 0 ? Math.max(0, (net / income) * 100) : 0;
  const healthScore = Math.min(100, Math.round((budgetUsedPct > 100 ? 0 : 100 - budgetUsedPct) * 0.5 + savingsRate * 0.5));
  const healthColor = healthScore >= 70 ? "#00E676" : healthScore >= 40 ? "#FFB300" : "#FF4444";

  const recentTxs = allTxs.slice(0, 5);

  const xp = gam?.total_xp ?? 0;
  const level = levelFor(xp);
  const nxt = nextLevel(xp);
  const pct = progressToNext(xp);

  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "there").split(" ")[0];

  if (pLoad) return <AppShell><Skeleton /></AppShell>;

  return (
    <AppShell>
      {/* Top bar */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-11 rounded-full bg-card border border-border grid place-items-center text-lg shrink-0">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-display text-lg truncate">Hey, {firstName} 👋</div>
            <div className="mt-1.5 h-1.5 w-40 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {nxt ? `${nxt.min - xp} XP to ${nxt.name}` : "Maxed out 💎"}
            </div>
          </div>
        </div>
        <div className="rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 shrink-0">
          {level.icon ? <img src={level.icon} alt={level.name} className="size-5 rounded-full object-cover" /> : <span>{level.badge}</span>}
          <span className="hidden sm:inline">{level.name}</span>
        </div>
      </div>

      {/* Payday */}
      <div className={`card-surface p-5 mb-4 ${isPaydayToday ? "border-primary animate-pulse-glow" : "border-primary/40"}`}>
        <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">
          {isPaydayToday ? "💸 Payday TODAY!" : "Payday"}
        </div>
        <div className="font-display text-3xl">
          {isPaydayToday ? "Time to plan the month!" : `In ${daysToPay} day${daysToPay === 1 ? "" : "s"}`}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {isPaydayToday ? "Update your budget below 💪" : daysToPay <= 3 ? "Hang tight. You've got this 💪" : "Stay sharp this week."}
        </div>
      </div>

      {/* Balance */}
      <div className="card-surface p-6 mb-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current Balance</div>
          <div className="font-display text-4xl sm:text-5xl mt-2 text-glow-green truncate">
            {money(animatedBalance)}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Income" value={money(income)} icon={<TrendingUp className="size-4 text-primary" />} />
        <StatCard label="Spent" value={money(expense)} icon={<TrendingDown className="size-4 text-destructive" />} />
        <StatCard label="Saved" value={money(totalSaved)} icon={<PiggyBank className="size-4 text-primary" />} />
        <StatCard label="Net" value={money(net)} icon={<Wallet className={`size-4 ${net >= 0 ? "text-primary" : "text-destructive"}`} />} valueColor={net >= 0 ? "text-primary" : "text-destructive"} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Donut */}
        <div className="card-surface p-5">
          <div className="text-sm font-semibold mb-1">Monthly spending</div>
          <div className="text-xs text-muted-foreground mb-2">{money(expense)} of {money(budgetTotal)}</div>
          <div className="h-48 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={75} startAngle={90} endAngle={-270} stroke="none">
                  <Cell fill={donutColor} />
                  <Cell fill="#3A3D4A" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="font-display text-3xl">{budgetUsedPct}%</div>
                <div className="text-[10px] text-muted-foreground uppercase">used</div>
              </div>
            </div>
          </div>
          {budgets.length === 0 && (
            <Link to="/budget" className="block text-center text-xs text-primary mt-2 hover:underline">Set up a budget →</Link>
          )}
        </div>

        {/* Weekly sparkline */}
        <div className="card-surface p-5">
          <div className="text-sm font-semibold">Weekly spend</div>
          <div className="text-xs text-muted-foreground mb-2">Last 7 days</div>
          <div className="overflow-x-auto scroll-hide -mx-5 px-5">
            <div className="min-w-[500px] h-48">
              <ResponsiveContainer>
                <LineChart data={weekData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fill: "#8A8D9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A", borderRadius: 8 }} labelStyle={{ color: "#F5F5F0" }} formatter={(v: number) => money(v)} />
                  <Line type="monotone" dataKey="spend" stroke="#00E676" strokeWidth={2.5} dot={{ fill: "#00E676", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="card-surface p-4 mb-4 flex items-center gap-3">
        <Flame className={`size-6 ${streak > 0 ? "text-warning" : "text-muted-foreground"}`} />
        <div className="flex-1">
          <div className="text-sm font-medium">
            {streak > 0 ? `${streak} day${streak === 1 ? "" : "s"} active streak` : "Start your streak today!"}
          </div>
          <div className="text-xs text-muted-foreground">{streak > 0 ? "Keep it going 🔥" : "Log a transaction to ignite it."}</div>
        </div>
      </div>

      {/* Recent + Health */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="card-surface p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Recent transactions</div>
            <Link to="/transactions" className="text-xs text-primary hover:underline">See all →</Link>
          </div>
          {recentTxs.length === 0 ? (
            <EmptyState text="No transactions yet — tap + to add your first!" />
          ) : (
            <ul className="space-y-2">
              {recentTxs.map((t: any) => {
                const cat = catInfo(t.category);
                return (
                  <li key={t.id} className="flex items-center gap-3 py-1">
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{t.note || cat.label}</div>
                      <div className="text-xs text-muted-foreground">{t.date}</div>
                    </div>
                    <div className={`text-sm font-semibold tabular-nums ${t.type === "income" ? "text-primary" : "text-foreground"}`}>
                      {t.type === "income" ? "+" : "−"}{money(Number(t.amount))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="text-sm font-semibold mb-1">Financial health</div>
          <div className="h-36 relative">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: healthScore, fill: healthColor }]} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "#3A3D4A" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="font-display text-2xl sm:text-3xl" style={{ color: healthColor }}>{healthScore}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            {healthScore >= 70 ? "Sharp! Keep it up." : healthScore >= 40 ? "Solid — bit more saving." : "Let's tighten up next week."}
          </div>
        </div>
      </div>

      {/* Savings snapshot */}
      <div className="card-surface p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Savings goals</div>
          <Link to="/savings" className="text-xs text-primary hover:underline">All goals →</Link>
        </div>
        {goals.length === 0 ? (
          <EmptyState text="No goals yet — what are you saving for?" cta={<Link to="/savings" className="inline-flex items-center gap-1 text-primary text-sm mt-2"><Plus className="size-4" /> Create one</Link>} />
        ) : (
          <ul className="space-y-3">
            {goals.slice(0, 3).map((g: any) => {
              const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
              return (
                <li key={g.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-1 gap-1 sm:gap-0">
                    <span className="flex items-center gap-2 truncate"><span>{g.emoji || "🎯"}</span>{g.name}</span>
                    <span className="text-muted-foreground tabular-nums text-xs">{money(g.current_amount)} / {money(g.target_amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon, valueColor }: { label: string; value: string; icon: React.ReactNode; valueColor?: string }) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">{icon}{label}</div>
      <div className={`font-display text-base sm:text-lg mt-1 tabular-nums truncate ${valueColor || ""}`}>{value}</div>
    </div>
  );
}

export function EmptyState({ text, cta }: { text: string; cta?: React.ReactNode }) {
  return (
    <div className="text-center py-6 text-muted-foreground text-sm">
      <div className="text-3xl mb-2">🌱</div>
      <div>{text}</div>
      {cta}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[0,1,2,3].map(i => <div key={i} className="card-surface p-6 h-32 animate-pulse" />)}
    </div>
  );
}
