const CLUE_LIST = [
  'raka-ingat-loop', 'raka-tau-sesuatu', 'segfault-clue',
  'sosok-tau-loop', 'cara-berhenti', 'kecelakaan-jam-3',
  'tau-harus-ke-perempatan', 'identitas-korban', 'banyak-loop',
  'loop-awareness', 'deep-awareness', 'seen-terlambat',
];

// Full list (19 endings) — indices 0-14 match old format
const ENDING_LIST = [
  'selamat', 'terlambat', 'penyesalan', 'pengganti', 'paradoks',
  'observer', 'glitch', 'simulasi', 'penyangkalan', 'acceptance',
  'kekosongan', 'pengemudi', 'dua-sisi', 'pengorbanan', 'kopi-terakhir',
  'berdua', 'marah', 'hacker', 'ingat',
];

// New format: 6 bytes (2 clues + 3 endings + 1 loop) → 8-char base64url
export function encodeSave({ clues, endings, loopCount }) {
  let cluesMask = 0;
  clues.forEach(c => {
    const i = CLUE_LIST.indexOf(c);
    if (i >= 0) cluesMask |= (1 << i);
  });

  let endingsMask = 0;
  endings.forEach(e => {
    const i = ENDING_LIST.indexOf(e);
    if (i >= 0) endingsMask |= (1 << i);
  });

  const loop = Math.min(loopCount, 255);
  const bytes = new Uint8Array(6);
  bytes[0] = (cluesMask >> 8) & 0xFF;
  bytes[1] = cluesMask & 0xFF;
  bytes[2] = (endingsMask >> 16) & 0xFF;
  bytes[3] = (endingsMask >> 8) & 0xFF;
  bytes[4] = endingsMask & 0xFF;
  bytes[5] = loop;

  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function decodeSave(code) {
  try {
    const b64 = code.trim().replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Array.from(atob(b64), c => c.charCodeAt(0));

    if (bytes.length === 5) {
      // Old format: 2 clues + 2 endings (first 15) + 1 loop
      const cluesMask = (bytes[0] << 8) | bytes[1];
      const endingsMask = (bytes[2] << 8) | bytes[3];
      const loopCount = bytes[4];
      const clues = CLUE_LIST.filter((_, i) => cluesMask & (1 << i));
      const endings = ENDING_LIST.slice(0, 15).filter((_, i) => endingsMask & (1 << i));
      return { clues, endings, loopCount };
    }

    if (bytes.length >= 6) {
      // New format: 2 clues + 3 endings (all 19) + 1 loop
      const cluesMask = (bytes[0] << 8) | bytes[1];
      const endingsMask = (bytes[2] << 16) | (bytes[3] << 8) | bytes[4];
      const loopCount = bytes[5];
      const clues = CLUE_LIST.filter((_, i) => cluesMask & (1 << i));
      const endings = ENDING_LIST.filter((_, i) => endingsMask & (1 << i));
      return { clues, endings, loopCount };
    }

    return null;
  } catch {
    return null;
  }
}
