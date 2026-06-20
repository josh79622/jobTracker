-- user_preferences: one row per user, holds profile + app settings
create table if not exists public.user_preferences (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  default_location text,
  default_salary_min integer,
  default_salary_max integer,
  custom_status_labels jsonb,
  theme text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: each user can only touch their own row
alter table public.user_preferences enable row level security;

create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own preferences"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- Reuse the existing updated_at trigger function (already in baseline)
create or replace trigger set_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at();
