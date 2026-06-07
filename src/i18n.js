// Lightweight i18n foundation. UI chrome is translated here; the narrative
// dialogue (dialogue.json) is a separate, larger translation effort.

export const LANGUAGES = [
  { key: 'id', label: 'ID' },
  { key: 'en', label: 'EN' },
];

const STRINGS = {
  id: {
    'settings.title': 'Pengaturan',
    'settings.textSpeed': 'Kecepatan teks',
    'settings.speed.slow': 'lambat',
    'settings.speed.normal': 'normal',
    'settings.speed.fast': 'cepat',
    'settings.speed.instant': 'instan',
    'settings.autoAdvance': 'Auto-lanjut',
    'settings.skipRead': 'Skip yang sudah dibaca',
    'settings.largeText': 'Teks besar',
    'settings.reduceMotion': 'Kurangi gerak/efek',
    'settings.sound': 'Suara',
    'settings.language': 'Bahasa',
    'common.close': 'tutup',
    'common.on': 'on',
    'common.off': 'off',
    'pause.title': 'JEDA',
    'pause.resume': 'lanjut',
    'pause.backlog': 'riwayat',
    'pause.settings': 'pengaturan',
    'pause.quit': 'keluar ke menu',
    'pause.confirmQuit': 'progres run ini disimpan, yakin keluar?',
    'pause.yesQuit': 'ya, keluar',
    'pause.cancel': 'batal',
    'backlog.title': 'Riwayat',
    'backlog.empty': 'Belum ada percakapan.',
  },
  en: {
    'settings.title': 'Settings',
    'settings.textSpeed': 'Text speed',
    'settings.speed.slow': 'slow',
    'settings.speed.normal': 'normal',
    'settings.speed.fast': 'fast',
    'settings.speed.instant': 'instant',
    'settings.autoAdvance': 'Auto-advance',
    'settings.skipRead': 'Skip read lines',
    'settings.largeText': 'Large text',
    'settings.reduceMotion': 'Reduce motion/effects',
    'settings.sound': 'Sound',
    'settings.language': 'Language',
    'common.close': 'close',
    'common.on': 'on',
    'common.off': 'off',
    'pause.title': 'PAUSED',
    'pause.resume': 'resume',
    'pause.backlog': 'history',
    'pause.settings': 'settings',
    'pause.quit': 'quit to menu',
    'pause.confirmQuit': 'this run is saved, quit anyway?',
    'pause.yesQuit': 'yes, quit',
    'pause.cancel': 'cancel',
    'backlog.title': 'History',
    'backlog.empty': 'No conversation yet.',
  },
};

// Returns a translator bound to a language, falling back to ID then the key.
export function makeT(lang = 'id') {
  const dict = STRINGS[lang] || STRINGS.id;
  return (key) => dict[key] ?? STRINGS.id[key] ?? key;
}
