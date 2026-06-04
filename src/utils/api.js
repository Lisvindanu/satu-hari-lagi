const API_BASE = '/api';

export async function submitScore({ name, ending, time_ms, loop_count }) {
  try {
    const res = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ending, time_ms, loop_count }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getLeaderboard(ending) {
  try {
    const url = ending
      ? `${API_BASE}/leaderboard?ending=${encodeURIComponent(ending)}&limit=10`
      : `${API_BASE}/leaderboard?limit=5`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return [];
  }
}
