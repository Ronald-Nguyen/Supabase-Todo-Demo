create table public.todos (
  id bigint generated always as identity primary key,
  text text not null,
  created_at timestamp with time zone default now()
);

alter table public.todos
add column user_id uuid references auth.users(id);

create policy "users can read own todos"
on public.todos
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users can insert own todos"
on public.todos
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users can delete own todos"
on public.todos
for delete
to authenticated
using ((select auth.uid()) = user_id);

alter publication supabase_realtime add table public.todos;

create policy "users can update own todos"
on public.todos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
