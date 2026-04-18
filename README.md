# Supabase Todo Demo

## Overview

This project is a small **Hello World + x** example for **Supabase as a Backend as a Service**.

The basic Hello World consists of:

- creating todos
- loading todos from the database
- displaying them in the frontend

The **+ x** extends the project with:

- email/password authentication
- user-specific access control via RLS
- realtime synchronization
- updating todos
- deleting todos

## Features

- email/password sign up and sign in
- normalized email input (`trim()` + lowercase)
- basic email validation
- sign out
- display of the current user email
- full CRUD for todos (create, read, update, delete)
- load only the signed-in user's todos
- realtime sync for todo changes (`INSERT`, `UPDATE`, `DELETE`)

## Tech Stack

- React + Vite
- Supabase
- PostgreSQL

## Architecture

- **Frontend:** React application
- **Backend platform:** Supabase
- **Database:** PostgreSQL table `public.todos`
- **Authentication:** Supabase Auth
- **Authorization:** Row Level Security (RLS)
- **Realtime:** Supabase Realtime subscriptions

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (URL + anon key)

## Database Setup

1. Open Supabase Dashboard -> SQL Editor.
2. Execute the SQL from [`todo_table.sql`](todo_table.sql).
3. Verify that RLS is enabled for `public.todos`.
4. Verify policies for `select`, `insert`, `update`, and `delete` exist.
5. Verify Realtime publication includes `public.todos`.
   [Database](https://github.com/Ronald-Nguyen/Supabase-Todo-Demo/blob/main/todo_table.sql)

## Data Model

Table: `public.todos`

- `id` (bigint, identity, primary key)
- `text` (text, not null)
- `user_id` (uuid, references `auth.users(id)`)
- `created_at` (timestamp with time zone, default `now()`)

## Environment Variables

Create a `.env` file inside the project folder and add:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Run the project

```bash
cd supabase-todo
npm install
npm run dev
```

## Troubleshooting

- App shows no data after login:
  Check that RLS is enabled and policies for `select` exist.
- Cannot edit todos:
  Ensure update policy exists and matches `auth.uid() = user_id`.
- Realtime updates do not appear:
  Ensure `public.todos` is in publication `supabase_realtime`.
- Supabase client fails to initialize:
  Verify `.env` values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
