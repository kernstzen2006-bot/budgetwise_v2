import { Link, useLocation } from "@tanstack/react-router";
import { Home, ArrowLeftRight, PieChart, PiggyBank, BarChart3, CreditCard, Repeat, Heart, Trophy, Settings, LogOut, Wallet, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

const PRIMARY = [
  { to: "/", label: "Home", icon: Home },
  { to: "/transactions", label: "Tx", icon: ArrowLeftRight },
  { to: "/budget", label: "Budget", icon: PieChart },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

const SECONDARY = [
  { to: "/debts", label: "Debts", icon: CreditCard },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const loc = useLocation();
  const [showMore, setShowMore] = useState(false);

  const MOBILE_MAIN = PRIMARY.slice(0, 3);
  const MOBILE_MORE = [...PRIMARY.slice(3), ...SECONDARY];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-60 border-r border-border bg-sidebar hidden md:flex flex-col p-4 z-30">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <img src="/logo.jpg" alt="BudgetWise SA" className="size-9 rounded-lg object-cover" />
          <div className="font-display text-lg leading-none">
            BudgetWise<span className="text-primary"> SA</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {[...PRIMARY, ...SECONDARY].map((item) => {
            const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.label === "Tx" ? "Transactions" : item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-card"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </aside>

      {/* Mobile content + bottom nav */}
      <main className="md:pl-60 pb-28 md:pb-8 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-6">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {MOBILE_MAIN.map((item) => {
            const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center justify-center gap-1 py-3 text-xs min-h-[44px] min-w-[44px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && <div className="absolute top-0 inset-x-0 h-[2px] bg-primary rounded-b-full" />}
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowMore(true)}
            className="relative flex flex-col items-center justify-center gap-1 py-3 text-xs min-h-[44px] min-w-[44px] text-muted-foreground"
          >
            <Menu className="size-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {showMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowMore(false)}>
          <div className="bg-sidebar border-t border-border rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <h2 className="font-display text-xl ml-2">More</h2>
              <button onClick={() => setShowMore(false)} className="size-11 flex items-center justify-center text-muted-foreground -mr-2"><X className="size-5" /></button>
            </div>
            <div className="p-5 grid grid-cols-4 gap-y-6 gap-x-2">
              {MOBILE_MORE.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowMore(false)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="size-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm">
                      <Icon className="size-6 text-muted-foreground" />
                    </div>
                    <span className="text-[11px] font-medium text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
