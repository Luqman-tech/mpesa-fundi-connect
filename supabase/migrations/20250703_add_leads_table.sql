-- Add leads table for commission per lead tracking
create table leads (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references users(id),
  fundi_id uuid references fundis(id),
  created_at timestamp default now(),
  commission integer default 50,
  status text default 'pending',
  payment_reference text,
  payment_date timestamp
);

-- Add indexes for better performance
create index idx_leads_client_id on leads(client_id);
create index idx_leads_fundi_id on leads(fundi_id);
create index idx_leads_status on leads(status);
