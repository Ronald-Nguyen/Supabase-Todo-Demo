# Supabase Todo Demo

## Purpose
Minimal hello-world project for Supabase as a Backend as a Service.

## Features
- email/password sign up and sign in
- normalized email input (`trim + lowercase`) and basic email validation
- sign out
- show current user email in the top-left corner
- add todos
- delete todos
- load todos from the database for the signed-in user
- realtime sync for todo changes (insert, update, delete)

## Tech Stack
- React + Vite
- Supabase
- PostgreSQL

## Setup
1. Create a Supabase project.
2. Create a `todos` table in `public` with at least these columns:
   - `id` (primary key)
   - `text` (text)
   - `user_id` (uuid)
   - `created_at` (timestamp, default now)
3. Enable Email auth in Supabase Authentication.
4. Enable RLS on `public.todos`.
5. Add policies so authenticated users can only access their own rows:
   - `SELECT` where `auth.uid() = user_id`
   - `INSERT` with check `auth.uid() = user_id`
   - `DELETE` where `auth.uid() = user_id`
   - `UPDATE` where `auth.uid() = user_id` (optional, ready for future edits)
6. Enable Realtime for `public.todos` in Supabase.
7. In `supabase-todo/.env`, add:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
8. Run the app:
   - `cd supabase-todo`
   - `npm install`
   - `npm run dev`

## Notes
- The app listens for realtime `INSERT`, `UPDATE`, and `DELETE` events on `todos`.
- For delete sync, the app subscribes to `DELETE` without a `user_id` filter and reloads the signed-in user's list.
- This is still a learning/demo project; harden auth, validation, and policy design for production.
