-- Lets a signed-in user delete their own account.
-- SECURITY DEFINER → runs as the function owner (postgres), which can remove the
-- auth.users row. Cascading FKs then wipe all of that user's data automatically.
create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- Lock it down: only authenticated users may call it, and only ever deletes
-- their OWN row because the body is bound to auth.uid().
revoke all on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;
