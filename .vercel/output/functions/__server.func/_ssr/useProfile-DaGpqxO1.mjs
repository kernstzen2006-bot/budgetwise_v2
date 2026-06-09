import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-28R2oWI3.mjs";
import { u as useAuth } from "./router-DxPZX18F.mjs";
import { r as reactExports } from "../_libs/react.mjs";
function useProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`profile-${user.id}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  return query;
}
function useGamification() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    enabled: !!user,
    queryKey: ["gamification", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_gamification").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`gam-${user.id}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "user_gamification", filter: `user_id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["gamification", user.id] });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  return query;
}
export {
  useGamification as a,
  useProfile as u
};
