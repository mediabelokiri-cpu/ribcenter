/**
 * Phase 3 Automated Verification Script
 * Validates Rekam Kerja (Activities) Engine, Categories CRUD, Publication Isolation,
 * Multi-dimensional Filtering, Homepage Integration, and Admin Security Guards.
 */

import {
  getActivityCategories,
  createActivityCategory,
  updateActivityCategory,
  deleteActivityCategory,
  getPublishedActivities,
  getActivityBySlug,
  getAllActivitiesForAdmin,
  getActivityByIdForAdmin,
  createActivity,
  updateActivity,
  deleteActivity,
  getDistinctRegencies,
  getDistinctYears,
} from '../src/services/activities';
import { slugify, isValidSlug } from '../src/lib/slug';
import type { ActivityType } from '../src/types/database';

async function runPhase3Verification() {
  console.log('=== PHASE 3: REKAM KERJA ENGINE & CATEGORIES VERIFICATION ===\n');

  // -------------------------------------------------------------------------
  // 1. SLUG UTILITY VERIFICATION
  // -------------------------------------------------------------------------
  console.log('--- 1. Slug Generator & Validation Tests ---');
  const sampleTitle = 'Penyaluran Bantuan Bibit Kakao & Pupuk Organik 2026!';
  const generatedSlug = slugify(sampleTitle);
  if (generatedSlug === 'penyaluran-bantuan-bibit-kakao-pupuk-organik-2026') {
    console.log('[PASS] Slugify generates clean, URL-safe slug:', generatedSlug);
  } else {
    throw new Error(`[FAIL] Slugify output unexpected: ${generatedSlug}`);
  }

  if (isValidSlug(generatedSlug) && !isValidSlug('invalid/slug with spaces')) {
    console.log('[PASS] isValidSlug correctly validates valid and invalid slugs');
  } else {
    throw new Error('[FAIL] isValidSlug validation failed');
  }

  // -------------------------------------------------------------------------
  // 2. ACTIVITY CATEGORIES CRUD VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Activity Categories Management Verification ---');
  const initialCategories = await getActivityCategories();
  console.log(`[INFO] Initial categories count: ${initialCategories.length}`);

  // Create Category
  const newCat = await createActivityCategory({
    name: 'Kesehatan & Gizi Masyarakat',
    slug: 'kesehatan-gizi-masyarakat',
    description: 'Program advokasi fasilitas posyandu dan pencegahan stunting.',
    order_index: 99,
    is_active: true,
  });
  console.log('[PASS] Created new activity category:', newCat.name, `(ID: ${newCat.id})`);

  // Update Category
  const updatedCat = await updateActivityCategory(newCat.id, {
    name: 'Kesehatan, Sanitasi & Gizi',
  });
  if (updatedCat.name === 'Kesehatan, Sanitasi & Gizi') {
    console.log('[PASS] Activity category updated successfully');
  } else {
    throw new Error('[FAIL] Category update failed');
  }

  // Verify list reflects new category
  const categoriesAfterAdd = await getActivityCategories();
  const foundCat = categoriesAfterAdd.find((c) => c.id === newCat.id);
  if (!foundCat) {
    throw new Error('[FAIL] Newly created category not found in list');
  }
  console.log('[PASS] Activity category retrieved in category list');

  // -------------------------------------------------------------------------
  // 3. REKAM KERJA CRUD & 4 ACTIVITY TYPES VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Rekam Kerja CRUD & 4 Activity Types Verification ---');
  const requiredTypes: ActivityType[] = ['REKAM_KERJA', 'PROGRAM', 'KEGIATAN', 'RESES'];
  console.log('[INFO] Verifying unified support for types:', requiredTypes.join(', '));

  // Create an activity for each of the 4 types
  const createdActivities = [];
  for (const actType of requiredTypes) {
    const act = await createActivity({
      title: `[TEST] Pelaksanaan ${actType} di Wilayah Uji`,
      slug: slugify(`test-pelaksanaan-${actType}-wilayah-uji`),
      type: actType,
      category_id: newCat.id,
      date: '2026-03-10',
      location: 'Gedung Pertemuan Warga',
      regency: 'Polewali Mandar',
      district: 'Wonomulyo',
      summary: `Ringkasan uji coba ${actType}`,
      description: `Deskripsi lengkap pelaksanaan ${actType} untuk pengujian menyeluruh sistem Fase 3.`,
      beneficiaries: 150,
      status: 'PUBLISHED',
      featured: actType === 'PROGRAM', // Mark PROGRAM as featured
      cover_image_url: 'https://example.com/test-cover.jpg',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
    createdActivities.push(act);
    console.log(`[PASS] Activity created with type [${act.type}]: ${act.title}`);
  }

  // Verify Retrieval by ID
  const testAct = createdActivities[0];
  const fetchedAct = await getActivityByIdForAdmin(testAct.id);
  if (fetchedAct && fetchedAct.title === testAct.title) {
    console.log('[PASS] Activity retrieved by ID for admin successfully');
  } else {
    throw new Error('[FAIL] getActivityByIdForAdmin failed');
  }

  // Verify Retrieval by Slug
  const fetchedBySlug = await getActivityBySlug(testAct.slug);
  if (fetchedBySlug && fetchedBySlug.id === testAct.id && fetchedBySlug.category?.id === newCat.id) {
    console.log('[PASS] Activity retrieved by Slug with category relation:', fetchedBySlug.title);
  } else {
    throw new Error('[FAIL] getActivityBySlug failed or category not resolved');
  }

  // Update Activity
  const updatedAct = await updateActivity(testAct.id, {
    title: '[TEST UPDATED] Pelaksanaan Kerja Nyata Terpadu',
    beneficiaries: 300,
  });
  if (updatedAct.title.includes('UPDATED') && updatedAct.beneficiaries === 300) {
    console.log('[PASS] Activity updated and persisted');
  } else {
    throw new Error('[FAIL] Activity update failed');
  }

  // -------------------------------------------------------------------------
  // 4. PUBLICATION & DRAFT ISOLATION VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Publication & Draft Isolation Verification ---');
  const draftActivity = await createActivity({
    title: '[TEST DRAFT] Perencanaan Reses Rahasia Internal',
    slug: 'test-draft-perencanaan-reses-internal',
    type: 'RESES',
    category_id: newCat.id,
    date: '2026-04-01',
    description: 'Catatan internal yang belum siap tayang ke publik.',
    status: 'DRAFT',
    featured: true, // Marked featured but is DRAFT!
  });
  console.log('[PASS] Created DRAFT activity (ID:', draftActivity.id, ')');

  // Check 4A: Public query must strictly exclude DRAFT
  const publicActs = await getPublishedActivities();
  const draftInPublic = publicActs.find((a) => a.id === draftActivity.id);
  if (draftInPublic) {
    throw new Error('[FAIL] CRITICAL SECURITY: Draft activity leaked into public getPublishedActivities!');
  }
  console.log('[PASS] Security 4A: getPublishedActivities strictly isolates DRAFT activities');

  // Check 4B: Public slug query must return null for DRAFT
  const draftBySlug = await getActivityBySlug(draftActivity.slug);
  if (draftBySlug !== null) {
    throw new Error('[FAIL] CRITICAL SECURITY: Draft activity accessible via public getActivityBySlug!');
  }
  console.log('[PASS] Security 4B: getActivityBySlug strictly returns null for DRAFT activities');

  // Check 4C: Admin query can retrieve DRAFT
  const adminActs = await getAllActivitiesForAdmin();
  const draftInAdmin = adminActs.find((a) => a.id === draftActivity.id);
  if (!draftInAdmin) {
    throw new Error('[FAIL] Admin query failed to retrieve DRAFT activity');
  }
  console.log('[PASS] Admin service correctly retrieves DRAFT activities for editorial control');

  // -------------------------------------------------------------------------
  // 5. MULTI-DIMENSIONAL FILTERING VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Multi-dimensional Filtering Verification ---');

  // Filter by Type
  const programOnly = await getPublishedActivities({ type: 'PROGRAM' });
  const nonPrograms = programOnly.filter((a) => a.type !== 'PROGRAM');
  if (nonPrograms.length > 0) {
    throw new Error('[FAIL] Type filter failed: returned non-PROGRAM activities');
  }
  console.log(`[PASS] Filter by Type (PROGRAM) returned ${programOnly.length} items with 100% type match`);

  // Filter by Category Slug
  const catFiltered = await getPublishedActivities({ categorySlug: newCat.slug });
  if (catFiltered.length === 0 || catFiltered.some((a) => a.category_id !== newCat.id)) {
    throw new Error('[FAIL] Category filter failed');
  }
  console.log(`[PASS] Filter by Category Slug (${newCat.slug}) returned ${catFiltered.length} items correctly`);

  // Filter by Regency
  const regencyFiltered = await getPublishedActivities({ regency: 'Polewali Mandar' });
  if (regencyFiltered.length === 0 || regencyFiltered.some((a) => a.regency !== 'Polewali Mandar')) {
    throw new Error('[FAIL] Regency filter failed');
  }
  console.log(`[PASS] Filter by Regency (Polewali Mandar) returned ${regencyFiltered.length} items correctly`);

  // Filter by Year
  const yearFiltered = await getPublishedActivities({ year: 2026 });
  if (yearFiltered.length === 0 || yearFiltered.some((a) => !a.date.startsWith('2026'))) {
    throw new Error('[FAIL] Year filter failed');
  }
  console.log(`[PASS] Filter by Year (2026) returned ${yearFiltered.length} items correctly`);

  // Combined Filters
  const combined = await getPublishedActivities({
    type: 'PROGRAM',
    regency: 'Polewali Mandar',
    year: 2026,
  });
  if (combined.some((a) => a.type !== 'PROGRAM' || a.regency !== 'Polewali Mandar' || !a.date.startsWith('2026'))) {
    throw new Error('[FAIL] Combined filter failed');
  }
  console.log(`[PASS] Combined Filter (Type + Regency + Year) returned ${combined.length} matching items`);

  // Distinct Regencies and Years
  const regencies = await getDistinctRegencies();
  const years = await getDistinctYears();
  if (regencies.length > 0 && years.length > 0) {
    console.log(`[PASS] getDistinctRegencies found: [${regencies.join(', ')}]`);
    console.log(`[PASS] getDistinctYears found: [${years.join(', ')}]`);
  } else {
    throw new Error('[FAIL] getDistinctRegencies or getDistinctYears returned empty array');
  }

  // -------------------------------------------------------------------------
  // 6. FEATURED & HOMEPAGE INTEGRATION VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Featured Activities & Homepage Data Flow Verification ---');
  const featuredOnly = await getPublishedActivities({ featuredOnly: true });
  if (featuredOnly.some((a) => !a.featured || a.status !== 'PUBLISHED')) {
    throw new Error('[FAIL] Featured query returned non-featured or non-published activities');
  }
  console.log(`[PASS] getPublishedActivities({ featuredOnly: true }) returned ${featuredOnly.length} published featured items`);

  // -------------------------------------------------------------------------
  // 7. CLEANUP & DELETION VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Cleanup & Deletion Verification ---');
  // Delete test activities
  for (const act of createdActivities) {
    const deleted = await deleteActivity(act.id);
    if (!deleted) throw new Error(`[FAIL] Could not delete activity ${act.id}`);
  }
  await deleteActivity(draftActivity.id);
  console.log('[PASS] Test activities deleted successfully');

  // Delete test category
  const catDeleted = await deleteActivityCategory(newCat.id);
  if (!catDeleted) throw new Error('[FAIL] Could not delete test category');
  console.log('[PASS] Test category deleted successfully');

  console.log('\n======================================================');
  console.log('ALL PHASE 3 REKAM KERJA & CATEGORIES TESTS PASSED!');
}

runPhase3Verification().catch((err) => {
  console.error('\n[VERIFICATION FAILED]:', err);
  process.exit(1);
});
