/** Lectura segura de URL y anon key en cliente (NEXT_PUBLIC_*). */
export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey || url === "undefined" || anonKey === "undefined") {
    throw new Error("SUPABASE_ENV_MISSING");
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("SUPABASE_URL_INVALID");
  }

  return { url, anonKey };
}
