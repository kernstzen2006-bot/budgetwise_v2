import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Wallet, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (password !== confirm) throw new Error("Passwords don't match");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account!");
          setMode("login");
          return;
        }
        toast.success("Account created! Welcome 🎉");
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function magicLink() {
    if (!email) return toast.error("Enter your email first");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast.success("Magic link sent! Check your inbox 📬");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) throw res.error;
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-background flex flex-col items-center justify-center px-4 py-12 pt-12 md:pt-12">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-10 pt-12">
          <img src="/logo.jpg" alt="BudgetWise SA" className="size-20 rounded-2xl object-cover glow-green mb-4 shadow-xl" />
          <h1 className="font-display text-3xl">BudgetWise <span className="text-primary">SA</span></h1>
          <p className="text-muted-foreground text-sm mt-2">Track smart. Save harder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={<UserIcon className="size-4" />} placeholder="Full name" value={name} onChange={setName} />
          )}
          <Field icon={<Mail className="size-4" />} placeholder="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={<Lock className="size-4" />} placeholder="Password" type="password" value={password} onChange={setPassword} />
          {mode === "signup" && (
            <Field icon={<Lock className="size-4" />} placeholder="Confirm password" type="password" value={confirm} onChange={setConfirm} />
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-2">
          <button onClick={google} disabled={busy} className="w-full h-11 rounded-lg border border-border bg-card text-foreground font-medium hover:border-primary/50 transition flex items-center justify-center gap-2">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={magicLink} disabled={busy} className="w-full h-11 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground text-sm">
            ✨ Send magic link
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => setMode(m => m === "login" ? "signup" : "login")} className="text-sm text-muted-foreground hover:text-foreground transition min-h-[44px] px-4">
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, type = "text", value, onChange }: { icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void; }) {
  return (
    <label className="flex items-center gap-3 h-12 rounded-lg border border-border bg-card px-4 focus-within:border-primary transition">
      <span className="text-muted-foreground">{icon}</span>
      <input
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
        placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} required
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.5 6.7 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z"/>
    </svg>
  );
}
