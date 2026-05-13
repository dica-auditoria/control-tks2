-- Tablas de acceso: roles + profiles (1:1 con auth.users).
-- Tras aplicar, promueve al menos un admin en SQL Editor (rol postgres / service_role):
--   update public.profiles
--   set role_id = (select id from public.roles where name = 'admin' limit 1)
--   where lower(email) = lower('tu-correo@dominio.com');
--
-- Aplicar: Supabase Dashboard → SQL → pegar y ejecutar, o bien `npx supabase db push` (remoto vinculado) / migraciones locales.
-- Catálogo de roles (autorización en BD; no usar user_metadata del JWT para permisos).
create table public.roles (
  id serial primary key,
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

comment on table public.roles is 'Roles de aplicación; enlazar perfiles vía role_id.';

insert into public.roles (name, description) values
  ('admin', 'Acceso total y gestión de roles'),
  ('director_administrativo', 'Director administrativo'),
  ('direccion', 'Dirección'),
  ('gerentes', 'Gerentes'),
  ('coordinador', 'Coordinador'),
  ('rh', 'Recursos humanos (RH)'),
  ('logistica', 'Logística'),
  ('sistemas', 'Sistemas / TI'),
  ('staff', 'Staff (rol por defecto al dar de alta usuario)'),
  ('back_office', 'Operaciones administrativas'),
  ('auditor', 'Lectura y auditoría'),
  ('freelance', 'Freelance / colaborador externo'),
  ('becarios', 'Becarios');

-- Perfil vinculado a auth.users (una fila por usuario de Auth).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role_id integer not null references public.roles (id),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_id_idx on public.profiles (role_id);
create index profiles_email_lower_idx on public.profiles (lower(email));

create or replace function public.profiles_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.profiles_touch_updated_at();

-- Evita recursión en políticas RLS al comprobar rol admin.
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
set row_security = off
stable
as $$
begin
  return exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = auth.uid()
      and r.name = 'admin'
  );
end;
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to service_role;

-- Crea fila en public.profiles cuando se crea un usuario en Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  default_role_id integer;
begin
  select r.id into default_role_id
  from public.roles r
  where r.name = 'staff'
  limit 1;

  insert into public.profiles (id, email, full_name, role_id)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    default_role_id
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to service_role;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Solo administradores pueden cambiar role_id.
create or replace function public.profiles_block_role_change_for_non_admin()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'insert' then
    return new;
  end if;

  if tg_op = 'update' and new.role_id is distinct from old.role_id then
    if auth.uid() is null then
      return new;
    end if;
    if not public.is_admin() then
      raise exception 'Solo un administrador puede cambiar el rol';
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_enforce_role_change
  before insert or update on public.profiles
  for each row execute function public.profiles_block_role_change_for_non_admin();

-- Usuarios ya existentes en Auth antes de esta migración.
insert into public.profiles (id, email, full_name, role_id)
select
  u.id,
  u.email,
  nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', '')), ''),
  (select r.id from public.roles r where r.name = 'staff' limit 1)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- RLS
alter table public.roles enable row level security;
alter table public.profiles enable row level security;

grant select on table public.roles to authenticated;

create policy "roles_select_authenticated"
  on public.roles
  for select
  to authenticated
  using (true);

grant select, update on table public.profiles to authenticated;

create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

grant all on table public.roles to service_role;
grant all on table public.profiles to service_role;

revoke all on table public.profiles from anon;
revoke all on table public.roles from anon;
