# SATU HARI LAGI — Roadmap Implementasi (semua 100 plan)

Tujuan: masukin SEMUA 100 rencana, tapi diurutkan biar pondasi dibangun dulu supaya item lain nyambung. Tiap fase berdiri sendiri (bisa di-build + deploy sebelum lanjut). Nomor `#N` = plan di HackMD.

---

## Fase 0 — Pondasi (wajib duluan, ngebuka banyak item)
Infra yang dipake fase-fase berikutnya. Tanpa ini, banyak item nempel di tempat yang salah.
- **#78** Settings menu lengkap → rumah buat semua toggle (speed, font, volume, efek, bahasa)
- **#98** i18n scaffolding → pisah teks dari logika (dialogue + UI string ke layer terpisah)
- **#38** Save-state mid-run ke akun (node + line + time)
- **#91** Migrasi backend accounts.json → SQLite
- **#92** Rate limiting + validasi endpoint auth/score
- **#11** Audit typo/penamaan seluruh dialogue.json

## Fase 1 — Text engine & QoL inti (paling kerasa, cepat)
- **#79** Kecepatan teks (slider + instan) · **#36** Auto/skip · **#37** Backlog/riwayat
- **#82** Keyboard penuh · **#81** Konfirmasi keluar · **#85** Indikator loop/waktu
- **#84** Onboarding singkat · **#83** Mobile polish · **#63** Polish SFX UI

## Fase 2 — Sistem petunjuk & investigasi
- **#46** Kategori clue · **#47** Clue deskripsi panjang · **#45** Papan investigasi
- **#48** Gating clue lebih kaya · **#80** Indikator pilihan terkunci · **#52** Hint system
- **#50** Notif "clue terkait" · **#51** % misteri terungkap · **#49** Red herring

## Fase 3 — Narasi dinamis (pakai clue system fase 2)
- **#6** Dialog dinamis berbasis clue · **#41** Konsekuensi lintas-loop
- **#1** Latar belakang MC · **#2** HP/chat MC · **#3** Variasi Raka per loop
- **#5** Jurnal mimpi · **#7** Foreshadowing perempatan · **#58** Nama MC bisa di-set
- **#57** Voice barks · **#9** Glosarium · **#10** Timeline rangkuman · **#8** Easter egg meta
- **#12** Mode cerita panjang (toggle)

## Fase 4 — Ending system
- **#13** Counter X/N · **#14** Hint ending terkunci · **#18** Mood tag · **#19** Epilog
- **#20** Continue diperluas · **#16** Ending "Pembuat Loop" · **#17** Ending "Raka"
- **#15** True ending · **#44** New Game+ · **#21** Share card · **#22** Stats ending global

## Fase 5 — Madness arc diperdalam
- **#23** Meter kewarasan · **#24** Pilihan teracak · **#25** Unreliable narrator
- **#26** Halusinasi visual · **#27** Audio degradasi lanjut · **#28** Recovery kewarasan
- **#29** Setpiece pasca-tangga · **#30** Micro-variasi intro · **#31** Glitch interaktif
- **#32** Mode tenang · **#59** Doppelganger bertingkat · **#60** Reaksi pilihan gila

## Fase 6 — Karakter & relasi
- **#53** Sprite emosi Raka · **#54** Relationship meter · **#55** NPC pelanggan tetap
- **#56** Backstory sosok · **#4** Lore truk & sopir

## Fase 7 — Mekanik gameplay
- **#33** Inventaris ringan · **#34** Jam sebagai sumber daya · **#35** Quick-travel
- **#40** Choice timer · **#42** Mini-puzzle terminal · **#43** Peta kafe interaktif
- **#39** Save slot manual (opsional)

## Fase 8 — Audio
- **#61** Soundtrack adaptif · **#62** Ambience kaya · **#64** Stinger ending
- **#65** Mixer pause menu · **#66** Heartbeat polish · **#67** Mode hening

## Fase 9 — Visual & art
- **#68** Transisi variatif · **#69** Parallax · **#70** Hujan partikel · **#71** Idle animation
- **#72** Color grading per waktu · **#73** Background tambahan · **#74** CG momen kunci
- **#75** Audit palet pixel · **#76** Cursor/UI bertema · **#77** Title animatif

## Fase 10 — Meta, sosial & sisa backend
- **#86** Achievement tambahan · **#87** Stats pribadi · **#88** Daily challenge
- **#89** Speedrun resmi · **#90** Kosmetik unlock · **#95** Share hasil
- **#96** Leaderboard filter · **#97** Ending wall · **#93** Export/import · **#94** Reset PIN

## Fase 11 — Aksesibilitas
- **#99** Reduce-motion + high-contrast · **#100** Dyslexia-friendly + screen reader

---

### Cara jalan
Tiap fase: build lokal → commit → deploy → tes. Mulai dari Fase 0 → 1 (efek paling cepat kerasa). Fase 0 & 1 aman dikerjain bareng karena minim risiko.
