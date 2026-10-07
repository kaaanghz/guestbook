import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';

const form = document.querySelector('#guestbook-form');
const nameInput = document.querySelector('#guest-name');
const messageInput = document.querySelector('#guest-message');
const submitButton = document.querySelector('#submit-button');
const formStatus = document.querySelector('#form-status');
const listStatus = document.querySelector('#list-status');
const list = document.querySelector('#guestbook-list');
const count = document.querySelector('#entry-count');
const characterCount = document.querySelector('#character-count');
const entries = new Map();
const maxEntries = 100;

messageInput.addEventListener('input', () => {
  characterCount.textContent = `${messageInput.value.length} / 500`;
});

const configured = /^https:\/\/.+\.supabase\.co\/?$/.test(SUPABASE_URL)
  && SUPABASE_PUBLISHABLE_KEY !== 'YOUR_SUPABASE_PUBLISHABLE_KEY';

if (!configured) {
  submitButton.disabled = true;
  listStatus.textContent = 'Supabase 연결 설정이 필요합니다. supabase-config.js를 확인해 주세요.';
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  // 같은 브라우저의 방문을 느슨하게 묶는 임의 ID입니다. 이름/IP는 기록하지 않습니다.
  try {
    let visitorId = localStorage.getItem('guestbook-visitor-id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('guestbook-visitor-id', visitorId);
    }
    supabase.from('guestbook_page_views')
      .insert({ visitor_id: visitorId, path: location.pathname.slice(0, 200) })
      .then(({ error }) => {
        if (error) console.warn('방문 기록 저장에 실패했습니다:', error.message);
      });
  } catch (error) {
    console.warn('방문 기록을 준비하지 못했습니다:', error);
  }

  function render() {
    const sorted = [...entries.values()]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, maxEntries);
    const fragment = document.createDocumentFragment();

    sorted.forEach((entry, index) => {
      const note = document.createElement('article');
      note.className = `note note-${index % 5}`;

      const message = document.createElement('p');
      message.className = 'note-message';
      message.textContent = entry.message;

      const footer = document.createElement('footer');
      const author = document.createElement('strong');
      author.textContent = entry.name;
      const date = document.createElement('time');
      date.dateTime = entry.created_at;
      date.textContent = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(entry.created_at));

      footer.append(author, date);
      note.append(message, footer);
      fragment.append(note);
    });

    list.replaceChildren(fragment);
    count.textContent = sorted.length ? `${sorted.length}개의 포스트잇` : '';
    listStatus.textContent = sorted.length ? '' : '첫 번째 포스트잇을 남겨주세요.';
  }

  const channel = supabase
    .channel('public-guestbook')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook_entries' }, ({ new: entry }) => {
      entries.set(entry.id, entry);
      render();
    })
    .subscribe();

  async function loadEntries() {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(maxEntries);

    if (error) {
      listStatus.textContent = '방명록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.';
      return;
    }
    data.forEach((entry) => entries.set(entry.id, entry));
    render();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) {
      formStatus.textContent = '이름과 하고 싶은 말을 모두 적어주세요.';
      return;
    }

    submitButton.disabled = true;
    formStatus.textContent = '포스트잇을 붙이는 중이에요…';
    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({ name, message })
      .select('id, name, message, created_at')
      .single();
    submitButton.disabled = false;

    if (error) {
      formStatus.textContent = '저장하지 못했어요. 잠시 후 다시 시도해 주세요.';
      return;
    }

    entries.set(data.id, data);
    render();
    form.reset();
    characterCount.textContent = '0 / 500';
    formStatus.textContent = '포스트잇을 붙였어요!';
  });

  window.addEventListener('pagehide', () => supabase.removeChannel(channel));
  loadEntries();
}
