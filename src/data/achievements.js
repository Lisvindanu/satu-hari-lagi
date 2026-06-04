export const ACHIEVEMENTS = [
  // Visible achievements
  { id: 'first-ending', title: 'Awal Dari Segalanya', desc: 'Raih ending pertama', icon: '★', secret: false },
  { id: 'collector', title: 'Kolektor', desc: 'Buka 5 ending berbeda', icon: '◆', secret: false },
  { id: 'explorer', title: 'Penjelajah', desc: 'Buka 10 ending berbeda', icon: '◈', secret: false },
  { id: 'completionist', title: 'Penakluk Loop', desc: 'Buka semua 19 ending', icon: '✦', secret: false },
  { id: 'looper', title: 'Looper Sejati', desc: 'Bertahan 5 loop atau lebih', icon: '∞', secret: false },
  { id: 'clue-hunter', title: 'Detektif', desc: 'Kumpulkan 8 petunjuk', icon: '?', secret: false },
  // Secret / hidden achievements
  { id: 'speedrunner', title: 'Speedrunner', desc: 'Selesai dalam 5 menit', icon: '»', secret: true, sessionOnly: true },
  { id: 'glitch-end', title: 'Glitch Seeker', desc: 'Edit time_reset.cfg', icon: '░', secret: true },
  { id: 'simulasi-end', title: 'Keluar Sistem', desc: 'system.exit(0)', icon: '○', secret: true },
  { id: 'hacker-end', title: 'Pemrogram Gelap', desc: 'Ada file lain di /system/', icon: '>', secret: true },
  { id: 'kopi-end', title: 'Satu Cangkir Lagi', desc: 'Pamit ke Raka sebelum pergi', icon: '□', secret: true },
  { id: 'berdua-end', title: 'Tidak Sendirian', desc: 'Bawa sosok itu bersamamu', icon: '◇', secret: true },
  { id: 'marah-end', title: 'Amarah yang Cukup', desc: 'Terkadang marah itu cukup', icon: '!', secret: true },
  { id: 'sacrifice-end', title: 'Pengorbanan', desc: 'Selamatkan, tapi tinggal', icon: '+', secret: true },
  { id: 'observer-end', title: 'Pengamat Abadi', desc: 'Ambil tempatnya di sudut kafe', icon: '|', secret: true },
  { id: 'paradoks-end', title: 'Dua Versi', desc: 'Dua versi bertemu di tengah jalan', icon: '~', secret: true },
  { id: 'pengemudi-end', title: 'Di Balik Kemudi', desc: 'Temukan truk di gang sebelah', icon: '->', secret: true },
  { id: 'ingat-end', title: 'Ingat Segalanya', desc: 'Ingat betul-betul, lalu pergi', icon: '◎', secret: true },
  { id: 'denial-end', title: 'Tidak Percaya', desc: 'Menolak kenyataan sampai akhir', icon: '/', secret: true },
  { id: 'acceptance-end', title: 'Menerima', desc: 'Berhenti melawan loop', icon: '_', secret: true },
];

export function checkAchievements({ endings, clues, loopCount }) {
  const unlocked = new Set();

  if (endings.length >= 1)  unlocked.add('first-ending');
  if (endings.length >= 5)  unlocked.add('collector');
  if (endings.length >= 10) unlocked.add('explorer');
  if (endings.length >= 19) unlocked.add('completionist');
  if (loopCount >= 5)       unlocked.add('looper');
  if (clues.length >= 8)    unlocked.add('clue-hunter');

  if (endings.includes('glitch'))       unlocked.add('glitch-end');
  if (endings.includes('simulasi'))     unlocked.add('simulasi-end');
  if (endings.includes('hacker'))       unlocked.add('hacker-end');
  if (endings.includes('kopi-terakhir'))unlocked.add('kopi-end');
  if (endings.includes('berdua'))       unlocked.add('berdua-end');
  if (endings.includes('marah'))        unlocked.add('marah-end');
  if (endings.includes('pengorbanan'))  unlocked.add('sacrifice-end');
  if (endings.includes('observer'))     unlocked.add('observer-end');
  if (endings.includes('paradoks'))     unlocked.add('paradoks-end');
  if (endings.includes('pengemudi'))    unlocked.add('pengemudi-end');
  if (endings.includes('ingat'))        unlocked.add('ingat-end');
  if (endings.includes('penyangkalan')) unlocked.add('denial-end');
  if (endings.includes('acceptance'))   unlocked.add('acceptance-end');

  return unlocked;
}
