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
- deleting todos

## Features

- email/password sign up and sign in
- normalized email input (`trim()` + lowercase)
- basic email validation
- sign out
- display of the current user email
- add todos
- delete todos
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

## Database Setup

[Database](https://github.com/Ronald-Nguyen/Supabase-Todo-Demo/blob/main/todo_table.sql)

## Environment Variables

Create a `.env` file inside the project folder and add:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
