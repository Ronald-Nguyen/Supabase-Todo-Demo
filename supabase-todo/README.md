# Supabase Todo App (Frontend)

React + Vite frontend for a Supabase-backed todo demo.

## Current Features
- email/password sign up and sign in
- normalized and validated email input on auth actions
- sign out
- current user email shown at top-left
- create todos
- delete todos
- automatic todo loading for the signed-in user
- realtime sync on insert/update/delete events

## Environment Variables
Create `supabase-todo/.env` with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run Locally
```bash
npm install
npm run dev
```

## Supabase Requirements
- Auth enabled (email/password)
- `public.todos` table with `id`, `text`, `user_id`, `created_at`
- RLS enabled with user-scoped policies for `SELECT`, `INSERT`, `DELETE` (and optionally `UPDATE`)
- Realtime enabled for `public.todos`
