const CLUE_LIST = [
  'raka-ingat-loop', 'raka-tau-sesuatu', 'segfault-clue',
  'sosok-tau-loop', 'cara-berhenti', 'kecelakaan-jam-3',
  'tau-harus-ke-perempatan', 'identitas-korban', 'banyak-loop',
  'loop-awareness', 'deep-awareness', 'seen-terlambat',
];

const ENDING_LIST = [
  'selamat', 'terlambat', 'penyesalan', 'pengganti', 'paradoks',
  'observer', 'glitch', 'simulasi', 'penyangkalan', 'acceptance',
  'kekosongan', 'pengemudi', 'dua-sisi', 'pengorbanan', 'kopi-terakhir',
];

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
  const bytes = new Uint8Array(5);
  bytes[0] = (cluesMask >> 8) & 0xFF;
  bytes[1] = cluesMask & 0xFF;
  bytes[2] = (endingsMask >> 8) & 0xFF;
  bytes[3] = endingsMask & 0xFF;
  bytes[4] = loop;

  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function decodeSave(code) {
  try {
    const b64 = code.trim().replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Array.from(atob(b64), c => c.charCodeAt(0));
    if (bytes.length < 5) return null;

    const cluesMask = (bytes[0] << 8) | bytes[1];
    const endingsMask = (bytes[2] << 8) | bytes[3];
    const loopCount = bytes[4];

    const clues = CLUE_LIST.filter((_, i) => cluesMask & (1 << i));
    const endings = ENDING_LIST.filter((_, i) => endingsMask & (1 << i));

    return { clues, endings, loopCount };
  } catch {
    return null;
  }
}
