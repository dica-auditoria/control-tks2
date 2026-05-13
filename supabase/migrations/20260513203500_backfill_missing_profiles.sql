-- Perfiles faltantes: usuarios en auth.users sin fila en public.profiles.
-- Útil si los usuarios se crearon antes del trigger o sin aplicar migraciones completas.

insert into public.roles (name, description) values
  ('staff', 'Staff (rol por defecto al dar de alta usuario)')
on conflict (name) do nothing;

insert into public.profiles (id, email, full_name, role_id)
select
  u.id,
  u.email,
  nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', '')), ''),
  (select r.id from public.roles r where r.name = 'staff' limit 1)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- Garantiza el trigger para que los próximos altas en Auth generen perfil.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
