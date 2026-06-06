const API = '/api';
const TOKEN_KEY = 'shl_token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function saveToken(t) {
  try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

async function post(path, payload) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function register(username, pin) {
  try {
    const { ok, data } = await post('/register', { username, pin });
    if (!ok) return { error: data.error || 'gagal daftar' };
    saveToken(data.token);
    return { username: data.username, progress: data.progress };
  } catch {
    return { error: 'koneksi gagal' };
  }
}

export async function login(username, pin) {
  try {
    const { ok, data } = await post('/login', { username, pin });
    if (!ok) return { error: data.error || 'gagal login' };
    saveToken(data.token);
    return { username: data.username, progress: data.progress };
  } catch {
    return { error: 'koneksi gagal' };
  }
}

// Auto-login from stored token. Returns { username, progress } or null.
export async function loadSession() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/progress?token=${encodeURIComponent(token)}`);
    if (!res.ok) { clearToken(); return null; }
    return await res.json();
  } catch {
    return null;
  }
}

// Hard reset account progress. mode 'full' also wipes the ending gallery.
// Returns the server's authoritative progress, or null on failure.
export async function resetProgress(mode = 'soft') {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, mode }),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data.progress || null;
  } catch {
    return null;
  }
}

export async function saveProgress({ clues, endings, loopCount }) {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, clues, endings, loopCount }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
