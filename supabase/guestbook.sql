-- Supabase Dashboard > SQL Editor에서 한 번 실행하세요.
-- 공개 방명록: 방문자는 읽기와 작성만 할 수 있습니다.

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 40),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

alter table public.guestbook_entries enable row level security;

revoke all on public.guestbook_entries from anon, authenticated;
grant select on public.guestbook_entries to anon, authenticated;
grant insert (name, message) on public.guestbook_entries to anon, authenticated;

drop policy if exists "Anyone can read guestbook entries" on public.guestbook_entries;
create policy "Anyone can read guestbook entries"
  on public.guestbook_entries for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can write guestbook entries" on public.guestbook_entries;
create policy "Anyone can write guestbook entries"
  on public.guestbook_entries for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 40
    and char_length(btrim(message)) between 1 and 500
  );

-- 다른 방문자의 새 글이 즉시 보이도록 Realtime에 테이블을 등록합니다.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guestbook_entries'
  ) then
    alter publication supabase_realtime add table public.guestbook_entries;
  end if;
end $$;

-- 페이지 방문 기록은 공개 목록에 노출하지 않고 관리자만 Dashboard에서 봅니다.
create table if not exists public.guestbook_page_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  path text not null check (char_length(path) between 1 and 200),
  visited_at timestamptz not null default now()
);

create index if not exists guestbook_page_views_visited_at_idx
  on public.guestbook_page_views (visited_at desc);

alter table public.guestbook_page_views enable row level security;
revoke all on public.guestbook_page_views from anon, authenticated;
grant insert (visitor_id, path) on public.guestbook_page_views to anon, authenticated;

drop policy if exists "Visitors can log page views" on public.guestbook_page_views;
create policy "Visitors can log page views"
  on public.guestbook_page_views for insert
  to anon, authenticated
  with check (char_length(path) between 1 and 200);
