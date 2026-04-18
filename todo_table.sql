create table if not exists public.todos (
  id bigint generated always as identity primary key,
  text text not null,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) not null
);

alter table public.todos enable row level security;

drop policy if exists "users can read own todos" on public.todos;
create policy "users can read own todos"
on public.todos
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own todos" on public.todos;
create policy "users can insert own todos"
on public.todos
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can delete own todos" on public.todos;
create policy "users can delete own todos"
on public.todos
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can update own todos" on public.todos;
create policy "users can update own todos"
on public.todos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.todos;
