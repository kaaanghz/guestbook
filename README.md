# Supabase 방명록

이 폴더에는 GitHub Pages에서 사용할 수 있는 **독립적인 방명록 페이지**가 있습니다. 별도의 메인 페이지나 우상단 방명록 버튼은 필요하지 않습니다. `guestbook.html`이 실제 페이지이고, `index.html`은 사이트 기본 주소를 방명록으로 바로 보내는 이동 파일입니다.

## 1. Supabase 데이터베이스 준비

현재 연결된 Supabase 프로젝트에는 두 테이블이 만들어져 있습니다. 다른 Supabase 프로젝트에서 다시 사용할 때는 아래 순서로 설정합니다.

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 사용할 프로젝트를 엽니다.
2. 왼쪽 메뉴 **SQL Editor**에서 새 쿼리를 만듭니다.
3. [`supabase/guestbook.sql`](supabase/guestbook.sql)의 내용을 모두 붙여 넣고 실행합니다.
4. **Table Editor**에서 `public.guestbook_entries`와 `public.guestbook_page_views` 테이블이 생겼는지 확인합니다. 기존에 방명록 SQL을 실행했다면, 새로 추가된 방문 기록 테이블을 만들기 위해 **전체 SQL을 다시 실행**해도 됩니다.

방명록 글은 `guestbook_entries`에 저장되어 페이지에 공개됩니다. 페이지를 연 기록은 `guestbook_page_views`에 저장되고 공개 페이지에서는 조회할 수 없습니다. 방문 기록에는 브라우저가 생성한 임의 ID, 방문 시각, 페이지 경로만 들어갑니다. 브라우저 저장소를 지우면 새 ID가 생기므로 이 ID는 정확한 사람 수를 뜻하지 않습니다.

## 2. 브라우저 연결 값 입력

1. Supabase 프로젝트의 **Project Settings → API**에서 **Project URL**을 복사합니다.
2. **Project Settings → API Keys**에서 공개용 **publishable key**를 복사합니다. 프로젝트 화면에 기존 `anon` 키만 보이면 그 키도 사용할 수 있습니다.
3. [`supabase-config.js`](supabase-config.js)의 두 값을 교체합니다.
4. **secret** 또는 **service_role** 키는 브라우저 코드에 넣지 않습니다.

## 3. 방명록 페이지 열기 및 배포

1. 로컬에서는 [http://127.0.0.1:8765/guestbook.html](http://127.0.0.1:8765/guestbook.html)을 엽니다. 이 주소는 로컬 서버가 실행 중인 현재 컴퓨터에서만 열립니다.
2. GitHub Pages로 공개하려면 `index.html`, `guestbook.html`, `guestbook.css`, `guestbook.js`, `supabase-config.js`를 GitHub Pages가 배포하는 폴더에 넣습니다. 메인 페이지에 링크를 추가할 필요는 없습니다.
3. 배포 후 저장소의 **Settings → Pages**에 표시되는 기본 주소를 열면 방명록으로 이동합니다.

## 4. 확인

1. 배포된 `guestbook.html` 주소가 열리는지 확인합니다.
2. 이름과 글을 작성해 바로 포스트잇이 붙는지 확인합니다.
3. 다른 브라우저 또는 시크릿 창에서 같은 페이지를 열어 새 글이 실시간으로 추가되는지 확인합니다.
4. Supabase **Table Editor → guestbook_page_views**에서 페이지를 열 때마다 방문 행이 추가되는지 확인합니다.
5. 문제가 있으면 브라우저 개발자 도구의 Console을 확인하고, `supabase-config.js` 값과 SQL 실행 결과를 먼저 확인합니다.

공개 방명록은 로그인 없이 누구나 글을 올릴 수 있습니다. 악성 글이나 스팸을 막는 운영 기능이 필요하면 별도의 정책과 관리 흐름을 추가해야 합니다.
