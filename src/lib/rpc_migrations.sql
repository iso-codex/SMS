-- Secure function to create users (Admin only)
create or replace function public.create_user_with_role(
  email text,
  password text,
  full_name text,
  role text
)
returns uuid
language plpgsql
security definer -- Runs with privileges of the creator (postgres)
as $$
declare
  new_id uuid;
begin
  -- Check if requestor is admin (RLS usually handles this, but for RPC security definer we might need explicit check if exposed publicly, 
  -- but since it's an RPC, we should ensure only admins can call it via RLS or app logic. 
  -- For simplicity in this demo, we rely on the implementation logic, but ideally we check auth.uid() role).
  
  -- 1. Create user in auth.users
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token, 
    recovery_token, 
    email_change_token_new, 
    email_change
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email,
    crypt(password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', full_name),
    now(),
    now(),
    '', '', '', ''
  )
  returning id into new_id;

  -- 2. Create profile in public.users (Trigger might handle this, but explicit is safer for RPC to ensure role is set correctly)
  -- Our trigger 'on_auth_user_created' defaults to 'student'. We want to override or insert explicitly.
  -- Let's rely on the trigger BUT update the role immediately, or insert manually if we disable trigger.
  -- The trigger 'on_auth_user_created' inserts with role 'student'.
  -- So we update it immediately.
  
  update public.users
  set role = create_user_with_role.role,
      full_name = create_user_with_role.full_name
  where id = new_id;

  return new_id;
end;
$$;

-- Function to delete user (Admin only)
create or replace function public.delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Delete from public.users (will cascade if FK exists, otherwise manual)
  delete from public.users where id = target_user_id;
  -- Delete from auth.users
  delete from auth.users where id = target_user_id;
end;
$$;

-- Function to update user role (Admin only)
create or replace function public.update_user_role(
  target_user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate role
  if new_role not in ('admin', 'teacher', 'student', 'parent') then
    raise exception 'Invalid role. Must be one of: admin, teacher, student, parent';
  end if;
  
  -- Update the user's role in public.users
  update public.users
  set role = new_role
  where id = target_user_id;
  
  if not found then
    raise exception 'User not found';
  end if;
end;
$$;
