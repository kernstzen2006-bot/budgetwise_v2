export type Cat = { key: string; label: string; emoji: string };

export const EXPENSE_CATEGORIES: Cat[] = [
  { key: "food", label: "Food & Groceries", emoji: "🍔" },
  { key: "transport", label: "Transport", emoji: "🚌" },
  { key: "tuition", label: "Tuition & Fees", emoji: "🎓" },
  { key: "textbooks", label: "Textbooks", emoji: "📚" },
  { key: "rent", label: "Rent", emoji: "🏠" },
  { key: "utilities", label: "Utilities", emoji: "💡" },
  { key: "clothing", label: "Clothing", emoji: "👕" },
  { key: "health", label: "Health", emoji: "💊" },
  { key: "airtime", label: "Airtime & Data", emoji: "📱" },
  { key: "entertainment", label: "Entertainment", emoji: "🎮" },
  { key: "eatingout", label: "Eating Out", emoji: "☕" },
  { key: "gym", label: "Gym", emoji: "🏋️" },
  { key: "grooming", label: "Grooming", emoji: "💈" },
  { key: "gifts", label: "Gifts", emoji: "🎁" },
  { key: "other", label: "Other", emoji: "💸" },
];

export const INCOME_CATEGORIES: Cat[] = [
  { key: "allowance", label: "Allowance", emoji: "💰" },
  { key: "bursary", label: "Bursary/NSFAS", emoji: "🎓" },
  { key: "salary", label: "Salary", emoji: "💼" },
  { key: "sidehustle", label: "Side Hustle", emoji: "🤝" },
  { key: "gift", label: "Gift Money", emoji: "🎁" },
  { key: "other_income", label: "Other Income", emoji: "💳" },
];

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function catInfo(key?: string | null): Cat {
  if (key?.startsWith("custom:")) {
    return { key, label: key.substring(7), emoji: "🏷️" };
  }
  return ALL.find((c) => c.key === key) ?? { key: "other", label: "Other", emoji: "💸" };
}
