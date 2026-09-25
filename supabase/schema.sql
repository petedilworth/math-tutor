-- Chalk and Paper – shared record
-- Paste this whole file into the Supabase SQL editor and run it once.
--
-- Design: the browser never touches tables directly. It calls the cp_* functions below with the
-- project's anon key. Each function checks the name and PIN before reading or writing anything, so
-- one person cannot alter another's record from a browser. PINs are stored as bcrypt hashes.
-- This is friends-and-family security: it stops casual snooping, not a determined person who knows a PIN.

create extension if not exists pgcrypto;

create table if not exists cp_settings (
  key text primary key,
  value text not null
);
-- The invite code needed to create a profile. Change it here any time.
insert into cp_settings (key, value) values ('invite_code', 'CHANGE-ME')
  on conflict (key) do nothing;

create table if not exists cp_households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists cp_profiles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  pin_hash text not null,
  share_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  share_on boolean not null default false,
  household_id uuid references cp_households(id),
  email text,
  email_opt_in boolean not null default false,
  tracks text[] not null default '{mcv4u}',
  lesson_size int not null default 5,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists cp_progress (
  profile_id uuid primary key references cp_profiles(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Nobody reaches the tables from the browser.
revoke all on cp_settings, cp_households, cp_profiles, cp_progress from anon, authenticated;
alter table cp_settings enable row level security;
alter table cp_households enable row level security;
alter table cp_profiles enable row level security;
alter table cp_progress enable row level security;

-- ---------- helpers ----------
create or replace function cp__norm(p_name text) returns text language sql immutable as $$
  select lower(trim(p_name));
$$;

create or replace function cp__auth(p_name text, p_pin text) returns cp_profiles
language plpgsql security definer set search_path = public as $$
declare pr cp_profiles;
begin
  select * into pr from cp_profiles where name = cp__norm(p_name);
  if pr.id is null then raise exception 'NO_PROFILE'; end if;
  if pr.pin_hash <> crypt(p_pin, pr.pin_hash) then raise exception 'BAD_PIN'; end if;
  update cp_profiles set last_seen = now() where id = pr.id;
  return pr;
end $$;

create or replace function cp__profile_json(pr cp_profiles) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'name', pr.name, 'shareToken', pr.share_token, 'shareOn', pr.share_on,
    'household', (select json_build_object('name', h.name, 'code', h.code) from cp_households h where h.id = pr.household_id),
    'email', pr.email, 'emailOptIn', pr.email_opt_in, 'tracks', pr.tracks, 'lessonSize', pr.lesson_size);
$$;

-- ---------- sign in, or create with the invite code ----------
create or replace function cp_signin(p_name text, p_pin text, p_invite text default null)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles; st jsonb;
begin
  if length(trim(p_name)) < 2 or length(p_pin) < 4 then raise exception 'BAD_INPUT'; end if;
  select * into pr from cp_profiles where name = cp__norm(p_name);
  if pr.id is null then
    if p_invite is null or p_invite <> (select value from cp_settings where key = 'invite_code') then
      raise exception 'BAD_INVITE';
    end if;
    insert into cp_profiles (name, pin_hash) values (cp__norm(p_name), crypt(p_pin, gen_salt('bf')))
      returning * into pr;
    insert into cp_progress (profile_id) values (pr.id);
  else
    if pr.pin_hash <> crypt(p_pin, pr.pin_hash) then raise exception 'BAD_PIN'; end if;
    update cp_profiles set last_seen = now() where id = pr.id;
  end if;
  select state into st from cp_progress where profile_id = pr.id;
  return json_build_object('profile', cp__profile_json(pr), 'state', coalesce(st, '{}'::jsonb));
end $$;

-- ---------- pull the record ----------
create or replace function cp_pull(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles; st jsonb; ts timestamptz;
begin
  pr := cp__auth(p_name, p_pin);
  select state, updated_at into st, ts from cp_progress where profile_id = pr.id;
  return json_build_object('profile', cp__profile_json(pr), 'state', coalesce(st, '{}'::jsonb), 'updatedAt', ts);
end $$;

-- ---------- push the record and settings ----------
create or replace function cp_push(p_name text, p_pin text, p_state jsonb, p_settings jsonb default '{}'::jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles;
begin
  pr := cp__auth(p_name, p_pin);
  if pg_column_size(p_state) > 2000000 then raise exception 'TOO_BIG'; end if;
  insert into cp_progress (profile_id, state, updated_at) values (pr.id, p_state, now())
    on conflict (profile_id) do update set state = excluded.state, updated_at = now();
  update cp_profiles set
    email = coalesce(p_settings->>'email', email),
    email_opt_in = coalesce((p_settings->>'emailOptIn')::boolean, email_opt_in),
    lesson_size = coalesce((p_settings->>'lessonSize')::int, lesson_size),
    share_on = coalesce((p_settings->>'shareOn')::boolean, share_on),
    tracks = coalesce((select array_agg(x) from jsonb_array_elements_text(p_settings->'tracks') x), tracks)
  where id = pr.id;
  select * into pr from cp_profiles where id = pr.id;
  return json_build_object('ok', true, 'profile', cp__profile_json(pr), 'updatedAt', now());
end $$;

-- ---------- change PIN ----------
create or replace function cp_change_pin(p_name text, p_pin text, p_new_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles;
begin
  pr := cp__auth(p_name, p_pin);
  if length(p_new_pin) < 4 then raise exception 'BAD_INPUT'; end if;
  update cp_profiles set pin_hash = crypt(p_new_pin, gen_salt('bf')) where id = pr.id;
  return json_build_object('ok', true);
end $$;

-- ---------- households ----------
create or replace function cp_household_create(p_name text, p_pin text, p_hname text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles; h cp_households; c text;
begin
  pr := cp__auth(p_name, p_pin);
  c := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 3) || '-' || substr(encode(gen_random_bytes(6), 'hex'), 1, 3));
  insert into cp_households (name, code) values (trim(p_hname), c) returning * into h;
  update cp_profiles set household_id = h.id where id = pr.id;
  return json_build_object('name', h.name, 'code', h.code);
end $$;

create or replace function cp_household_join(p_name text, p_pin text, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles; h cp_households;
begin
  pr := cp__auth(p_name, p_pin);
  select * into h from cp_households where code = upper(trim(p_code));
  if h.id is null then raise exception 'NO_HOUSEHOLD'; end if;
  update cp_profiles set household_id = h.id where id = pr.id;
  return json_build_object('name', h.name, 'code', h.code);
end $$;

create or replace function cp_household_leave(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles;
begin
  pr := cp__auth(p_name, p_pin);
  update cp_profiles set household_id = null where id = pr.id;
  return json_build_object('ok', true);
end $$;

-- Members' summaries. The browser computes the table from the trimmed state (steps, days, points, freezes),
-- never from answers, so household members do not see each other's individual answers.
create or replace function cp_household(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles;
begin
  pr := cp__auth(p_name, p_pin);
  if pr.household_id is null then return json_build_object('household', null, 'members', '[]'::json); end if;
  return json_build_object(
    'household', (select json_build_object('name', h.name, 'code', h.code) from cp_households h where h.id = pr.household_id),
    'members', (select coalesce(json_agg(json_build_object(
        'name', p.name, 'me', p.id = pr.id,
        'state', jsonb_build_object('steps', g.state->'steps', 'days', g.state->'days', 'points', g.state->'points',
                                    'freezes', g.state->'freezes', 'frozen', g.state->'frozen', 'profile', jsonb_build_object('tracks', g.state->'profile'->'tracks'))
      ) order by p.name), '[]'::json)
      from cp_profiles p join cp_progress g on g.profile_id = p.id where p.household_id = pr.household_id));
end $$;

-- ---------- read-only share link ----------
-- Returns the full record (answers included, since the tutor view wants mistakes) if sharing is on.
create or replace function cp_share(p_token text)
returns json language plpgsql security definer set search_path = public as $$
declare pr cp_profiles; st jsonb;
begin
  select * into pr from cp_profiles where share_token = p_token and share_on;
  if pr.id is null then raise exception 'NO_SHARE'; end if;
  select state into st from cp_progress where profile_id = pr.id;
  return json_build_object('name', pr.name, 'state', coalesce(st, '{}'::jsonb) - 'profile');
end $$;

-- Only these are callable from the browser.
revoke all on function cp__auth(text, text) from public, anon, authenticated;
revoke all on function cp__profile_json(cp_profiles) from public, anon, authenticated;
grant execute on function cp_signin(text, text, text) to anon;
grant execute on function cp_pull(text, text) to anon;
grant execute on function cp_push(text, text, jsonb, jsonb) to anon;
grant execute on function cp_change_pin(text, text, text) to anon;
grant execute on function cp_household_create(text, text, text) to anon;
grant execute on function cp_household_join(text, text, text) to anon;
grant execute on function cp_household_leave(text, text) to anon;
grant execute on function cp_household(text, text) to anon;
grant execute on function cp_share(text) to anon;
