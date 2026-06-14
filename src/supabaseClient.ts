import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aotllgxeejedpphmozev.supabase.co";
const supabaseAnonKey = "sb_publishable_RVlEk6-tPotpTiHTlTvG5A_rNAJRXMD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
