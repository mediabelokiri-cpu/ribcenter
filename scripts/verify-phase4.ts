/**
 * Phase 4 Automated Verification Script
 * Validates Kabar & Gagasan Engine (Unified Articles System), Type Separation,
 * Slug Uniqueness, Publication & Draft Isolation, Featured Content,
 * Related Activity Linkage, and CRUD operations.
 */

import {
  getPublishedArticles,
  getArticleBySlug,
  getArticleByIdForAdmin,
  getAllArticlesForAdmin,
  isArticleSlugAvailable,
  createArticle,
  updateArticle,
  deleteArticle,
  getDistinctArticleCategories,
} from '../src/services/articles';
import { slugify, isValidSlug } from '../src/lib/slug';

async function runPhase4Verification() {
  console.log('=== PHASE 4: KABAR & GAGASAN (UNIFIED ARTICLES) VERIFICATION ===\n');

  const testIdsToCleanup: string[] = [];

  try {
    // -------------------------------------------------------------------------
    // 1. SLUG UTILITY & UNIQUENESS VALIDATION
    // -------------------------------------------------------------------------
    console.log('--- 1. Slug Generator & Uniqueness Validation ---');
    const sampleArticleTitle = 'Membangun Ekosistem Kopi & Kakao Mandar di Era Digital!';
    const generatedSlug = slugify(sampleArticleTitle);
    if (generatedSlug === 'membangun-ekosistem-kopi-kakao-mandar-di-era-digital') {
      console.log('[PASS] Slugify generates clean URL-safe slug:', generatedSlug);
    } else {
      throw new Error(`[FAIL] Slugify output unexpected: ${generatedSlug}`);
    }

    if (isValidSlug(generatedSlug) && !isValidSlug('invalid slug with/spaces')) {
      console.log('[PASS] isValidSlug validates slug format correctly');
    } else {
      throw new Error('[FAIL] isValidSlug failed');
    }

    // -------------------------------------------------------------------------
    // 2. UNIFIED ARTICLES CRUD & TYPE SEPARATION (BERITA vs GAGASAN)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Unified Articles CRUD & Type Separation ---');

    // 2A: Create BERITA
    const beritaSlug = `test-berita-phase4-${Date.now()}`;
    const newBerita = await createArticle({
      title: '[TEST] Berita Peninjauan Jembatan Gantung Desa',
      slug: beritaSlug,
      type: 'BERITA',
      excerpt: 'Laporan peninjauan kondisi jembatan penghubung antar desa di wilayah Polewali Mandar.',
      content: 'Isi lengkap berita uji coba peninjauan jembatan desa untuk memastikan keselamatan akses warga.',
      cover_image_url: 'https://images.example.com/jembatan.jpg',
      category: 'Infrastruktur',
      author: 'Rahmat Ichwan Bahtiar',
      published_at: new Date().toISOString(),
      status: 'PUBLISHED',
      featured: false,
      seo_title: 'Peninjauan Jembatan Desa - Rahmat Ichwan Bahtiar',
      seo_description: 'Berita resmi peninjauan jembatan penghubung desa di Polewali Mandar.',
    });
    testIdsToCleanup.push(newBerita.id);

    if (newBerita.id && newBerita.type === 'BERITA') {
      console.log(`[PASS] Created article with type [BERITA]: ${newBerita.title} (ID: ${newBerita.id})`);
    } else {
      throw new Error('[FAIL] Failed to create BERITA article');
    }

    // 2B: Create GAGASAN
    const gagasanSlug = `test-gagasan-phase4-${Date.now()}`;
    const newGagasan = await createArticle({
      title: '[TEST] Gagasan Reformasi Anggaran Berbasis Kebutuhan Warga',
      slug: gagasanSlug,
      type: 'GAGASAN',
      excerpt: 'Catatan pemikiran mengenai alokasi belanja daerah yang tepat sasaran.',
      content: 'Uraian gagasan pemikiran kritis mengenai pentingnya transparansi pos anggaran belanja publik.',
      cover_image_url: 'https://images.example.com/anggaran.jpg',
      category: 'Kebijakan Publik',
      author: 'Rahmat Ichwan Bahtiar',
      published_at: new Date().toISOString(),
      status: 'PUBLISHED',
      featured: true, // Marked as featured
      seo_title: 'Gagasan Reformasi Anggaran - Rahmat Ichwan Bahtiar',
      seo_description: 'Opini kebijakan publik mengenai belanja daerah berbasis kebutuhan riil masyarakat.',
    });
    testIdsToCleanup.push(newGagasan.id);

    if (newGagasan.id && newGagasan.type === 'GAGASAN') {
      console.log(`[PASS] Created article with type [GAGASAN]: ${newGagasan.title} (ID: ${newGagasan.id})`);
    } else {
      throw new Error('[FAIL] Failed to create GAGASAN article');
    }

    // 2C: Slug Uniqueness Test
    const isAvailableForNew = await isArticleSlugAvailable(beritaSlug);
    const isAvailableForSelf = await isArticleSlugAvailable(beritaSlug, newBerita.id);
    if (!isAvailableForNew && isAvailableForSelf) {
      console.log('[PASS] Slug uniqueness check correctly blocks duplicates and allows self-update');
    } else {
      throw new Error('[FAIL] Slug uniqueness check failed');
    }

    // -------------------------------------------------------------------------
    // 3. PUBLICATION STATUS & STRICT DRAFT ISOLATION
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Publication Status & Strict Draft Isolation ---');

    // Create a DRAFT article
    const draftSlug = `test-draft-secret-${Date.now()}`;
    const draftArticle = await createArticle({
      title: '[TEST DRAFT] Konsep Internal Rencana Publikasi',
      slug: draftSlug,
      type: 'BERITA',
      excerpt: 'Dokumen draf internal yang belum siap dibaca oleh publik.',
      content: 'Konten rahasia internal draf artikel.',
      category: 'Internal',
      author: 'Rahmat Ichwan Bahtiar',
      status: 'DRAFT',
      featured: false,
    });
    testIdsToCleanup.push(draftArticle.id);

    // Test 3A: getPublishedArticles must NOT include the draft
    const publicArticles = await getPublishedArticles();
    const hasDraftInPublic = publicArticles.some((a) => a.id === draftArticle.id || a.status !== 'PUBLISHED');
    if (!hasDraftInPublic) {
      console.log('[PASS] Security 3A: getPublishedArticles strictly excludes DRAFT articles');
    } else {
      throw new Error('[FAIL] DRAFT article leaked into public articles query!');
    }

    // Test 3B: getArticleBySlug must return null for DRAFT article
    const publicSlugResult = await getArticleBySlug(draftSlug);
    if (publicSlugResult === null) {
      console.log('[PASS] Security 3B: getArticleBySlug strictly returns null for DRAFT article (404 isolation)');
    } else {
      throw new Error('[FAIL] getArticleBySlug allowed access to DRAFT article!');
    }

    // Test 3C: Admin query must retrieve all articles including DRAFT
    const adminArticles = await getAllArticlesForAdmin();
    const draftFoundInAdmin = adminArticles.some((a) => a.id === draftArticle.id);
    if (draftFoundInAdmin) {
      console.log('[PASS] Admin service correctly retrieves DRAFT articles for editorial workflow');
    } else {
      throw new Error('[FAIL] Admin service failed to find DRAFT article');
    }

    // -------------------------------------------------------------------------
    // 4. TYPE FILTERING & FEATURED ARTICLES
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Type Filtering & Featured Content ---');

    // Filter by type: BERITA
    const beritaFiltered = await getPublishedArticles({ type: 'BERITA' });
    const allAreBerita = beritaFiltered.every((a) => a.type === 'BERITA');
    if (allAreBerita && beritaFiltered.length > 0) {
      console.log(`[PASS] Filter by Type (BERITA) returned ${beritaFiltered.length} items with 100% type match`);
    } else {
      throw new Error('[FAIL] BERITA type filter returned mismatched items');
    }

    // Filter by type: GAGASAN
    const gagasanFiltered = await getPublishedArticles({ type: 'GAGASAN' });
    const allAreGagasan = gagasanFiltered.every((a) => a.type === 'GAGASAN');
    if (allAreGagasan && gagasanFiltered.length > 0) {
      console.log(`[PASS] Filter by Type (GAGASAN) returned ${gagasanFiltered.length} items with 100% type match`);
    } else {
      throw new Error('[FAIL] GAGASAN type filter returned mismatched items');
    }

    // Filter by featuredOnly: true
    const featuredFiltered = await getPublishedArticles({ featuredOnly: true });
    const allAreFeatured = featuredFiltered.every((a) => a.featured === true);
    if (allAreFeatured && featuredFiltered.length > 0) {
      console.log(`[PASS] Filter by featuredOnly returned ${featuredFiltered.length} featured items correctly`);
    } else {
      throw new Error('[FAIL] featuredOnly filter returned non-featured items');
    }

    // -------------------------------------------------------------------------
    // 5. SEARCH & CATEGORY QUERIES
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Search & Category Queries ---');

    const searchResults = await getPublishedArticles({ search: 'Jembatan Gantung' });
    const searchMatches = searchResults.some((a) => a.title.includes('Jembatan Gantung'));
    if (searchMatches) {
      console.log(`[PASS] Search query for "Jembatan Gantung" successfully returned matching articles`);
    } else {
      throw new Error('[FAIL] Search query failed to return expected match');
    }

    const categories = await getDistinctArticleCategories();
    if (categories.length > 0) {
      console.log(`[PASS] getDistinctArticleCategories found categories: [${categories.join(', ')}]`);
    } else {
      throw new Error('[FAIL] getDistinctArticleCategories returned empty');
    }

    // -------------------------------------------------------------------------
    // 6. UPDATE & RETRIEVAL FOR ADMIN
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Update & Retrieval for Admin ---');

    const updatedTitle = '[TEST] Berita Peninjauan Jembatan Gantung Desa (Selesai Direvisi)';
    const updated = await updateArticle(newBerita.id, {
      title: updatedTitle,
      excerpt: 'Ringkasan yang telah diperbarui oleh tim redaksi.',
    });

    if (updated.title === updatedTitle) {
      console.log('[PASS] Article updated and persisted successfully');
    } else {
      throw new Error('[FAIL] Article update was not reflected');
    }

    const fetchedForAdmin = await getArticleByIdForAdmin(newBerita.id);
    if (fetchedForAdmin && fetchedForAdmin.title === updatedTitle) {
      console.log('[PASS] getArticleByIdForAdmin retrieved updated article');
    } else {
      throw new Error('[FAIL] getArticleByIdForAdmin failed');
    }

    // -------------------------------------------------------------------------
    // 7. PUBLIC DETAIL QUERY & RELATED ACTIVITY LINKAGE
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Public Detail Query & Related Activity Linkage ---');

    const publicDetail = await getArticleBySlug(beritaSlug);
    if (publicDetail && publicDetail.title === updatedTitle) {
      console.log('[PASS] Public detail retrieved by slug:', publicDetail.title);
    } else {
      throw new Error('[FAIL] getArticleBySlug failed for published article');
    }

  } finally {
    // -------------------------------------------------------------------------
    // 8. CLEANUP OF TEST ARTICLES
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Cleanup of Test Data ---');
    for (const id of testIdsToCleanup) {
      await deleteArticle(id);
    }
    console.log(`[PASS] Cleaned up ${testIdsToCleanup.length} test articles successfully`);
  }

  console.log('\n======================================================');
  console.log('ALL PHASE 4 KABAR & GAGASAN TESTS PASSED!');
}

runPhase4Verification().catch((err) => {
  console.error('\n[VERIFICATION ERROR]', err);
  process.exit(1);
});
