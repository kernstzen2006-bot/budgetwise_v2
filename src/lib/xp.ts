import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function awardXp(amount: number, action: string) {
  try {
    const { data, error } = await supabase.rpc("award_xp", {
      p_amount: amount,
      p_action: action,
    });
    if (error) throw error;
    toast.success(`+${amount} XP ✨`, {
      description: action,
      className: "xp-toast",
    });
    return data as number;
  } catch (e) {
    console.error("award_xp failed", e);
  }
}
