const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3003;
const SCORES_FILE = path.join(__dirname, 'scores.json');
const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const VALID_ENDINGS = new Set([
  'selamat', 'terlambat', 'penyesalan', 'pengganti', 'paradoks', 'observer',
  'glitch', 'simulasi', 'penyangkalan', 'acceptance', 'kekosongan', 'pengemudi',
  'dua-sisi', 'pengorbanan', 'kopi-terakhir', 'berdua', 'marah', 'hacker', 'ingat',
]);

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data)); }

const readScores = () => readJSON(SCORES_FILE, []);
const writeScores = (s) => writeJSON(SCORES_FILE, s);
const readAccounts = () => readJSON(ACCOUNTS_FILE, {});
const writeAccounts = (a) => writeJSON(ACCOUNTS_FILE, a);

const hashPin = (pin, salt) => crypto.createHash('sha256').update(salt + ':' + pin).digest('hex');
const newToken = () => crypto.randomBytes(18).toString('hex');

function findByToken(accounts, token) {
  if (!token) return null;
  for (const key of Object.keys(accounts)) {
    if (accounts[key].token === token) return accounts[key];
  }
  return null;
}

function sanitizeProgress(body) {
  const clues = Array.isArray(body.clues) ? body.clues.filter(c => typeof c === 'string').slice(0, 50) : [];
  const endings = Array.isArray(body.endings) ? body.endings.filter(e => VALID_ENDINGS.has(e)) : [];
  const loopCount = Number.isFinite(body.loopCount) ? Math.max(0, Math.min(9999, Math.floor(body.loopCount))) : 0;
  return { clues, endings, loopCount };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(); } });
  });
}

const send = (res, code, obj) => { res.writeHead(code, HEADERS); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, HEADERS); res.end(); return; }
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  // ── Leaderboard ──
  if (req.method === 'GET' && p === '/leaderboard') {
    const ending = url.searchParams.get('ending');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    let scores = readScores();
    if (ending) scores = scores.filter(s => s.ending === ending);
    scores.sort((a, b) => a.loop_count !== b.loop_count ? a.loop_count - b.loop_count : a.time_ms - b.time_ms);
    return send(res, 200, scores.slice(0, limit));
  }

  // ── Register ──
  if (req.method === 'POST' && p === '/register') {
    let body; try { body = await readBody(req); } catch { return send(res, 400, { error: 'bad' }); }
    const username = String(body.username || '').trim();
    const pin = String(body.pin || '');
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) return send(res, 400, { error: 'username 3-16 huruf/angka/underscore' });
    if (!/^[0-9]{4}$/.test(pin)) return send(res, 400, { error: 'pin harus 4 angka' });
    const accounts = readAccounts();
    const key = username.toLowerCase();
    if (accounts[key]) return send(res, 409, { error: 'username sudah dipakai' });
    const salt = crypto.randomBytes(8).toString('hex');
    const token = newToken();
    accounts[key] = { username, salt, pinHash: hashPin(pin, salt), token, clues: [], endings: [], loopCount: 0, created: Date.now(), updated: Date.now() };
    writeAccounts(accounts);
    return send(res, 201, { token, username, progress: { clues: [], endings: [], loopCount: 0 } });
  }

  // ── Login ──
  if (req.method === 'POST' && p === '/login') {
    let body; try { body = await readBody(req); } catch { return send(res, 400, { error: 'bad' }); }
    const username = String(body.username || '').trim();
    const pin = String(body.pin || '');
    const accounts = readAccounts();
    const acc = accounts[username.toLowerCase()];
    if (!acc || acc.pinHash !== hashPin(pin, acc.salt)) return send(res, 401, { error: 'username atau pin salah' });
    if (!acc.token) { acc.token = newToken(); writeAccounts(accounts); }
    return send(res, 200, { token: acc.token, username: acc.username, progress: { clues: acc.clues, endings: acc.endings, loopCount: acc.loopCount } });
  }

  // ── Get progress (auto-login via token) ──
  if (req.method === 'GET' && p === '/progress') {
    const acc = findByToken(readAccounts(), url.searchParams.get('token'));
    if (!acc) return send(res, 401, { error: 'token invalid' });
    return send(res, 200, { username: acc.username, progress: { clues: acc.clues, endings: acc.endings, loopCount: acc.loopCount } });
  }

  // ── Save progress (merge — progress only grows) ──
  if (req.method === 'POST' && p === '/progress') {
    let body; try { body = await readBody(req); } catch { return send(res, 400, { error: 'bad' }); }
    const accounts = readAccounts();
    const acc = findByToken(accounts, body.token);
    if (!acc) return send(res, 401, { error: 'token invalid' });
    const incoming = sanitizeProgress(body);
    acc.clues = [...new Set([...(acc.clues || []), ...incoming.clues])];
    acc.endings = [...new Set([...(acc.endings || []), ...incoming.endings])];
    acc.loopCount = Math.max(acc.loopCount || 0, incoming.loopCount);
    acc.updated = Date.now();
    writeAccounts(accounts);
    return send(res, 200, { ok: true, progress: { clues: acc.clues, endings: acc.endings, loopCount: acc.loopCount } });
  }

  // ── Submit score (token-based, one best per user+ending) ──
  if (req.method === 'POST' && p === '/scores') {
    let body; try { body = await readBody(req); } catch { return send(res, 400, { error: 'bad' }); }
    const { token, ending, time_ms, loop_count } = body;
    if (!VALID_ENDINGS.has(ending) || typeof time_ms !== 'number' || typeof loop_count !== 'number' || time_ms < 0 || time_ms > 7200000) {
      return send(res, 400, { error: 'invalid' });
    }
    const acc = findByToken(readAccounts(), token);
    if (!acc) return send(res, 401, { error: 'login dulu' });
    const name = acc.username;
    const scores = readScores();
    const idx = scores.findIndex(s => s.name === name && s.ending === ending);
    const entry = { name, ending, time_ms, loop_count, ts: Date.now() };
    if (idx >= 0) {
      const old = scores[idx];
      if (loop_count < old.loop_count || (loop_count === old.loop_count && time_ms < old.time_ms)) scores[idx] = entry;
    } else {
      scores.push(entry);
    }
    writeScores(scores);
    return send(res, 201, { ok: true });
  }

  send(res, 404, { error: 'not found' });
}).listen(PORT, () => console.log('SHL API :' + PORT));
