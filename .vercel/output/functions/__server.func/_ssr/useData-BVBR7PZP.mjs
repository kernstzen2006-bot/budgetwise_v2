import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { i as isoDate, s as startOfMonth } from "./format-CoFwZzXF.mjs";
function useTransactions(opts) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const sinceMonth = opts?.sinceMonth ?? false;
  const limit = opts?.limit;
  const query = useQuery({
    enabled: !!user,
    queryKey: ["transactions", user?.id, sinceMonth, limit],
    queryFn: async () => {
      let q = supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }).order("created_at", { ascending: false });
      if (sinceMonth) q = q.gte("date", isoDate(startOfMonth()));
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`tx-${user.id}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  return query;
}
function useBudgets(month) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    enabled: !!user,
    queryKey: ["budgets", user?.id, month],
    queryFn: async () => {
      const { data, error } = await supabase.from("budgets").select("*").eq("user_id", user.id).eq("month", month);
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`bg-${user.id}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "budgets", filter: `user_id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  return query;
}
function useSavingsGoals() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    enabled: !!user,
    queryKey: ["savings_goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("savings_goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`sg-${user.id}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "savings_goals", filter: `user_id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["savings_goals"] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  return query;
}
export {
  useSavingsGoals as a,
  useBudgets as b,
  useTransactions as u
};
