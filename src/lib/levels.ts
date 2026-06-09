export type Level = {
  name: string;
  min: number;
  max: number;
  badge: string;
  color: string;
  icon?: string;
};

export const LEVELS: Level[] = [
  { name: "Broke Student",     min: 0,     max: 499,    badge: "🪙", color: "#8A8D9A", icon: "/levels/broke_student.jpg" },
  { name: "Budget Apprentice", min: 500,   max: 1499,   badge: "🥉", color: "#CD7F32", icon: "/levels/budget_apprentice.jpg" },
  { name: "Rand Ranger",       min: 1500,  max: 3499,   badge: "🥈", color: "#C0C0C0", icon: "/levels/rand_ranger.jpg" },
  { name: "Savings Soldier",   min: 3500,  max: 6999,   badge: "🛡️", color: "#00E676", icon: "/levels/savings_soldier.jpg" },
  { name: "Money Mogul",       min: 7000,  max: 14999,  badge: "🏆", color: "#FFB300", icon: "/levels/money_mogul.jpg" },
  { name: "Financial Legend",  min: 15000, max: Infinity, badge: "💎", color: "#00E676" },
];

export function levelFor(xp: number): Level {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
}

export function nextLevel(xp: number): Level | null {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function progressToNext(xp: number): number {
  const cur = levelFor(xp);
  const next = nextLevel(xp);
  if (!next) return 100;
  return Math.min(100, ((xp - cur.min) / (next.min - cur.min)) * 100);
}
