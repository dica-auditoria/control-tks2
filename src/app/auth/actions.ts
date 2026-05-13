"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicConfig } from "@/lib/supabase/env";

async function createSupabaseForRequestCookies() {
  const { url, anonKey } = getSupabasePublicConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}

export type SignInResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  try {
    const supabase = await createSupabaseForRequestCookies();
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const code = e instanceof Error ? e.message : "UNKNOWN";
    if (code === "SUPABASE_ENV_MISSING") {
      return {
        ok: false,
        error:
          "Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        code,
      };
    }
    if (code === "SUPABASE_URL_INVALID") {
      return {
        ok: false,
        error: "NEXT_PUBLIC_SUPABASE_URL no es una URL válida (usa https://...).",
        code,
      };
    }
    return { ok: false, error: "No se pudo conectar con Supabase.", code };
  }
}

export type SignOutResult = { ok: true } | { ok: false; error: string };

export async function signOut(): Promise<SignOutResult> {
  try {
    const supabase = await createSupabaseForRequestCookies();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo cerrar sesión." };
  }
}
