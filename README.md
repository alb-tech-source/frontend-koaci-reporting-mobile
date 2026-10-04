# Koaci Investor (Frontend)

Aplikasi web mobile-first untuk investor Koaci: memantau portofolio, laporan proyek, kwitansi, dan data akun. Backend dan aplikasi admin ada di folder saudara `../Backend` dan `../Frontend-Admin`.

> Project ini memakai Next.js 16, yang punya perubahan besar dibanding versi sebelumnya. Baca panduan di `node_modules/next/dist/docs/` sebelum menulis kode (lihat `AGENTS.md`).

## Menjalankan

Prasyarat: Node.js 20+ dan backend yang berjalan.

```bash
cp .env.example .env.local   # lalu sesuaikan URL backend
npm install
npm run dev                  # http://localhost:3000
```

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan di port 3000 |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm test` | Unit test (Vitest) |

## Variabel lingkungan

| Nama | Isi |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL dasar API backend, termasuk prefix `/api` |

## Struktur

```
src/
  app/          Route (App Router): /, /auth/*, /investor/*, /user/*
  proxy.ts      Pengarah route berdasarkan role
  features/     Kode per fitur: API, types, komponen
  components/   Layout (InvestorShell, BottomNav)
  shared/       Komponen UI, lib, hooks, dan store lintas fitur
```

## Autentikasi

- Backend menyimpan token di cookie httpOnly. Frontend tidak pernah membaca token.
- `establishSession()` di `src/features/auth/session.ts` adalah satu-satunya tempat sesi client dibentuk dari `GET /auth/me`. Login email, callback Google, dan verifikasi email semuanya memakainya.
- Cookie `user_role` hanya dipakai `src/proxy.ts` untuk mengarahkan route. Ini bukan pengaman data: otorisasi ditentukan backend.
- Interceptor di `src/shared/lib/axios.ts` me-refresh token saat 401, kecuali untuk endpoint auth seperti login.

Aplikasi ini hanya melayani role `investor` dan `user`. Role lain ditolak saat login.

## Konvensi

- Format commit ada di `.gitmessage`.
- Mapper respons API (`mapInvestment`, `mapReporting`, dan sejenisnya) wajib punya test.
- Format tanggal: `formatDateID` untuk timestamp, `formatCalendarDateID` untuk tanggal tanpa jam seperti `report_date`.
