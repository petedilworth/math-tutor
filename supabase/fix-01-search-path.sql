-- Fix for a project created before 2026-09-27: lets the functions find gen_salt and crypt,
-- which Supabase installs in the "extensions" schema. Paste into the SQL editor and run once.
alter function cp__auth(text, text) set search_path = public, extensions;
alter function cp__profile_json(cp_profiles) set search_path = public, extensions;
alter function cp_signin(text, text, text) set search_path = public, extensions;
alter function cp_pull(text, text) set search_path = public, extensions;
alter function cp_push(text, text, jsonb, jsonb) set search_path = public, extensions;
alter function cp_change_pin(text, text, text) set search_path = public, extensions;
alter function cp_household_create(text, text, text) set search_path = public, extensions;
alter function cp_household_join(text, text, text) set search_path = public, extensions;
alter function cp_household_leave(text, text) set search_path = public, extensions;
alter function cp_household(text, text) set search_path = public, extensions;
alter function cp_share(text) set search_path = public, extensions;
