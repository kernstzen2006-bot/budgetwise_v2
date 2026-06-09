import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useTransactions } from "@/hooks/useData";
import { money, isoDate, prettyMonth, startOfMonth, endOfMonth } from "@/lib/format";
import { catInfo } from "@/lib/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { data: txs = [] } = useTransactions({ limit: 500 });
  const [offset, setOffset] = useState(0);
  const viewMonth = useMemo(() => {
    const d = new Date(); d.setMonth(d.getMonth() + offset); return d;
  }, [offset]);

  const monthTxs = useMemo(() => {
    const from = isoDate(startOfMonth(viewMonth));
    const to = isoDate(endOfMonth(viewMonth));
    return txs.filter((t: any) => t.date >= from && t.date <= to);
  }, [txs, viewMonth]);

  const income = monthTxs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTxs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const net = income - expense;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  const byCat = useMemo(() => {
    const m: Record<string, number> = {};
    monthTxs.forEach((t: any) => { if (t.type === "expense") m[t.category] = (m[t.category] || 0) + Number(t.amount); });
    return Object.entries(m).map(([k, v]) => ({ name: catInfo(k).label, value: v }));
  }, [monthTxs]);

  // Last 6 months income vs expense
  const sixMonths = useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const f = isoDate(startOfMonth(d)); const t = isoDate(endOfMonth(d));
      const inc = txs.filter((tx: any) => tx.type === "income" && tx.date >= f && tx.date <= t).reduce((s, x) => s + Number(x.amount), 0);
      const exp = txs.filter((tx: any) => tx.type === "expense" && tx.date >= f && tx.date <= t).reduce((s, x) => s + Number(x.amount), 0);
      arr.push({ month: d.toLocaleDateString("en-ZA", { month: "short" }), Income: inc, Expenses: exp });
    }
    return arr;
  }, [txs]);

  // savings growth (cumulative net)
  const growth = useMemo(() => {
    let cum = 0;
    return sixMonths.map(m => { cum += m.Income - m.Expenses; return { month: m.month, total: cum }; });
  }, [sixMonths]);

  // heatmap
  const daysInMonth = endOfMonth(viewMonth).getDate();
  const heatmap = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
    const key = isoDate(d);
    const spend = monthTxs.filter((t: any) => t.type === "expense" && t.date === key).reduce((s, t) => s + Number(t.amount), 0);
    return { day: i + 1, spend };
  });
  const maxSpend = Math.max(1, ...heatmap.map(h => h.spend));
  const noSpendDays = heatmap.filter(h => h.spend === 0 && new Date(viewMonth.getFullYear(), viewMonth.getMonth(), h.day) <= new Date()).length;

  // insights
  const topCat = [...byCat].sort((a, b) => b.value - a.value)[0];
  const insights = [];
  if (topCat && income > 0) insights.push(`You spent ${money(topCat.value)} on ${topCat.name} — ${Math.round((topCat.value / income) * 100)}% of income`);
  if (savingsRate > 20) insights.push("🔥 Solid savings month — keep it up!");
  if (expense > income && income > 0) insights.push("⚠️ Expenses are above income this month. Time to tighten up.");

  // report card grades
  const grades = useMemo(() => byCat.map(c => {
    const pct = income > 0 ? (c.value / income) * 100 : 0;
    const grade = pct < 25 ? "A" : pct < 35 ? "B" : pct < 45 ? "C" : pct < 60 ? "D" : "F";
    return { name: c.name, value: c.value, grade };
  }), [byCat, income]);

  const COLORS = ["#00E676", "#00BFA5", "#FFB300", "#FF4444", "#8A8D9A", "#F5F5F0"];

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl md:text-3xl">Reports</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setOffset(o => o - 1)} className="size-11 rounded-lg border border-border bg-card grid place-items-center"><ChevronLeft className="size-4" /></button>
          <div className="text-sm font-medium min-w-[128px] text-center">{prettyMonth(viewMonth)}</div>
          <button onClick={() => setOffset(o => Math.min(0, o + 1))} className="size-11 rounded-lg border border-border bg-card grid place-items-center disabled:opacity-30" disabled={offset >= 0}><ChevronRight className="size-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Sum label="Income" value={money(income)} />
        <Sum label="Expenses" value={money(expense)} />
        <Sum label="Net" value={money(net)} color={net >= 0 ? "text-primary" : "text-destructive"} />
        <Sum label="Savings Rate" value={`${savingsRate}%`} color="text-primary" />
      </div>

      {insights.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {insights.map((i, k) => (
            <div key={k} className="card-surface p-4 text-sm">{i}</div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card-surface p-5">
          <div className="text-sm font-semibold mb-2">Spending by category</div>
          {byCat.length === 0 ? <div className="h-56 grid place-items-center text-muted-foreground text-sm">No expenses yet</div> : (
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byCat} dataKey="value" innerRadius={40} outerRadius={80} stroke="none">
                    {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A" }} formatter={(v: number) => money(v)} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="text-sm font-semibold mb-2">Income vs Expenses</div>
          <div className="overflow-x-auto scroll-hide -mx-5 px-5">
            <div className="min-w-[500px] h-56">
              <ResponsiveContainer>
                <BarChart data={sixMonths}>
                  <XAxis dataKey="month" tick={{ fill: "#8A8D9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8A8D9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A" }} formatter={(v: number) => money(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Income" fill="#00E676" radius={3} />
                  <Bar dataKey="Expenses" fill="#FF4444" radius={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-2">Savings growth</div>
        <div className="overflow-x-auto scroll-hide -mx-5 px-5">
          <div className="min-w-[500px] h-48">
            <ResponsiveContainer>
              <LineChart data={growth}>
                <XAxis dataKey="month" tick={{ fill: "#8A8D9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8A8D9A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1D27", border: "1px solid #3A3D4A" }} formatter={(v: number) => money(v)} />
                <Line type="monotone" dataKey="total" stroke="#00E676" strokeWidth={2.5} dot={{ fill: "#00E676" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface p-5 mb-4">
        <div className="text-sm font-semibold mb-3">Daily spend heatmap</div>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.map(h => {
            const intensity = h.spend / maxSpend;
            const bg = h.spend === 0 ? "#1A1D27" : `rgba(0, 230, 118, ${0.15 + intensity * 0.85})`;
            return (
              <div key={h.day} className="aspect-square min-w-[32px] rounded-md grid place-items-center text-[10px] text-muted-foreground border border-border" style={{ backgroundColor: bg }} title={`${money(h.spend)} on ${h.day}`}>
                {h.day}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-3">No-spend days this month: <span className="text-primary font-semibold">{noSpendDays}</span></div>
      </div>

      <div className="card-surface p-5 mb-4 bg-[#F5F5F0] text-[#0F1117]">
        <div className="font-mono text-xs uppercase mb-3 opacity-70">— Monthly Report Card —</div>
        <div className="font-display text-2xl mb-3">{prettyMonth(viewMonth)}</div>
        {grades.length === 0 ? (
          <div className="text-sm opacity-70">No spend tracked yet this month.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead><tr className="border-b border-black/20"><th className="text-left py-1.5">Category</th><th className="text-right py-1.5">Spent</th><th className="text-right py-1.5 w-8 shrink-0">Grade</th></tr></thead>
              <tbody>
                {grades.map((g, i) => <tr key={i} className="border-b border-black/10"><td className="py-1.5">{g.name}</td><td className="text-right tabular-nums">{money(g.value)}</td><td className="text-right font-bold">{g.grade}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Sum({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="card-surface p-4">
      <div className="text-xs uppercase text-muted-foreground font-semibold">{label}</div>
      <div className={`font-display text-lg mt-1 tabular-nums ${color || ""}`}>{value}</div>
    </div>
  );
}
