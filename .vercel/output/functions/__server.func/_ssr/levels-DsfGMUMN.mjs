const LEVELS = [
  { name: "Broke Student", min: 0, max: 499, badge: "🪙", color: "#8A8D9A", icon: "/levels/broke_student.jpg" },
  { name: "Budget Apprentice", min: 500, max: 1499, badge: "🥉", color: "#CD7F32", icon: "/levels/budget_apprentice.jpg" },
  { name: "Rand Ranger", min: 1500, max: 3499, badge: "🥈", color: "#C0C0C0", icon: "/levels/rand_ranger.jpg" },
  { name: "Savings Soldier", min: 3500, max: 6999, badge: "🛡️", color: "#00E676", icon: "/levels/savings_soldier.jpg" },
  { name: "Money Mogul", min: 7e3, max: 14999, badge: "🏆", color: "#FFB300", icon: "/levels/money_mogul.jpg" },
  { name: "Financial Legend", min: 15e3, max: Infinity, badge: "💎", color: "#00E676" }
];
function levelFor(xp) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
}
function nextLevel(xp) {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}
function progressToNext(xp) {
  const cur = levelFor(xp);
  const next = nextLevel(xp);
  if (!next) return 100;
  return Math.min(100, (xp - cur.min) / (next.min - cur.min) * 100);
}
export {
  LEVELS as L,
  levelFor as l,
  nextLevel as n,
  progressToNext as p
};
