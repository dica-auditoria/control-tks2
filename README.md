# Control-tks2

Sistema de control interno con **Next.js** (App Router), **TypeScript**, **Ant Design** y **Supabase** (Auth + Postgres).

## Desarrollo

1. Copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (y `SUPABASE_SERVICE_ROLE_KEY` solo para uso en servidor).
2. Instala dependencias: `npm install`
3. Arranca el servidor: `npm.cmd run dev` (en PowerShell, si `npm` falla por políticas de ejecución).
4. Abre [http://localhost:3000](http://localhost:3000).

## Supabase

Las migraciones SQL están en `supabase/migrations/`. Aplícalas desde el SQL Editor del proyecto o con la CLI de Supabase.

## Más información

- [Documentación de Next.js](https://nextjs.org/docs)
