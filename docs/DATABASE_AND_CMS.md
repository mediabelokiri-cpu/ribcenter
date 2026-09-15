# Dokumentasi Arsitektur Data, Keamanan & CMS (Phase 1)
Platform Informasi & Akuntabilitas Publik — Rahmat Ichwan Bahtiar

---

## 1. Skema Basis Data (Database Schema)

Struktur data PostgreSQL dirancang mengikuti prinsip **Flexible Content, Fixed System**, termigrasi secara reproduktif pada direktori `supabase/migrations/`:

### Entitas Utama
| Tabel | Deskripsi | Status / Enum yang Didukung | Relasi / Catatan |
| :--- | :--- | :--- | :--- |
| `site_settings` | Pengaturan global situs berbasis JSONB | - | Key unik, flag `is_public` |
| `homepage_sections` | Konfigurasi urutan & modul section beranda | - | Urutan indeks, flag `is_active` |
| `profile` | Profil tunggal Rahmat Ichwan Bahtiar | - | Visi, misi, bio, JSONB pendidikan |
| `timeline` | Riwayat rekam jejak & perjalanan | `PENDIDIKAN`, `KARIER`, `ORGANISASI`, `POLITIK`, `LAINNYA` | Tahun mulai, urutan, flag `is_published` |
| `organizations` | Rekam organisasi dan jabatan | - | Periode mulai/selesai, flag `is_published` |
| `activity_categories` | Taksonomi kategori Rekam Kerja | - | Slug unik, flag `is_active` |
| `activities` | Entitas terpadu Rekam Kerja | `REKAM_KERJA`, `PROGRAM`, `KEGIATAN`, `RESES` \| `DRAFT`, `PUBLISHED`, `ARCHIVED` | FK ke `activity_categories`, lokasi, penerima manfaat |
| `articles` | Entitas terpadu Kabar & Gagasan | `BERITA`, `GAGASAN` \| `DRAFT`, `PUBLISHED`, `ARCHIVED` | Slug unik, FK opsional ke `activities`, tanggal terbit |
| `albums` | Album dokumentasi kegiatan | `DRAFT`, `PUBLISHED`, `ARCHIVED` | Slug unik, featured flag |
| `media` | Aset media (foto, video, dokumen) | `IMAGE`, `VIDEO`, `DOCUMENT` | FK ke `albums(id)` |
| `aspirations` | Saluran aspirasi masyarakat | `BARU`, `DITINJAU`, `DALAM_TINDAK_LANJUT`, `SELESAI`, `INFORMASI_DIBERIKAN` | Kolom `internal_note` **wajib privat** |
| `admin_users` | Akun internal administrator | Role: `ADMIN` | FK ke `auth.users(id)` Supabase Auth |
| `audit_logs` | Jejak audit operasional administratif | - | FK opsional ke `auth.users(id)` |

### Strategi Pengindeksan (Indexing)
* **Slug Lookups:** Indeks unik pada `activities.slug`, `articles.slug`, `albums.slug`, `activity_categories.slug`.
* **Public Filtering:** Indeks komposit `(status, date DESC)` pada `activities` dan `(status, published_at DESC)` pada `articles`.
* **Flags:** Indeks parsial pada `featured` untuk konten terpilih (`WHERE featured = true`).
* **Relasi:** Indeks foreign key pada `activities.category_id`, `articles.related_activity_id`, `media.album_id`.
* **Aspirasi:** Indeks pada `(status, created_at DESC)` untuk monitoring admin.

---

## 2. Autentikasi Admin (Authentication)

* **Mekanisme:** Menggunakan **Supabase Auth** berbasis password flow (`signInWithPassword`) yang terisolasi khusus pengguna internal.
* **Tidak Ada Akun Publik:** Pendaftaran publik dinonaktifkan (`disable_signup`). Publik tidak memiliki hak akses maupun dashboard pengguna.
* **Manajemen Sesi:** Sesi dikelola secara aman melalui cookies HTTP-only yang disinkronisasi oleh `@supabase/ssr` (`createBrowserClient` dan `createServerClient`).

---

## 3. Otorisasi & Proteksi Rute (Route Protection)

* **Middleware Guard (`src/middleware.ts`):**
  - Mencegat seluruh permintaan ke rute `/admin/*` (kecuali `/admin/login`).
  - Memeriksa sesi pengguna aktif. Jika tidak valid/unauthenticated, langsung mengalihkan (*redirect*) ke `/admin/login`.
  - Mengalihkan pengguna terautentikasi yang mengakses `/admin/login` kembali ke `/admin`.
* **Server-Side Guard (`src/lib/auth.ts`):**
  - Fungsi `requireAdmin()` dan `getCurrentAdmin()` memverifikasi identitas pengguna di tabel `public.admin_users` dengan role `ADMIN`.
  - Tidak mengandalkan penyembunyian elemen UI semata; otorisasi dieksekusi di level Server Component dan Server Action.

---

## 4. Keamanan & Row Level Security (RLS)

* **Kebijakan Publik (Anonymous):**
  - Hanya dapat membaca (*SELECT*) konten dengan flag `is_published = true` atau `status = 'PUBLISHED'`.
  - Konten berstatus `DRAFT` atau `ARCHIVED` **secara mutlak tidak dapat dibaca** oleh publik.
  - Untuk tabel `aspirations`: Publik hanya memiliki hak `INSERT` (kirim aspirasi). Hak `SELECT`, `UPDATE`, dan `DELETE` ditolak sepenuhnya. Kolom `internal_note` dan kontak warga terlindungi dari publik.
* **Kebijakan Administrator:**
  - Evaluasi hak akses menggunakan fungsi PostgreSQL `public.is_admin()`.
  - Administrator memiliki akses penuh (*ALL: SELECT, INSERT, UPDATE, DELETE*) ke seluruh tabel.
* **Manajemen Kredensial:**
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` aman digunakan di sisi client.
  - `SUPABASE_SERVICE_ROLE_KEY` **hanya** berada di server dan tidak pernah diekspor ke client bundle.

---

## 5. Lapisan Akses Data CMS (CMS Service Layer)

Akses data dipisahkan dari komponen tampilan melalui service modular di direktori `src/services/`:
* `src/services/settings.ts`: Layanan pengaturan situs publik dan admin.
* `src/services/profile.ts`: Layanan profil, linimasa perjalanan, dan riwayat organisasi.
* `src/services/activities.ts`: Layanan data Rekam Kerja (pemisahan tegas `getPublishedActivities` vs `getAllActivitiesForAdmin`).
* `src/services/articles.ts`: Layanan Berita & Gagasan (pemisahan `getPublishedArticles` vs `getAllArticlesForAdmin`).
* `src/services/media.ts`: Layanan album dan aset media.
* `src/services/aspirations.ts`: Layanan intake publik `submitAspiration` dan manajemen admin `getAllAspirationsForAdmin`.
* `src/services/dashboard.ts`: Agregasi metrik penghitungan ringkas dan daftar terbaru untuk Admin Dashboard.
* **Fallback & Mocking Aman:** Dilengkapi mekanisme fallback data pengembangan berlabel `[DUMMY/TEST]` sehingga server pengembangan dan pengujian otomatis dapat berjalan mulus tanpa ketergantungan jaringan eksternal.
