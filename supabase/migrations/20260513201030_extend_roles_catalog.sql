-- Roles adicionales del catálogo (idempotente si ya existen por nombre).
insert into public.roles (name, description) values
  ('coordinador', 'Coordinador'),
  ('direccion', 'Dirección'),
  ('freelance', 'Freelance / colaborador externo'),
  ('gerentes', 'Gerentes'),
  ('rh', 'Recursos humanos (RH)'),
  ('becarios', 'Becarios'),
  ('director_administrativo', 'Director administrativo'),
  ('logistica', 'Logística'),
  ('sistemas', 'Sistemas / TI'),
  ('staff', 'Staff (rol por defecto al dar de alta usuario)')
on conflict (name) do nothing;
