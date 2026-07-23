-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create type public.bike_status as enum ('available','rented','service');
create type public.booking_status as enum ('pending','confirmed','cancelled','completed');
create type public.rental_status as enum ('active','returned','cancelled');
create type public.transaction_type as enum ('income','expense');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('owner','manager','staff','accountant')),
  created_at timestamptz not null default now()
);

create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  registration_no text not null unique,
  engine_no text,
  chassis_no text,
  purchase_date date,
  purchase_price numeric(14,2) not null default 0,
  gps_modification_cost numeric(14,2) not null default 0,
  registration_expiry date,
  tax_token_expiry date,
  status public.bike_status not null default 'available',
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  passport_no text,
  driving_license_no text,
  nid_no text,
  visa_residence_id text,
  bd_mobile text,
  foreign_mobile text,
  present_address text,
  emergency_name text,
  emergency_mobile text,
  document_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  bike_id uuid not null references public.bikes(id),
  start_date date not null,
  end_date date not null,
  advance_amount numeric(14,2) not null default 0,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  bike_id uuid not null references public.bikes(id),
  start_date date not null,
  end_date date not null,
  total_days integer not null default 0,
  total_rent numeric(14,2) not null default 0,
  due_amount numeric(14,2) not null default 0,
  status public.rental_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  type public.transaction_type not null,
  category text not null,
  amount numeric(14,2) not null default 0,
  description text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bikes enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.rentals enable row level security;
alter table public.transactions enable row level security;

create policy "authenticated profiles" on public.profiles for select to authenticated using (true);
create policy "authenticated bikes" on public.bikes for all to authenticated using (true) with check (true);
create policy "authenticated customers" on public.customers for all to authenticated using (true) with check (true);
create policy "authenticated bookings" on public.bookings for all to authenticated using (true) with check (true);
create policy "authenticated rentals" on public.rentals for all to authenticated using (true) with check (true);
create policy "authenticated transactions" on public.transactions for all to authenticated using (true) with check (true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),'staff');
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
