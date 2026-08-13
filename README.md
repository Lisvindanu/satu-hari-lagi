# Satu Hari Lagi

Visual novel bertema time loop, berlatar Bandung. Seorang mahasiswa terjebak mengulang hari yang sama, dan satu-satunya jalan keluar adalah memahami kenapa hari itu tidak mau berakhir.

75 node dialog bercabang, 18 ending, 20 achievement.

## Menjalankan secara lokal

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Game berjalan di `http://localhost:5173`.

Leaderboard dan akun pemain ditangani server terpisah yang opsional — game tetap bisa dimainkan penuh tanpanya, hanya skor yang tidak tersimpan.

```bash
node server/server.js
```

Server berjalan di port `3003` dan menyimpan data sebagai berkas JSON di `server/`. Tidak ada database.

## Struktur

```
src/
├── data/
│   ├── dialogue.json      75 node cerita, pilihan, dan percabangan ending
│   └── achievements.js    definisi 20 achievement
├── hooks/
│   ├── useGameState.js    state cerita, clue, dan progres ending
│   ├── useSpeedrun.js     timer untuk speedrun
│   ├── useSettings.js     preferensi pemain
│   └── useAudio.js        musik dan efek suara
└── components/            layar judul, kotak dialog, galeri ending, dsb.
```

Alur cerita seluruhnya berbasis data. Menambah cabang baru berarti menambah node di `dialogue.json` — tidak perlu menyentuh komponen React.

### Bentuk sebuah node

```json
{
  "id": "intro-first",
  "background": "cafe-siang",
  "character": null,
  "lines": [
    { "speaker": "narasi", "text": "Kamu duduk di meja pojok sebuah coffee shop kecil di Bandung." }
  ],
  "choices": [
    {
      "text": "Tanya soal truk itu",
      "nextNode": "truk-pertanyaan",
      "requiresClue": "kecelakaan",
      "givesClue": "truk",
      "timeCost": 10
    }
  ]
}
```

Dua field menopang seluruh percabangan. `requiresClue` menyembunyikan pilihan sampai pemain menemukan petunjuk tertentu, sehingga cerita bercabang berdasarkan apa yang pemain *ketahui*, bukan sekadar urutan klik. `timeCost` memperlakukan waktu sebagai sumber daya — setiap pilihan memajukan jam, dan sebagian ending hanya terjangkau kalau pemain tidak membuangnya.

Node juga bisa membawa `ending` untuk menutup satu jalur, atau `triggerDeath` untuk mengakhiri loop lebih awal.

## Stack

React 19, Vite 8, Tailwind CSS v4, dan React Three Fiber untuk efek latar. Server skor memakai modul `http` bawaan Node tanpa framework.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
