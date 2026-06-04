import React, { useState, useEffect, useRef } from 'react';
import { submitScore } from '../utils/api';

const ENDINGS = {
  selamat: {
    title: 'SELAMAT',
    subtitle: 'Loop telah berakhir.',
    lines: [
      'Jam 15:01. Hujan berhenti.',
      'Untuk pertama kalinya, waktu berjalan ke depan.',
      'Kamu bebas.',
    ],
    color: 'text-amber-300',
    bgTone: 'bg-amber-950/10',
  },
  terlambat: {
    title: 'TERLAMBAT',
    subtitle: 'Loop berakhir, tapi kamu gagal.',
    lines: [
      'Kamu berteriak, tapi terlalu lambat.',
      'Waktu tidak lagi mengulang.',
      'Tapi kamu akan mengingat ini selamanya.',
    ],
    color: 'text-red-400',
    bgTone: 'bg-red-950/10',
    canContinue: true,
    continueNode: 'post-terlambat',
    continueTime: 15 * 60 + 5,
  },
  pengorbanan: {
    title: 'PENGORBANAN',
    subtitle: 'Kamu mengorbankan segalanya.',
    lines: [
      'Kamu berhasil menyelamatkannya. Kali ini.',
      'Tapi ketika dia menghilang, kamu tidak ikut pergi.',
      'Kamu masih di sini. Di meja yang sama. Menunggu versi berikutnya.',
      'Kamu sekarang adalah sosok di sudut kafe.',
    ],
    color: 'text-purple-400',
    bgTone: 'bg-purple-950/10',
  },
  penyesalan: {
    title: 'PENYESALAN',
    subtitle: 'Kamu hidup. Tapi tidak benar-benar hidup.',
    lines: [
      'Kamu berjalan menjauh dari perempatan.',
      'Hujan membasahi punggungmu.',
      'Di saku, HP bergetar. Notifikasi biasa. Hidup yang biasa.',
      'Tapi setiap jam tiga sore, kamu akan berhenti. Dan mendengarkan.',
      'Suara ban mendecit yang tidak pernah hilang dari kepalamu.',
    ],
    color: 'text-gray-400',
    bgTone: 'bg-gray-950/10',
  },
  pengganti: {
    title: 'PENGGANTI',
    subtitle: 'Kamu selamat. Orang lain tidak.',
    lines: [
      'Kamu menarik dirimu sendiri mundur.',
      'Tapi seseorang yang berdiri di sebelahnya — seorang ibu dengan tas belanjaan — terdorong ke jalan.',
      'Suara klakson. Suara benturan.',
      'Loop berhenti. Kamu selamat.',
      'Tapi sekarang kamu tahu: setiap keselamatan punya harga.',
    ],
    color: 'text-orange-400',
    bgTone: 'bg-orange-950/10',
  },
  paradoks: {
    title: 'PARADOKS',
    subtitle: 'Dua versi dirimu. Nol yang tersisa.',
    lines: [
      'Kamu mendorong tubuhnya. Terlalu kuat.',
      'Kalian berdua jatuh ke tengah jalan.',
      'Truk melintas. Angin. Suara.',
      'Tapi tidak ada rasa sakit.',
      'Ketika kamu membuka mata, kamu ada di kota yang tidak kamu kenal.',
      'Jam di HP: 13:00. Tapi ini bukan Bandung.',
    ],
    color: 'text-cyan-400',
    bgTone: 'bg-cyan-950/10',
  },
  observer: {
    title: 'OBSERVER',
    subtitle: 'Kamu menjadi yang menunggu.',
    lines: [
      'Kamu duduk di kursi sosok. Di sudut kafe yang paling gelap.',
      'HP-mu menyala. Kamu membuka game.',
      'Di luar, hujan mulai turun.',
      'Pintu kafe terbuka. Seseorang masuk. Laptop di tangan. Wajah yang familiar.',
      'Kamu tersenyum. Lelah.',
      '"...Ranked lagi susah hari ini."',
    ],
    color: 'text-indigo-400',
    bgTone: 'bg-indigo-950/10',
  },
  penyangkalan: {
    title: 'PENYANGKALAN',
    subtitle: 'Kamu menolak kenyataan.',
    lines: [
      '"Ini tidak nyata. Ini tidak nyata. Ini tidak nyata."',
      'Kamu mengatakannya berulang-ulang.',
      'Dan mungkin kamu benar.',
      'Tapi loop tetap berjalan.',
      'Dan kamu tetap di sini.',
      'Mungkin itu saja yang penting.',
    ],
    color: 'text-yellow-600',
    bgTone: 'bg-yellow-950/10',
  },
  'kopi-terakhir': {
    title: 'KOPI TERAKHIR',
    subtitle: 'Secangkir kopi. Satu salam perpisahan.',
    lines: [
      '"Americano. Yang terakhir."',
      'Raka membuatnya tanpa bertanya. Dia tahu.',
      'Kalian duduk bersama di counter. Diam.',
      'Hujan turun. Kopi habis.',
      '"Makasih, Ra. Buat semua loop-nya."',
      '"...Jangan bilang selamat tinggal. Nanti gue ikut nangis."',
      'Kamu berjalan keluar. Kali ini, kamu tidak melihat ke belakang.',
    ],
    color: 'text-amber-200',
    bgTone: 'bg-amber-950/10',
  },
  simulasi: {
    title: 'SIMULASI',
    subtitle: 'Tidak ada yang nyata.',
    lines: [
      '> SYSTEM.EXIT(0)',
      '> TERMINATING LOOP_ENGINE...',
      '> FREEING SUBJECT_MEMORY...',
      '> WARNING: SUBJECT WILL LOSE ALL PROGRESS',
      '> CONFIRM? [Y]',
      '',
      'Layar menjadi putih.',
      'Untuk pertama kalinya, tidak ada suara hujan.',
      'Tidak ada bau kopi. Tidak ada Bandung.',
      'Hanya kekosongan yang bersih.',
    ],
    color: 'text-green-400',
    bgTone: 'bg-green-950/10',
  },
  glitch: {
    title: 'GLITCH',
    subtitle: 'Waktu berhenti. Selamanya.',
    lines: [
      'Jam 14:59.',
      'Detik terakhir sebelum segalanya terjadi.',
      'Dan detik itu tidak pernah berakhir.',
      'Hujan membeku di udara. Orang-orang berhenti bergerak.',
      'Kamu berjalan di antara tetes air yang mengambang.',
      'Kamu aman. Selamanya.',
      'Tapi kamu juga sendirian. Selamanya.',
    ],
    color: 'text-cyan-300',
    bgTone: 'bg-cyan-950/10',
  },
  acceptance: {
    title: 'PENERIMAAN',
    subtitle: 'Kamu berhenti melawan.',
    lines: [
      'Kamu duduk di tepi trotoar.',
      'Hujan turun. Jam hampir tiga.',
      'Kali ini, kamu tidak berlari. Tidak berteriak. Tidak menarik siapa pun.',
      'Kamu hanya... ada di sini. Menerima.',
      'Dan untuk pertama kalinya, kamu merasa tenang.',
      'Suara tabrakan terdengar dari kejauhan. Tapi bukan untukmu.',
      'Bukan lagi untukmu.',
    ],
    color: 'text-blue-300',
    bgTone: 'bg-blue-950/10',
  },
  kekosongan: {
    title: 'KEKOSONGAN',
    subtitle: 'Tidak ada yang terjadi. Itu yang paling menakutkan.',
    lines: [
      'Kamu berdiri di perempatan sejak jam satu siang.',
      'Hujan datang. Hujan pergi.',
      'Jam tiga lewat. Tidak ada truk. Tidak ada tabrakan.',
      'Tidak ada apa-apa.',
      'Kamu menunggu sampai malam. Sampai kafe tutup.',
      'Raka melambaikan tangan dari dalam. Kamu tidak membalas.',
      'Mungkin tidak ada loop. Mungkin tidak pernah ada.',
      'Mungkin kamu hanya orang yang terlalu lama berdiri di tengah hujan.',
    ],
    color: 'text-gray-500',
    bgTone: 'bg-gray-950/10',
  },
  pengemudi: {
    title: 'PENGEMUDI',
    subtitle: 'Kamu selalu menjadi pengemudi truk itu.',
    lines: [
      'Di dalam kabin truk, kamu melihat foto di dashboard.',
      'Foto dirimu. Di kafe. Dengan Americano.',
      'Kamu mengemudikan truk ini setiap hari. Rute yang sama.',
      'Dan setiap hari, kamu melihat seseorang menyeberang di perempatan itu.',
      'Kamu menginjak rem. Selalu terlambat.',
      'Bukan karena truknya terlalu cepat.',
      'Tapi karena kamu sudah terlalu lelah untuk berhenti.',
    ],
    color: 'text-red-300',
    bgTone: 'bg-red-950/10',
  },
  berdua: {
    title: 'BERDUA',
    subtitle: 'Tidak ada yang pergi sendirian.',
    lines: [
      'Kamu menarik dirimu sendiri ke trotoar.',
      'Sosok berjaket berdiri di tengah jalan.',
      'Truk melintas menembus tubuhnya.',
      'Dia memudar. Tapi sebelum hilang, dia mengangguk.',
      'Loop berhenti. Kamu sendirian.',
      'Tapi tidak sepenuhnya sendirian.',
    ],
    color: 'text-purple-300',
    bgTone: 'bg-purple-950/10',
  },
  marah: {
    title: 'MARAH',
    subtitle: 'Amarah pun bisa membebaskan.',
    lines: [
      'Kamu tidak ke perempatan hari ini.',
      'Kamu berteriak. Sekuat-kuatnya.',
      'Di tengah hujan, sendirian.',
      'Jam tiga lewat. Tidak ada suara tabrakan.',
      'Mungkin loop ini memang menunggu kamu untuk benar-benar marah.',
    ],
    color: 'text-red-500',
    bgTone: 'bg-red-950/10',
  },
  hacker: {
    title: 'HACKER',
    subtitle: 'Bug bisa di-patch.',
    lines: [
      '> nano collision_event.sh',
      'TARGET_COORD diubah. Event dibatalkan.',
      'Jam tiga. Hujan. Tidak ada ban mendecit.',
      'Sebuah truk melintas pelan di jalan lain.',
      'Dan berhenti sempurna di lampu merah.',
    ],
    color: 'text-green-400',
    bgTone: 'bg-green-950/10',
  },
  ingat: {
    title: 'INGAT',
    subtitle: 'Ingatan yang utuh adalah kebebasan.',
    lines: [
      'Untuk pertama kalinya, kamu ingat semuanya.',
      'Bukan loop yang mengulangmu.',
      'Kamu yang mengulang loop.',
      'Karena ada bagian dari dirimu yang belum siap.',
      'Sekarang kamu siap.',
      'Kamu menutup laptop. Pulang.',
    ],
    color: 'text-sky-300',
    bgTone: 'bg-sky-950/10',
  },
  'dua-sisi': {
    title: 'DUA SISI',
    subtitle: 'Setiap keselamatan punya harga.',
    lines: [
      'Sosok pertama tersenyum. "Selamat. Lu berhasil."',
      'Sosok kedua diam. Matanya kosong.',
      '"Tapi ada yang perlu lu tau," kata yang pertama.',
      '"Setiap kali seseorang keluar dari loop ini, seseorang yang lain masuk."',
      '"Dan orang itu... tidak pernah tau kenapa dia tiba-tiba ada di kafe di Bandung."',
      'Kamu melihat ke luar jendela. Seseorang baru saja duduk di mejamu.',
      'Wajahnya asing. Tapi matanya sama — bingung, lelah, merasa sudah pernah di sini.',
    ],
    color: 'text-violet-400',
    bgTone: 'bg-violet-950/10',
  },
};

export default function EndingScreen({ endingId, loopCount, onRestart, onContinue, elapsedMs, formatTime, user, onShowLeaderboard }) {
  const [lineIndex, setLineIndex] = useState(-1);
  const [showCredits, setShowCredits] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-submit speedrun score once if logged in
  useEffect(() => {
    if (user && elapsedMs != null && !submitted) {
      submitScore({ ending: endingId, time_ms: elapsedMs, loop_count: loopCount })
        .then(ok => { if (ok) setSubmitted(true); });
    }
  }, [user, elapsedMs, endingId, loopCount, submitted]);

  const ending = ENDINGS[endingId] || ENDINGS.terlambat;

  useEffect(() => {
    const timers = ending.lines.map((_, i) =>
      setTimeout(() => setLineIndex(i), 1500 + i * 2000)
    );
    const creditTimer = setTimeout(
      () => setShowCredits(true),
      1500 + ending.lines.length * 2000 + 1000
    );
    const continueTimer = ending.canContinue
      ? setTimeout(() => setShowContinue(true), 1500 + ending.lines.length * 2000 + 3000)
      : null;
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(creditTimer);
      if (continueTimer) clearTimeout(continueTimer);
    };
  }, [ending]);

  return (
    <div className={`fixed inset-0 bg-black ${ending.bgTone} flex flex-col items-center z-50 overflow-y-auto`}>
      <div className="absolute inset-0 screentone opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg px-8 py-16 w-full">
        {/* Title */}
        <div className="animate-fadeIn">
          <h1 className={`text-5xl font-bold ${ending.color} ink-text tracking-wider mb-2`}>
            {ending.title}
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.3em] mb-12">
            {ending.subtitle}
          </p>
        </div>

        {/* Story lines */}
        <div className="space-y-4 mb-16">
          {ending.lines.map((line, i) => (
            <p
              key={i}
              className={`text-lg leading-relaxed transition-opacity duration-1000 ${
                i <= lineIndex ? 'opacity-100' : 'opacity-0'
              } ${line.startsWith('>') ? 'text-green-500 font-mono text-sm' : 'text-gray-400'}`}
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>

        {/* Credits */}
        {showCredits && (
          <div className="animate-fadeIn">
            <div className="text-gray-700 text-xs tracking-wider mb-6 space-y-1">
              <p>Loop diselesaikan dalam {loopCount + 1} percobaan.</p>
              {elapsedMs != null && (
                <p className="text-amber-800">Waktu: <span className="font-mono">{formatTime(elapsedMs)}</span></p>
              )}
            </div>

            {/* Speedrun / leaderboard status */}
            {submitted && (
              <div className="mb-6 text-amber-700 text-xs tracking-widest">
                ✓ score masuk leaderboard
                <button onClick={onShowLeaderboard} className="ml-3 text-gray-500 hover:text-gray-300 cursor-pointer">
                  lihat leaderboard
                </button>
              </div>
            )}
            {!user && elapsedMs != null && (
              <div className="mb-6 text-gray-600 text-[11px] tracking-widest">
                login dulu di menu utama biar progress & score tersimpan
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={onRestart}
                className="block mx-auto text-gray-500 text-sm tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 cursor-pointer"
              >
                MAIN LAGI
              </button>
            </div>

            {showContinue && ending.canContinue && (
              <button
                onClick={() => onContinue(ending.continueNode, ending.continueTime)}
                className={`block mx-auto mt-6 ${ending.color} text-sm tracking-[0.5em] hover:text-white transition-colors duration-500 cursor-pointer animate-pulse`}
              >
                . . .
              </button>
            )}

            <div className="mt-10 text-gray-800 text-xs tracking-wider">
              <p>SATU HARI LAGI</p>
              <p className="mt-1">visual novel — time loop</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
