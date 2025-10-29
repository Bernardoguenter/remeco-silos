import type { Silo } from "../types/types";
import { supabase } from "./supabase";

const cache = new Map<string, Silo[]>();

export async function getSilosByType(type: string): Promise<Silo[]> {
  if (cache.has(type)) return cache.get(type)!;

  const { data, error } = await supabase
    .from("silos")
    .select("*")
    .eq("silo_type", type);

  if (error) throw new Error(error.message);

  const silos = (data ?? []).sort((a, b) => {
    const numA = parseInt(a.name);
    const numB = parseInt(b.name);

    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

    return a.name.localeCompare(b.name);
  });

  cache.set(type, silos);
  return silos;
}

export async function getSiloByName(name: string): Promise<Silo | null> {
  const { data, error } = await supabase
    .from("silos")
    .select("*")
    .eq("name", name)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
