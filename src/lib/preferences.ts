import type { Preferences } from "../types/types";
import { supabase } from "./supabase";

export async function getPreferences(): Promise<Preferences | null> {
  const { data: preferences_web, error } = await supabase
    .from("preferences_web")
    .select(
      "company_id,dollar_quote,default_markup,iva_percentage,feeder_silos,airbase_silos,cone_base_45,cone_base_55, fiber_base_cost, has_fiber_base",
    )
    .single();

  if (error) throw new Error(error.message);

  return preferences_web;
}
