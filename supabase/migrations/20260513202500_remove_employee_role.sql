-- Elimina el rol employee: los perfiles pasan a staff; nuevos usuarios usan staff por defecto.

insert into public.roles (name, description) values
  ('staff', 'Staff (rol por defecto al dar de alta usuario)')
on conflict (name) do update set description = excluded.description;

update public.profiles p
set role_id = (select id from public.roles r where r.name = 'staff' limit 1)
where p.role_id in (select id from public.roles r where r.name = 'employee');

delete from public.roles where name = 'employee';

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
