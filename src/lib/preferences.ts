import type { Preferences } from "../types/types";
import { supabase } from "./supabase";

export async function getPreferences(): Promise<Preferences | null> {
  let { data: preferences_web, error } = await supabase
    .from("preferences_web")
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return preferences_web;
}
