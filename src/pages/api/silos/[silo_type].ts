import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ params }) => {
  const { silo_type } = params;
  const { data, error } = await supabase
    .from("silos")
    .select("*")
    .eq("silo_type", silo_type)
    .order("name", { ascending: true });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};
