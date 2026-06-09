import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgrad"];
const INCOME_TYPES = ["Bursary/NSFAS", "Monthly allowance", "Part-time salary", "Multiple sources"];

const QUESTIONS: { q: string; opts: { label: string; type: "Spender" | "Saver" | "Planner" | "Avoider" }[] }[] = [
  { q: "When you get money, what do you do first?", opts: [
    { label: "Spend immediately", type: "Spender" },
    { label: "Save a little first", type: "Saver" },
    { label: "Budget it all out", type: "Planner" },
    { label: "Avoid thinking about it", type: "Avoider" },
  ]},
  { q: "Payday is tomorrow and you're almost broke. How do you feel?", opts: [
    { label: "Stressed", type: "Avoider" },
    { label: "Relieved it's almost over", type: "Spender" },
    { label: "I planned for this", type: "Planner" },
    { label: "I didn't notice", type: "Saver" },
  ]},
  { q: "A friend asks to borrow R200. You:", opts: [
    { label: "Lend it immediately", type: "Spender" },
    { label: "Check your budget first", type: "Planner" },
    { label: "Say you don't have it", type: "Saver" },
    { label: "Lend but track it", type: "Planner" },
  ]},
  { q: "Your savings goal is R1000. You're at R400. You see shoes for R500. You:", opts: [
    { label: "Buy the shoes", type: "Spender" },
    { label: "Skip the shoes", type: "Saver" },
    { label: "Buy and feel guilty", type: "Avoider" },
    { label: "Never been in this situation", type: "Planner" },
  ]},
  { q: "How often do you check your bank balance?", opts: [
    { label: "Multiple times a day", type: "Planner" },
    { label: "Once a day", type: "Saver" },
    { label: "When I need to buy something", type: "Spender" },
    { label: "I avoid it", type: "Avoider" },
  ]},
];

const PERSONALITY_TIPS: Record<string, { desc: string; tip: string }> = {
  Saver: { desc: "You instinctively hold back. Money feels safer in the bank.", tip: "Set bold goals — you've got the discipline to crush them." },
  Spender: { desc: "You live in the moment. Money is for enjoying.", tip: "Try the 24-hour rule on anything over R500. Future you will thank you." },
  Planner: { desc: "You love a spreadsheet. Every rand has a job.", tip: "Don't forget to budget fun money. Joy is non-negotiable." },
  Avoider: { desc: "Money stress is real. You'd rather not look.", tip: "Start small — just log one transaction a day. Awareness beats avoidance." },
};

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  // step 1
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState(YEARS[0]);
  const [incomeType, setIncomeType] = useState(INCOME_TYPES[0]);
  // step 2
  const [answers, setAnswers] = useState<string[]>([]);
  const [personality, setPersonality] = useState<string | null>(null);
  // step 3
  const [income, setIncome] = useState("");
  const [payday, setPayday] = useState(25);
  const [impulse, setImpulse] = useState(500);

  function pickAnswer(i: number, type: string) {
    const next = [...answers];
    next[i] = type;
    setAnswers(next);
    if (i === QUESTIONS.length - 1) {
      const counts: Record<string, number> = {};
      next.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setPersonality(top);
    }
  }

  async function finish() {
    if (!user) {
      toast.error("You must be logged in to finish setup. Check your email for a confirmation link.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        institution,
        student_year: year,
        income_type: incomeType,
        savings_personality: personality,
        monthly_income: Number(income) || 0,
        payday_date: payday,
        impulse_threshold: impulse,
        onboarding_complete: true,
      }).eq("id", user.id);
      if (error) throw error;
      
      queryClient.setQueryData(["profile", user.id], (old: any) => {
        if (!old) return old;
        return { ...old, onboarding_complete: true };
      });

      toast.success("All set! Let's go 🚀");
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2 max-w-md mx-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-2 min-h-[8px] flex-1 rounded-full transition ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 py-6 max-w-lg mx-auto w-full">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl">Tell us about you</h2>
              <p className="text-muted-foreground text-sm mt-1">Quick basics so we can personalise things.</p>
            </div>
            <OnbField label="What's your name?" value={fullName} onChange={setFullName} placeholder="e.g. Thabo" />
            <OnbField label="Which university/college?" value={institution} onChange={setInstitution} placeholder="e.g. University of Cape Town" />
            <OnbSelect label="What year are you in?" value={year} onChange={setYear} options={YEARS} />
            <OnbSelect label="Main income type" value={incomeType} onChange={setIncomeType} options={INCOME_TYPES} />
            <NextBar onNext={() => setStep(1)} disabled={!fullName || !institution} />
          </div>
        )}

        {step === 1 && !personality && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl">Savings Personality</h2>
              <p className="text-muted-foreground text-sm mt-1">5 quick questions — no wrong answers.</p>
            </div>
            {QUESTIONS.map((q, i) => (
              <div key={i} className={`card-surface p-4 ${answers[i] ? "border-primary/40" : ""}`}>
                <div className="text-xs text-muted-foreground mb-2">Q{i + 1}</div>
                <div className="font-medium text-lg max-w-full mb-3">{q.q}</div>
                <div className="grid grid-cols-1 gap-2">
                  {q.opts.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => pickAnswer(i, o.type)}
                      className={`w-full min-h-[52px] text-left text-sm px-3 py-2.5 rounded-md border transition ${
                        answers[i] === o.type ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && personality && (
          <div className="space-y-6 text-center pt-8">
            <div className="text-6xl">{personality === "Saver" ? "🏦" : personality === "Spender" ? "💸" : personality === "Planner" ? "📊" : "🙈"}</div>
            <div>
              <p className="text-muted-foreground">You're a</p>
              <h2 className="font-display text-4xl text-primary mt-1">{personality}</h2>
            </div>
            <p className="text-muted-foreground">{PERSONALITY_TIPS[personality].desc}</p>
            <div className="card-surface p-4 text-left">
              <div className="text-xs uppercase text-primary font-bold mb-1">Tailored tip</div>
              <div className="text-sm">{PERSONALITY_TIPS[personality].tip}</div>
            </div>
            <NextBar onNext={() => setStep(2)} onBack={() => { setAnswers([]); setPersonality(null); }} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl">Set up your budget</h2>
              <p className="text-muted-foreground text-sm mt-1">Just the essentials.</p>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Monthly income</div>
              <div className="flex items-center h-14 rounded-lg border border-border bg-card px-4 focus-within:border-primary">
                <span className="text-2xl font-display text-muted-foreground mr-2">R</span>
                <input type="number" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0" className="flex-1 bg-transparent outline-none text-2xl font-display" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Payday is on the…</div>
              <input type="number" min={1} max={31} value={payday} onChange={(e) => setPayday(Number(e.target.value))} className="w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary" />
              <div className="text-xs text-muted-foreground mt-1">Default: 25th</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Impulse spending limit</div>
              <div className="flex items-center h-12 rounded-lg border border-border bg-card px-4 focus-within:border-primary">
                <span className="text-muted-foreground mr-2">R</span>
                <input type="number" value={impulse} onChange={(e) => setImpulse(Number(e.target.value))} className="flex-1 bg-transparent outline-none" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">We'll trigger the 24-hour rule above this amount.</div>
            </div>
            <button onClick={finish} disabled={busy || !income} className="w-full h-12 mb-8 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Finish & enter the app →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OnbField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary" />
    </div>
  );
}
function OnbSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[]; }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function NextBar({ onNext, onBack, disabled }: { onNext: () => void; onBack?: () => void; disabled?: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && <button onClick={onBack} className="h-12 px-4 rounded-lg border border-border text-muted-foreground flex items-center gap-1"><ArrowLeft className="size-4" /> Back</button>}
      <button onClick={onNext} disabled={disabled} className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
        Continue <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
