import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, A as ArrowLeft, a as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgrad"];
const INCOME_TYPES = ["Bursary/NSFAS", "Monthly allowance", "Part-time salary", "Multiple sources"];
const QUESTIONS = [{
  q: "When you get money, what do you do first?",
  opts: [{
    label: "Spend immediately",
    type: "Spender"
  }, {
    label: "Save a little first",
    type: "Saver"
  }, {
    label: "Budget it all out",
    type: "Planner"
  }, {
    label: "Avoid thinking about it",
    type: "Avoider"
  }]
}, {
  q: "Payday is tomorrow and you're almost broke. How do you feel?",
  opts: [{
    label: "Stressed",
    type: "Avoider"
  }, {
    label: "Relieved it's almost over",
    type: "Spender"
  }, {
    label: "I planned for this",
    type: "Planner"
  }, {
    label: "I didn't notice",
    type: "Saver"
  }]
}, {
  q: "A friend asks to borrow R200. You:",
  opts: [{
    label: "Lend it immediately",
    type: "Spender"
  }, {
    label: "Check your budget first",
    type: "Planner"
  }, {
    label: "Say you don't have it",
    type: "Saver"
  }, {
    label: "Lend but track it",
    type: "Planner"
  }]
}, {
  q: "Your savings goal is R1000. You're at R400. You see shoes for R500. You:",
  opts: [{
    label: "Buy the shoes",
    type: "Spender"
  }, {
    label: "Skip the shoes",
    type: "Saver"
  }, {
    label: "Buy and feel guilty",
    type: "Avoider"
  }, {
    label: "Never been in this situation",
    type: "Planner"
  }]
}, {
  q: "How often do you check your bank balance?",
  opts: [{
    label: "Multiple times a day",
    type: "Planner"
  }, {
    label: "Once a day",
    type: "Saver"
  }, {
    label: "When I need to buy something",
    type: "Spender"
  }, {
    label: "I avoid it",
    type: "Avoider"
  }]
}];
const PERSONALITY_TIPS = {
  Saver: {
    desc: "You instinctively hold back. Money feels safer in the bank.",
    tip: "Set bold goals — you've got the discipline to crush them."
  },
  Spender: {
    desc: "You live in the moment. Money is for enjoying.",
    tip: "Try the 24-hour rule on anything over R500. Future you will thank you."
  },
  Planner: {
    desc: "You love a spreadsheet. Every rand has a job.",
    tip: "Don't forget to budget fun money. Joy is non-negotiable."
  },
  Avoider: {
    desc: "Money stress is real. You'd rather not look.",
    tip: "Start small — just log one transaction a day. Awareness beats avoidance."
  }
};
function Onboarding() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const [fullName, setFullName] = reactExports.useState("");
  const [institution, setInstitution] = reactExports.useState("");
  const [year, setYear] = reactExports.useState(YEARS[0]);
  const [incomeType, setIncomeType] = reactExports.useState(INCOME_TYPES[0]);
  const [answers, setAnswers] = reactExports.useState([]);
  const [personality, setPersonality] = reactExports.useState(null);
  const [income, setIncome] = reactExports.useState("");
  const [payday, setPayday] = reactExports.useState(25);
  const [impulse, setImpulse] = reactExports.useState(500);
  function pickAnswer(i, type) {
    const next = [...answers];
    next[i] = type;
    setAnswers(next);
    if (i === QUESTIONS.length - 1) {
      const counts = {};
      next.forEach((t) => counts[t] = (counts[t] || 0) + 1);
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
      const {
        error
      } = await supabase.from("profiles").update({
        full_name: fullName,
        institution,
        student_year: year,
        income_type: incomeType,
        savings_personality: personality,
        monthly_income: Number(income) || 0,
        payday_date: payday,
        impulse_threshold: impulse,
        onboarding_complete: true
      }).eq("id", user.id);
      if (error) throw error;
      queryClient.setQueryData(["profile", user.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          onboarding_complete: true
        };
      });
      toast.success("All set! Let's go 🚀");
      navigate({
        to: "/dashboard"
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-8 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 max-w-md mx-auto", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 min-h-[8px] flex-1 rounded-full transition ${i <= step ? "bg-primary" : "bg-border"}` }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-4 md:px-8 py-6 max-w-lg mx-auto w-full", children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Tell us about you" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Quick basics so we can personalise things." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OnbField, { label: "What's your name?", value: fullName, onChange: setFullName, placeholder: "e.g. Thabo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OnbField, { label: "Which university/college?", value: institution, onChange: setInstitution, placeholder: "e.g. University of Cape Town" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OnbSelect, { label: "What year are you in?", value: year, onChange: setYear, options: YEARS }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OnbSelect, { label: "Main income type", value: incomeType, onChange: setIncomeType, options: INCOME_TYPES }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NextBar, { onNext: () => setStep(1), disabled: !fullName || !institution })
      ] }),
      step === 1 && !personality && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Savings Personality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "5 quick questions — no wrong answers." })
        ] }),
        QUESTIONS.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-surface p-4 ${answers[i] ? "border-primary/40" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            "Q",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-lg max-w-full mb-3", children: q.q }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: q.opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => pickAnswer(i, o.type), className: `w-full min-h-[52px] text-left text-sm px-3 py-2.5 rounded-md border transition ${answers[i] === o.type ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`, children: o.label }, o.label)) })
        ] }, i))
      ] }),
      step === 1 && personality && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-center pt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: personality === "Saver" ? "🏦" : personality === "Spender" ? "💸" : personality === "Planner" ? "📊" : "🙈" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "You're a" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl text-primary mt-1", children: personality })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: PERSONALITY_TIPS[personality].desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-4 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-primary font-bold mb-1", children: "Tailored tip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: PERSONALITY_TIPS[personality].tip })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NextBar, { onNext: () => setStep(2), onBack: () => {
          setAnswers([]);
          setPersonality(null);
        } })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Set up your budget" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Just the essentials." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-2", children: "Monthly income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-14 rounded-lg border border-border bg-card px-4 focus-within:border-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display text-muted-foreground mr-2", children: "R" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", inputMode: "decimal", value: income, onChange: (e) => setIncome(e.target.value), placeholder: "0", className: "flex-1 bg-transparent outline-none text-2xl font-display" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-2", children: "Payday is on the…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 31, value: payday, onChange: (e) => setPayday(Number(e.target.value)), className: "w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Default: 25th" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-2", children: "Impulse spending limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-12 rounded-lg border border-border bg-card px-4 focus-within:border-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mr-2", children: "R" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: impulse, onChange: (e) => setImpulse(Number(e.target.value)), className: "flex-1 bg-transparent outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "We'll trigger the 24-hour rule above this amount." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: finish, disabled: busy || !income, className: "w-full h-12 mb-8 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Finish & enter the app →" })
      ] })
    ] })
  ] });
}
function OnbField({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), placeholder, className: "w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary" })
  ] });
}
function OnbSelect({
  label,
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "w-full h-12 rounded-lg border border-border bg-card px-4 outline-none focus:border-primary", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o)) })
  ] });
}
function NextBar({
  onNext,
  onBack,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
    onBack && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onBack, className: "h-12 px-4 rounded-lg border border-border text-muted-foreground flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Back"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onNext, disabled, className: "flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2", children: [
      "Continue ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
    ] })
  ] });
}
export {
  Onboarding as component
};
