create table if not exists public.lifecycle_email_events (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  event_key text not null,
  template_id text not null,
  recipient text not null,
  status text not null check (status in ('processing', 'sent', 'failed', 'skipped_duplicate')),
  provider_message_id text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lifecycle_email_events_recipient on public.lifecycle_email_events (recipient);
create index if not exists idx_lifecycle_email_events_event_key on public.lifecycle_email_events (event_key);
create index if not exists idx_lifecycle_email_events_status on public.lifecycle_email_events (status);

create or replace function public.set_lifecycle_email_events_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_lifecycle_email_events_updated_at on public.lifecycle_email_events;
create trigger trg_lifecycle_email_events_updated_at
before update on public.lifecycle_email_events
for each row
execute function public.set_lifecycle_email_events_updated_at();
