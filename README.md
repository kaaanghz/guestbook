# Supabase 방명록

이 폴더에는 GitHub Pages에서 사용할 수 있는 **독립적인 방명록 페이지**가 있습니다. 별도의 메인 페이지나 우상단 방명록 버튼은 필요하지 않습니다. `guestbook.html`이 실제 페이지이고, `index.html`은 사이트 기본 주소를 방명록으로 바로 보내는 이동 파일입니다.

## 1. Supabase 데이터베이스 준비

방명록 글은 `public.guestbook_entries` 테이블의 `name`, `message`, `created_at`에 저장됩니다. 사이트 방문만으로는 별도 기록을 남기지 않습니다. 다른 Supabase 프로젝트에서 다시 사용할 때는 아래 순서로 설정합니다.

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 사용할 프로젝트를 엽니다.
2. 왼쪽 메뉴 **SQL Editor**에서 새 쿼리를 만듭니다.
3. [`supabase/guestbook.sql`](supabase/guestbook.sql)의 내용을 모두 붙여 넣고 실행합니다.
4. **Table Editor**에서 `public.guestbook_entries` 테이블이 생겼는지 확인합니다.

이전에 만들었던 `guestbook_page_views` 테이블은 방명록 글과 별개인 페이지 방문 기록용입니다. 더 이상 사용하지 않으며, 기존 방문 기록까지 삭제하기로 결정한 경우에만 [`supabase/remove_page_views.sql`](supabase/remove_page_views.sql)을 실행합니다.

## 2. 브라우저 연결 값 입력

1. Supabase 프로젝트의 **Project Settings → API**에서 **Project URL**을 복사합니다.
2. **Project Settings → API Keys**에서 공개용 **publishable key**를 복사합니다. 프로젝트 화면에 기존 `anon` 키만 보이면 그 키도 사용할 수 있습니다.
3. [`supabase-config.js`](supabase-config.js)의 두 값을 교체합니다.
4. **secret** 또는 **service_role** 키는 브라우저 코드에 넣지 않습니다.

## 3. 사이트 주소와 GitHub 업로드

1. 로컬에서는 [http://127.0.0.1:8765/guestbook.html](http://127.0.0.1:8765/guestbook.html)을 엽니다. 이 주소는 로컬 서버가 실행 중인 현재 컴퓨터에서만 열립니다.
2. GitHub 저장소: [kaaanghz/guestbook](https://github.com/kaaanghz/guestbook)
3. 공개 사이트: [https://kaaanghz.github.io/guestbook/](https://kaaanghz.github.io/guestbook/) — `index.html`이 방명록 페이지로 바로 이동시킵니다.

이 폴더는 GitHub 저장소의 `main` 브랜치에 연결되어 있습니다. 이후 파일을 수정하고 업로드할 때 터미널에서 이 폴더로 이동해 아래 명령을 실행하세요.

```bash
git add .
git commit -m "Update guestbook"
git push
```

GitHub Pages는 `main` 브랜치의 최상위 폴더에서 배포하도록 설정되어 있습니다. 새 파일을 올린 뒤 반영까지 잠시 걸릴 수 있습니다.

## 4. 확인

1. 배포된 `guestbook.html` 주소가 열리는지 확인합니다.
2. 이름과 글을 작성해 바로 포스트잇이 붙는지 확인합니다.
3. 다른 브라우저 또는 시크릿 창에서 같은 페이지를 열어 새 글이 실시간으로 추가되는지 확인합니다.
4. Supabase **Table Editor → guestbook_entries**에서 `name`, `message`, `created_at`이 저장되는지 확인합니다.
5. 문제가 있으면 브라우저 개발자 도구의 Console을 확인하고, `supabase-config.js` 값과 SQL 실행 결과를 먼저 확인합니다.

공개 방명록은 로그인 없이 누구나 글을 올릴 수 있습니다. 악성 글이나 스팸을 막는 운영 기능이 필요하면 별도의 정책과 관리 흐름을 추가해야 합니다.
