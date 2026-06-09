import { s as supabase } from "./client-28R2oWI3.mjs";
import { t as toast } from "../_libs/sonner.mjs";
async function awardXp(amount, action) {
  try {
    const { data, error } = await supabase.rpc("award_xp", {
      p_amount: amount,
      p_action: action
    });
    if (error) throw error;
    toast.success(`+${amount} XP ✨`, {
      description: action,
      className: "xp-toast"
    });
    return data;
  } catch (e) {
    console.error("award_xp failed", e);
  }
}
export {
  awardXp as a
};
