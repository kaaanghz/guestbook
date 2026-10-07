-- 기존 방문 기록과 테이블을 영구 삭제합니다.
-- 방명록 글은 public.guestbook_entries에 남습니다.
drop table if exists public.guestbook_page_views;
