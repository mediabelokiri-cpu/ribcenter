-- ==============================================================================
-- RIB CENTER: COMPREHENSIVE SAMPLE DATA / SEED
-- Pusat Informasi, Aspirasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (key, value, is_public)
VALUES
  ('general', '{"site_name": "RIB CENTER", "site_tagline": "Pusat Informasi, Aspirasi & Akuntabilitas Publik", "description": "Platform transparansi rekam kerja, publikasi gagasan strategis pembangunan, dan saluran aspirasi masyarakat terpadu bersama Rahmat Ichwan Bahtiar."}'::jsonb, true),
  ('contact', '{"email": "halo@ribcenter.id", "whatsapp": "081155008899", "address": "Gedung RIB CENTER, Jl. Ahmad Yani No. 88, Kab. Polewali Mandar, Provinsi Sulawesi Barat 91311"}'::jsonb, true),
  ('social', '{"whatsapp": "https://wa.me/6281155008899", "facebook": "https://facebook.com/ribcenter.id", "instagram": "https://instagram.com/ribcenter.id", "tiktok": "https://tiktok.com/@ribcenter.id", "youtube": "https://youtube.com/@ribcenter"}'::jsonb, true),
  ('seo', '{"meta_title": "RIB CENTER | Pusat Informasi & Akuntabilitas Publik", "meta_description": "Platform transparansi rekam kerja, publikasi gagasan kebijakan, galeri dokumentasi, dan kanal aspirasi warga bersama Rahmat Ichwan Bahtiar.", "og_image": "/logo.png"}'::jsonb, true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Homepage Sections
INSERT INTO public.homepage_sections (section_key, title, is_active, order_index, content)
VALUES
  ('hero', 'Hero Banner Utama', true, 1, '{"headline": "Mengabdi Bersama Rakyat, Mengawal Kemajuan Daerah", "subheadline": "Pusat transparansi rekam kerja, ruang dialog gagasan pembangunan, dan saluran aspirasi warga secara langsung dan terpercaya."}'::jsonb),
  ('profile_summary', 'Sekilas Profil', true, 2, '{"summary": "Komitmen penuh untuk menghadirkan kerja nyata, mendengar setiap aspirasi warga, serta menjaga keterbukaan informasi publik secara berkelanjutan demi kemajuan Kab. Polewali Mandar, Provinsi Sulawesi Barat."}'::jsonb),
  ('featured_activities', 'Rekam Kerja Unggulan', true, 3, '{"display_count": 3}'::jsonb),
  ('latest_articles', 'Kabar & Gagasan Terbaru', true, 4, '{"display_count": 3}'::jsonb),
  ('gallery_preview', 'Dokumentasi Lapangan', true, 5, '{"display_count": 6}'::jsonb),
  ('aspirations_cta', 'Saluran Aspirasi Warga', true, 6, '{"cta_text": "Sampaikan Aspirasi & Usulan Anda"}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

-- 3. Profile
INSERT INTO public.profile (id, name, display_name, title, photo_url, biography, education, vision, mission, social_links, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Rahmat Ichwan Bahtiar',
  'Rahmat Ichwan Bahtiar, S.Sos., M.AP.',
  'Tokoh Publik & Penggiat Kebijakan Pembangunan Daerah',
  '/logo.png',
  'Rahmat Ichwan Bahtiar adalah tokoh masyarakat dan praktisi kebijakan publik yang berfokus pada penguatan tata kelola pemerintahan yang partisipatif, pemberdayaan ekonomi masyarakat bawah, serta pemerataan akses pendidikan dan kesehatan di Kab. Polewali Mandar, Provinsi Sulawesi Barat.

Memulai pengabdian sejak masa mahasiswa hingga memimpin berbagai inisiatif advokasi daerah, ia meyakini bahwa akuntabilitas publik adalah kunci terpenting dalam membangun kepercayaan antara rakyat dan para pemimpinnya. Melalui platform RIB CENTER ini, ia menyediakan ruang keterbukaan penuh agar masyarakat dapat menelusuri rekam kerja, membaca pokok pikiran kebijakan, serta menyampaikan usulan secara langsung.',
  '[{"institution": "Universitas Mulawarman", "degree": "Magister", "field": "Administrasi Publik (M.AP.)", "year": "2018 - 2020"}, {"institution": "Universitas Hasanuddin", "degree": "Sarjana", "field": "Ilmu Sosial dan Ilmu Politik (S.Sos.)", "year": "2010 - 2014"}]'::jsonb,
  'Terwujudnya tata kelola pembangunan yang transparan, berkeadilan sosial, dan berdaya saing tinggi melalui partisipasi aktif masyarakat dan akuntabilitas kerja yang nyata.',
  '1. Menjaga keterbukaan dan pertanggungjawaban publik atas setiap program kerja dan kebijakan yang dijalankan.
2. Mengoptimalkan serapan dan tindak lanjut aspirasi warga berbasis solusi konkret dan berkeadilan.
3. Mengawal alokasi pembangunan agar memprioritaskan pemenuhan infrastruktur dasar, pendidikan berkualitas, dan kesehatan masyarakat.
4. Mendorong kemandirian ekonomi daerah melalui pendampingan intensif bagi pelaku UMKM dan kelompok tani-nelayan.',
  '{"whatsapp": "https://wa.me/6281155008899", "facebook": "https://facebook.com/ribcenter.id", "instagram": "https://instagram.com/ribcenter.id", "tiktok": "https://tiktok.com/@ribcenter.id"}'::jsonb,
  true
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  title = EXCLUDED.title,
  biography = EXCLUDED.biography,
  education = EXCLUDED.education,
  vision = EXCLUDED.vision,
  mission = EXCLUDED.mission,
  social_links = EXCLUDED.social_links;

-- 4. Activity Categories
INSERT INTO public.activity_categories (id, name, slug, description, order_index, is_active)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Infrastruktur & Lingkungan', 'infrastruktur-lingkungan', 'Program perbaikan jalan, jembatan pedesaan, drainase permukiman, dan fasilitas umum.', 1, true),
  ('10000000-0000-0000-0000-000000000002', 'Pemberdayaan Ekonomi & UMKM', 'ekonomi-umkm', 'Inisiatif penguatan permodalan, pelatihan wirausaha, dan digitalisasi usaha rakyat.', 2, true),
  ('10000000-0000-0000-0000-000000000003', 'Pendidikan & Pengembangan SDM', 'pendidikan-sdm', 'Penyaluran beasiswa, sarana perpustakaan desa, dan peningkatan kompetensi kepemudaan.', 3, true),
  ('10000000-0000-0000-0000-000000000004', 'Kesehatan & Kesejahteraan Sosial', 'kesehatan-sosial', 'Layanan kesehatan gratis, pemenuhan gizi balita-lansia, dan bantuan sosial darurat.', 4, true),
  ('10000000-0000-0000-0000-000000000005', 'Pelayanan Publik & Reses', 'pelayanan-reses', 'Penyerapan aspirasi langsung di dapil, temu konstituen, dan mediasi permohonan warga.', 5, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 5. Activities (Rekam Kerja & Program)
INSERT INTO public.activities (id, title, slug, type, category_id, date, location, regency, district, summary, description, beneficiaries, status, featured, cover_image_url)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Fasilitasi Pembangunan Jembatan Penghubung Antar-Desa Sukamaju', 'fasilitasi-jembatan-penghubung-sukamaju', 'REKAM_KERJA', '10000000-0000-0000-0000-000000000001', '2026-01-20', 'Kecamatan Tinambung', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Tinambung', 'Memfasilitasi realisasi jembatan penyeberangan permanen yang menghubungkan akses ekonomi dan sekolah bagi lebih dari 2.500 warga.', 'Melalui serapan aspirasi dan koordinasi intensif bersama dinas pekerjaan umum, pembangunan jembatan penghubung sepanjang 24 meter ini berhasil direalisasikan. Jembatan ini memangkas waktu tempuh anak sekolah dan distribusi hasil tani warga yang sebelumnya harus memutar sejauh 15 kilometer. Pengawasan pelaksanaan dilakukan secara berkala agar spesifikasi teknis dan ketahanan konstruksi terjamin.', 2800, 'PUBLISHED', true, 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80'),
  ('20000000-0000-0000-0000-000000000002', 'Penyaluran Bantuan Modal Usaha & Pelatihan Digital 150 Pelaku UMKM', 'bantuan-modal-pelatihan-digital-150-umkm', 'PROGRAM', '10000000-0000-0000-0000-000000000002', '2026-02-14', 'Polewali', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Polewali', 'Program pendampingan usaha mikro berupa bantuan stimulan modal usaha, pelatihan pencatatan keuangan, dan onboarding toko online.', 'Sebanyak 150 pelaku UMKM di sektor kuliner, kerajinan tangan, dan sembako mengikuti rangkaian pembinaan intensif selama 3 minggu. Program ini tidak hanya menyerahkan bantuan modal peralatan, melainkan juga mendampingi pengurusan izin PIRT/NIB serta optimasi penjualan melalui media sosial dan marketplace digital.', 450, 'PUBLISHED', true, 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80'),
  ('20000000-0000-0000-0000-000000000003', 'Reses Masa Sidang I: Dialog Terbuka & Serap Aspirasi Petani Hortikultura', 'reses-dialog-terbuka-petani-hortikultura', 'RESES', '10000000-0000-0000-0000-000000000005', '2026-02-28', 'Kecamatan Wonomulyo', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Wonomulyo', 'Mendengarkan keluhan langsung kelompok tani mengenai stabilitas pasokan pupuk subsidi, tata kelola air irigasi, dan harga jual panen.', 'Kegiatan reses dihadiri oleh lebih dari 120 perwakilan kelompok tani sayur dan buah. Seluruh masukan, mulai dari kendala kelangkaan pupuk bersubsidi hingga perlunya pompanisasi air saat musim kemarau, dicatat ke dalam database aspirasi resmi untuk diperjuangkan ke instansi terkait pada pembahasan anggaran perubahan.', 320, 'PUBLISHED', true, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'),
  ('20000000-0000-0000-0000-000000000004', 'Bakti Sosial Pemeriksaan Kesehatan Gratis & Suplemen Balita-Lansia', 'pemeriksaan-kesehatan-gratis-suplemen', 'KEGIATAN', '10000000-0000-0000-0000-000000000004', '2026-01-10', 'Campalagian', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Campalagian', 'Pemeriksaan gula darah, asam urat, tensi, serta pembagian 400 paket vitamin dan makanan bernutrisi tinggi bagi masyarakat.', 'Bekerja sama dengan relawan tenaga medis, kegiatan ini melayani pemeriksaan kesehatan umum bagi 380 warga pra-sejahtera dan lansia. Selain pengobatan ringan dan konsultasi dokter, tim RIB CENTER juga mendistribusikan susu formula khusus balita sebagai upaya pencegahan stunting di tingkat kelurahan.', 520, 'PUBLISHED', false, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'),
  ('20000000-0000-0000-0000-000000000005', 'Penyaluran Paket Beasiswa Berprestasi Jenjang SMA & Mahasiswa', 'penyaluran-beasiswa-berprestasi-daerah', 'PROGRAM', '10000000-0000-0000-0000-000000000003', '2026-03-05', 'Matakali', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Matakali', 'Dukungan biaya pendidikan penuh selama 1 tahun ajaran untuk 75 siswa dan mahasiswa berprestasi dari keluarga kurang mampu.', 'Program beasiswa ini bertujuan memastikan tidak ada generasi muda bertalenta yang putus sekolah karena kendala ekonomi. Penerima beasiswa juga mendapatkan mentoring kepemimpinan dan pelatihan public speaking secara berkala agar siap bersaing di dunia profesional.', 75, 'PUBLISHED', false, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'),
  ('20000000-0000-0000-0000-000000000006', 'Normalisasi dan Pengerukan Saluran Drainase Rawan Genangan Air', 'normalisasi-saluran-drainase-pemukiman', 'REKAM_KERJA', '10000000-0000-0000-0000-000000000001', '2025-11-18', 'Binuang', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Binuang', 'Mengoordinasikan pengerukan sedimen lumpur sepanjang 1,2 kilometer guna meminimalisir luapan air saat curah hujan tinggi.', 'Aspirasi warga RT 12 dan RT 14 terkait genangan air yang kerap memasuki pekarangan warga saat hujan lebat berhasil ditindaklanjuti dengan pengoperasian alat berat ekskavator mini. Pembersihan sedimen parit dan perbaikan tanggul penahan air kini membuat aliran air mengalir lancar menuju sungai utama.', 1100, 'PUBLISHED', false, 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, description = EXCLUDED.description;

-- 6. Articles (Berita & Gagasan)
INSERT INTO public.articles (id, title, slug, type, category, author, excerpt, content, status, featured, published_at, cover_image_url)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'RIB CENTER Luncurkan Platform Keterbukaan Informasi & Serap Aspirasi Warga', 'rib-center-luncurkan-platform-keterbukaan-informasi', 'BERITA', 'Pelayanan Publik', 'Tim Media RIB CENTER', 'Platform digital RIB CENTER resmi diperkenalkan sebagai wujud komitmen transparansi rekam jejak kerja serta sarana komunikasi interaktif dua arah antara masyarakat dan perwakilan publik.', 'POLEWALI MANDAR — Dalam rangka memperkuat keterbukaan informasi publik dan mempercepat respon terhadap permasalahan masyarakat di Kab. Polewali Mandar, Provinsi Sulawesi Barat, RIB CENTER resmi meluncurkan portal informasi dan akuntabilitas terintegrasi.

Melalui platform ini, masyarakat dapat secara terbuka meninjau rekam jejak kerja, realisasi program bantuan sosial, dokumentasi kegiatan lapangan, serta membaca pokok pikiran dan gagasan kebijakan yang diusung oleh Rahmat Ichwan Bahtiar.

"Di era keterbukaan seperti sekarang, akuntabilitas bukan lagi sebuah pilihan, melainkan sebuah kewajiban. Setiap perwakilan rakyat dan pelayan publik harus berani membuka apa yang telah dikerjakan dan siap mendengar kritik serta usulan dari warganya kapan saja," ungkap Rahmat Ichwan Bahtiar dalam sambutan peresmian.

Salah satu fitur unggulan yang disediakan adalah kanal Aspirasi Warga. Melalui fitur ini, setiap pengaduan, kritik, maupun permohonan fasilitas publik akan tercatat secara sistematis dan dapat dipantau status tindak lanjutnya mulai dari tahap verifikasi hingga penyelesaian di lapangan.', 'PUBLISHED', true, now(), 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'),
  ('30000000-0000-0000-0000-000000000002', 'Tinjau Sentra Pertanian Wonomulyo, Rahmat Dorong Perluasan Infrastruktur Irigasi', 'tinjau-sentra-pertanian-dorong-infrastruktur-irigasi', 'BERITA', 'Pembangunan Daerah', 'Tim Media RIB CENTER', 'Kunjungan kerja lapangan dilakukan guna memetakan kebutuhan mendesak para petani terkait pasokan air dan kestabilan distribusi pupuk di musim tanam mendatang.', 'WONOMULYO — Rahmat Ichwan Bahtiar bersama jajaran tim RIB CENTER melakukan peninjauan langsung ke area persawahan dan perkebunan hortikultura di wilayah Wonomulyo, Kab. Polewali Mandar, Provinsi Sulawesi Barat.

Dalam dialog bersama para ketua kelompok tani, terungkap bahwa kendala utama yang dihadapi adalah penurunan debit air irigasi sekunder saat musim peralihan. Hal ini berdampak langsung pada produktivitas tanaman cabai, tomat, dan sayuran daun yang menjadi komoditas unggulan wilayah tersebut.

"Ketahanan pangan daerah berawal dari kesejahteraan para petaninya. Jika saluran air terhambat dan harga sarana produksi melonjak, maka nasib petani dan konsumen di pasar sama-sama tertekan. Ini akan segera kita bawa ke forum pembahasan dengan dinas terkait agar ada solusi pompanisasi darurat dan perbaikan jaringan tersier," tegas Rahmat di hadapan warga.', 'PUBLISHED', true, now(), 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'),
  ('30000000-0000-0000-0000-000000000003', 'Sinergi Pemuda dan UMKM: Menggerakkan Roda Ekonomi Kreatif Berbasis Potensi Lokal', 'sinergi-pemuda-dan-umkm-ekonomi-kreatif', 'BERITA', 'Ekonomi & Pemuda', 'Tim Media RIB CENTER', 'Workshop kolaboratif digelar untuk menghubungkan para pegiat konten digital dengan pelaku usaha mikro agar produk lokal dapat menjangkau pasar nasional.', 'POLEWALI MANDAR — Lebih dari 100 anak muda kreatif dan pelaku UMKM berkumpul dalam lokakarya bertajuk "Pemberdayaan Digital untuk Produk Lokal" yang diinisiasi oleh RIB CENTER di Kab. Polewali Mandar, Provinsi Sulawesi Barat.

Kegiatan ini menekankan pentingnya branding visual, kemasan yang higienis dan menarik, serta pemanfaatan media sosial pendek untuk meningkatkan omzet penjualan produk kuliner dan kerajinan khas daerah.

Rahmat Ichwan Bahtiar menegaskan bahwa potensi anak muda daerah sangat luar biasa jika diberikan wadah dan fasilitas yang memadai. Melalui sinergi antara kreativitas generasi muda dan ketekunan pelaku UMKM, produk-produk lokal Kab. Polewali Mandar, Provinsi Sulawesi Barat diyakini mampu bersaing di kancah nasional.', 'PUBLISHED', false, now(), 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80'),
  ('30000000-0000-0000-0000-000000000004', 'Membangun Budaya Akuntabilitas Publik: Mengapa Transparansi adalah Kunci Kepercayaan Rakyat', 'membangun-budaya-akuntabilitas-publik', 'GAGASAN', 'Opini & Kebijakan', 'Rahmat Ichwan Bahtiar', 'Transparansi bukan sekadar membagikan foto kegiatan seremonial di media sosial, melainkan keberanian mempertanggungjawabkan dampak, anggaran, dan ketercapaian target kepada publik.', 'Dalam lanskap demokrasi modern, tantangan terbesar para pelayan publik adalah memulihkan dan merawat kepercayaan warga (public trust). Janji kampanye yang muluk sering kali menguap tanpa kejelasan jejak, meninggalkan rasa apatis di tengah masyarakat.

Akuntabilitas publik sesungguhnya berdiri di atas tiga pilar utama:

1. Keterbukaan Data yang Dapat Diverifikasi: Masyarakat berhak tahu program apa yang diusulkan, siapa saja penerima manfaatnya, dan berapa besaran anggaran yang dialokasikan tanpa ditutup-tutupi.

2. Ruang Pengawasan Partisipatif: Saluran pengaduan warga tidak boleh sekadar formalitas. Setiap suara warga harus tercatat, diberi nomor register, dan dijawab secara terbuka status penanganannya.

3. Pengukuran Berbasis Dampak (Outcome), Bukan Seremoni: Keberhasilan seorang wakil rakyat tidak dinilai dari berapa banyak baliho yang dipasang, melainkan seberapa banyak jalan rusak yang berhasil diperbaiki, berapa anak putus sekolah yang kembali belajar, dan berapa pelaku usaha kecil yang taraf hidupnya meningkat.

Melalui RIB CENTER, saya berkomitmen untuk mempraktikkan standar akuntabilitas ini secara konsisten. Mari bersama-sama membudayakan keterbukaan demi pemerintahan daerah yang bersih, berwibawa, dan benar-benar berpihak pada rakyat.', 'PUBLISHED', true, now(), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'),
  ('30000000-0000-0000-0000-000000000005', 'Peta Jalan Peningkatan Mutu Pendidikan Vokasi Menghadapi Dinamika Pembangunan Daerah', 'peta-jalan-peningkatan-pendidikan-vokasi-ikn', 'GAGASAN', 'Pendidikan', 'Rahmat Ichwan Bahtiar', 'Menyikapi perkembangan pembangunan daerah, anak-anak daerah tidak boleh sekadar menjadi penonton di rumah sendiri. Revitalisasi SMK dan pelatihan vokasi adalah harga mati.', 'Pembangunan di Kab. Polewali Mandar, Provinsi Sulawesi Barat membuka gelombang peluang ekonomi dan ketenagakerjaan yang masif. Namun, pertanyaan mendasar yang harus kita jawab bersama adalah: apakah tenaga kerja lokal kita sudah dipersiapkan dengan kompetensi yang sesuai?

Kesenjangan antara kurikulum pendidikan kejuruan dan kebutuhan industri konstruksi modern, teknologi hijau, serta manajemen logistik masih cukup lebar. Oleh karena itu, kita mendesak tiga langkah strategis:

Pertama, sertifikasi kompetensi berstandar nasional dan internasional yang dibiayai penuh oleh APBD bagi lulusan SMK dan politeknik daerah.

Kedua, kemitraan wajib (link and match) antara kontraktor dan pelaku industri di Kab. Polewali Mandar, Provinsi Sulawesi Barat dengan balai latihan kerja lokal untuk transfer pengetahuan dan teknologi.

Ketiga, beasiswa afirmasi ke perguruan tinggi unggulan bagi siswa berprestasi di pelosok daerah agar lahir perencana kota dan insinyur unggul dari putra-putri daerah sendiri.', 'PUBLISHED', false, now(), 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'),
  ('30000000-0000-0000-0000-000000000006', 'Menjaga Kedaulatan Nelayan Tradisional dan Konservasi Pesisir Daerah', 'menjaga-kedaulatan-nelayan-dan-konservasi-pesisir', 'GAGASAN', 'Kelautan & Lingkungan', 'Rahmat Ichwan Bahtiar', 'Pemberdayaan nelayan tangkap pesisir harus berjalan seiring dengan penjagaan kelestarian ekosistem mangrove dan terumbu karang.', 'Pesisir Kab. Polewali Mandar, Provinsi Sulawesi Barat kaya akan potensi perikanan laut dan tambak. Namun, nelayan tradisional kerap terjepit oleh tingginya biaya operasional bahan bakar perahu dan minimnya fasilitas cold storage (rantai pendingin) di Tempat Pelelangan Ikan (TPI).

Kita membutuhkan kebijakan terpadu: penyediaan kuota solar bersubsidi yang tepat sasaran tanpa rantai tengkulak, bantuan alat tangkap ramah lingkungan, serta pendampingan bagi kelompok istri nelayan dalam pengolahan produk turunan seperti abon ikan dan kerupuk udang.

Di saat yang sama, perlindungan kawasan hutan bakau (mangrove) harus diperketat dari alih fungsi ilegal, sebab ekosistem inilah yang menjamin ketersediaan bibit udang dan kepiting untuk generasi masa depan.', 'PUBLISHED', false, now(), 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt;

-- 7. Albums & Media
INSERT INTO public.albums (id, title, slug, description, cover_image_url, featured, order_index, status)
VALUES
  ('40000000-0000-0000-0000-000000000001', 'Kunjungan Kerja & Penyerapan Aspirasi Lapangan 2026', 'kunjungan-kerja-penyerapan-aspirasi-2026', 'Dokumentasi dialog langsung bersama warga, peninjauan fasilitas umum, dan kunjungan ke kelompok tani di pedesaan.', 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80', true, 1, 'PUBLISHED'),
  ('40000000-0000-0000-0000-000000000002', 'Program Pelatihan Wirausaha Digital UMKM', 'pelatihan-wirausaha-digital-umkm', 'Rangkaian pelatihan pemasaran digital, kemasan produk, dan literasi pembukuan bagi pelaku usaha mikro.', 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&q=80', true, 2, 'PUBLISHED'),
  ('40000000-0000-0000-0000-000000000003', 'Aksi Sosial & Pelayanan Kesehatan Masyarakat', 'aksi-sosial-pelayanan-kesehatan', 'Dokumentasi kegiatan pemeriksaan kesehatan gratis, donor darah, dan pembagian paket nutrisi keluarga.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', false, 3, 'PUBLISHED')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.media (id, album_id, file_url, media_type, title, alt_text, caption)
VALUES
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80', 'IMAGE', 'Dialog Hangat Bersama Tokoh Masyarakat Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Rahmat Ichwan Bahtiar berdiskusi bersama warga', 'Diskusi tatap muka mendengarkan aspirasi tata ruang desa.'),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80', 'IMAGE', 'Peninjauan Lapangan Saluran Irigasi Pertanian', 'Tinjauan saluran irigasi sawah', 'Memeriksa debit air sungai pembagi untuk area persawahan.'),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&q=80', 'IMAGE', 'Sesi Pembekalan Fotografi Produk Ponsel untuk UMKM', 'Pelatihan foto produk pelaku usaha mikro', 'Peserta mempraktikkan pengambilan foto katalog promosi.'),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', 'IMAGE', 'Pemeriksaan Tensi & Gula Darah Warga Lansia', 'Pemeriksaan kesehatan gratis warga', 'Pemeriksaan kesehatan cuma-cuma oleh tenaga medis sukarelawan.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, caption = EXCLUDED.caption;

-- 8. Aspirations
INSERT INTO public.aspirations (id, name, contact, regency, district, category, subject, message, status, internal_note)
VALUES
  ('60000000-0000-0000-0000-000000000001', 'Hendra Wijaya', '081234567891', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Tinambung', 'Infrastruktur', 'Permohonan Pengaspalan Jalan Penghubung RT 05 Menuju Puskesmas Pembantu', 'Jalan utama sepanjang 800 meter yang menghubungkan pemukiman warga RT 05 ke Puskesmas Pembantu masih berupa tanah liat dan sangat licin saat hujan. Pasien darurat dan ibu hamil kesulitan melintas. Mohon bantuan pengaspalan atau semenisasi.', 'DALAM_TINDAK_LANJUT', 'Telah diverifikasi tim lapangan. Diusulkan ke Dinas PUPR untuk masuk daftar prioritas DAK Fisik Triwulan II 2026.'),
  ('60000000-0000-0000-0000-000000000002', 'Supardi', '085298765432', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Wonomulyo', 'Pertanian & Perikanan', 'Usulan Bantuan Bibit Jagung Hibrida & Pompa Air untuk Poktan Sumber Makmur', 'Kelompok tani kami beranggotakan 25 orang mengelola lahan seluas 18 hektar. Mengingat musim tanam tiba, kami memohon dukungan bibit jagung hibrida dan 2 unit mesin pompa air untuk mengalirkan air dari sungai saat curah hujan rendah.', 'DITINJAU', 'Proposal fisik telah diterima di kantor RIB CENTER. Sedang ditelaah kelayakan teknis bersama dinas pertanian kota.'),
  ('60000000-0000-0000-0000-000000000003', 'Rina Anggraeni', '082145678901', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Campalagian', 'Infrastruktur', 'Permohonan Penerangan Jalan Umum (PJU) di Jalur Rawan Kejahatan', 'Sepanjang tikungan Jl. Poros Km 12 tidak ada lampu penerangan jalan selama hampir 2 tahun. Sudah sering terjadi kecelakaan motor dan rawan tindak kriminal begal malam hari. Mohon perhatian segera.', 'SELESAI', 'Koordinasi bersama Dinas Perhubungan telah selesai. 8 unit lampu PJU LED tenaga surya telah terpasang dan berfungsi normal per 20 Februari 2026.'),
  ('60000000-0000-0000-0000-000000000004', 'Fikri Maulana', '087712345678', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Polewali', 'Kepemudaan & UMKM', 'Usulan Pelatihan Sablon & Desain Grafis bagi Karang Taruna Kelurahan', 'Banyak anak muda tamatan SMA di lingkungan kami yang belum memiliki pekerjaan tetap. Kami ingin mengajukan pelatihan sablon manual dan digital agar teman-teman pemuda bisa membuka usaha konveksi mandiri.', 'BARU', 'Aspirasi baru masuk melalui website. Dijadwalkan untuk dihubungi admin guna konfirmasi jumlah calon peserta.'),
  ('60000000-0000-0000-0000-000000000005', 'Anisa Nurfadilah', '081398765412', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat', 'Matakali', 'Pendidikan', 'Informasi Prosedur dan Syarat Pendaftaran Beasiswa RIB Peduli 2026', 'Selamat siang admin RIB CENTER, saya mahasiswi semester 4 ingin menanyakan syarat IPK minimum dan format surat keterangan tidak mampu untuk pengajuan program beasiswa daerah. Terima kasih.', 'INFORMASI_DIBERIKAN', 'Informasi panduan teknis dan berkas formulir PDF telah dikirimkan secara lengkap melalui nomor WhatsApp yang tertera.')
ON CONFLICT (id) DO UPDATE SET subject = EXCLUDED.subject, message = EXCLUDED.message, status = EXCLUDED.status;
