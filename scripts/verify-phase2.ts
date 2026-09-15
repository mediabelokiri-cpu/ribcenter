/**
 * Phase 2 Functional, Security & Architecture Verification Script
 * Validates Profile CRUD, Timeline CRUD, Organization CRUD, Homepage Manager,
 * and data-driven public integration.
 */

import {
  getProfile,
  getProfileForAdmin,
  updateProfile,
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../src/services/profile';
import {
  getHomepageSections,
  updateHomepageSection,
  reorderHomepageSections,
} from '../src/services/homepage';
import * as fs from 'fs';
import * as path from 'path';

async function runPhase2Verification() {
  console.log('=== PHASE 2: FUNCTIONAL & ARCHITECTURAL VERIFICATION ===\n');

  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
      failedTests++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Profile CRUD & Singleton Behavior
  // --------------------------------------------------------------------------
  console.log('--- 1. Profile Management Verification ---');
  const initialProfile = await getProfile();
  assert(initialProfile !== null, 'Profile can be fetched successfully');

  const updatedTitle = 'Tokoh Publik Teruji (Update Test)';
  const updateRes = await updateProfile({ title: updatedTitle });
  assert(updateRes.success && updateRes.data?.title === updatedTitle, 'Profile title updated and persisted');

  const verifiedProfile = await getProfileForAdmin();
  assert(verifiedProfile.title === updatedTitle, 'Admin retrieves updated profile data');

  // --------------------------------------------------------------------------
  // TEST 2: Political Timeline CRUD & Publication Filtering
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Political Timeline CRUD Verification ---');
  // Create published
  const createPubRes = await createTimelineItem({
    title: '[TEST] Program Legislasi Terverifikasi',
    description: 'Deskripsi program uji coba linimasa terbit.',
    category: 'POLITIK',
    year_start: 2025,
    year_end: null,
    order_index: 1,
    image_url: null,
    is_published: true,
  });
  assert(createPubRes.success && Boolean(createPubRes.data?.id), 'Timeline item created successfully');

  // Create draft (unpublished)
  const createDraftRes = await createTimelineItem({
    title: '[TEST] DRAFT Rencana Kerja Internal',
    description: 'Data draft internal yang tidak boleh muncul di publik.',
    category: 'POLITIK',
    year_start: 2026,
    year_end: null,
    order_index: 2,
    image_url: null,
    is_published: false,
  });
  assert(createDraftRes.success && Boolean(createDraftRes.data?.id), 'Draft timeline item created successfully');

  // Verify public filter (draft should NOT be in public timeline)
  const publicTimeline = await getTimeline(true);
  const draftInPublic = publicTimeline.some((t) => t.id === createDraftRes.data?.id);
  assert(!draftInPublic, 'Public timeline strictly excludes unpublished/draft items');

  // Verify admin timeline (draft MUST be visible to admin)
  const adminTimeline = await getTimeline(false);
  const draftInAdmin = adminTimeline.some((t) => t.id === createDraftRes.data?.id);
  assert(draftInAdmin, 'Admin timeline retrieves all items including unpublished drafts');

  // Update item
  const updateItemRes = await updateTimelineItem(createPubRes.data!.id, {
    title: '[TEST] Program Legislasi Terverifikasi (Edited)',
  });
  assert(Boolean(updateItemRes.success && updateItemRes.data?.title.includes('(Edited)')), 'Timeline item edited and persisted');

  // Delete draft item
  const deleteRes = await deleteTimelineItem(createDraftRes.data!.id);
  assert(deleteRes.success, 'Timeline item deleted successfully');

  // --------------------------------------------------------------------------
  // TEST 3: Organization CRUD & Publication Filtering
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Organization Management Verification ---');
  const createOrgRes = await createOrganization({
    organization_name: '[TEST] Lembaga Pemberdayaan Masyarakat',
    role: 'Dewan Pembina',
    period_start: '2021',
    period_end: '2025',
    description: 'Deskripsi uji coba organisasi.',
    logo_url: null,
    order_index: 1,
    is_published: true,
  });
  assert(createOrgRes.success && Boolean(createOrgRes.data?.id), 'Organization entry created successfully');

  const createOrgDraftRes = await createOrganization({
    organization_name: '[TEST] Organisasi DRAFT Belum Tayang',
    role: 'Anggota',
    period_start: '2026',
    period_end: null,
    description: 'Data draft.',
    logo_url: null,
    order_index: 2,
    is_published: false,
  });

  const publicOrgs = await getOrganizations(true);
  const draftOrgInPublic = publicOrgs.some((o) => o.id === createOrgDraftRes.data?.id);
  assert(!draftOrgInPublic, 'Public organizations strictly excludes unpublished/draft items');

  const adminOrgs = await getOrganizations(false);
  const draftOrgInAdmin = adminOrgs.some((o) => o.id === createOrgDraftRes.data?.id);
  assert(draftOrgInAdmin, 'Admin organizations retrieves all items including unpublished drafts');

  const updateOrgRes = await updateOrganization(createOrgRes.data!.id, {
    role: 'Ketua Dewan Pembina',
  });
  assert(updateOrgRes.success && updateOrgRes.data?.role === 'Ketua Dewan Pembina', 'Organization entry updated successfully');

  const deleteOrgRes = await deleteOrganization(createOrgDraftRes.data!.id);
  assert(deleteOrgRes.success, 'Organization entry deleted successfully');

  // --------------------------------------------------------------------------
  // TEST 4: Homepage Manager & Section Reordering
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Homepage Manager Verification ---');
  const sections = await getHomepageSections(false);
  assert(sections.length >= 6, 'All 6 core homepage sections are configured in database');

  // Toggle active status
  const heroSection = sections.find((s) => s.section_key === 'hero');
  assert(Boolean(heroSection), 'Hero section exists in homepage manager');

  const updateSectionRes = await updateHomepageSection(heroSection!.id, {
    content: {
      ...((heroSection!.content as Record<string, unknown>) || {}),
      headline: '[TEST] Headline Beranda Baru Terverifikasi',
    },
  });
  assert(updateSectionRes.success, 'Hero section headline updated via homepage manager');

  // Reorder test
  const reversedIds = sections.map((s) => s.id).reverse();
  const reorderRes = await reorderHomepageSections(reversedIds);
  assert(reorderRes.success, 'Homepage sections reordered successfully');

  // Restore original order
  await reorderHomepageSections(sections.map((s) => s.id));

  // --------------------------------------------------------------------------
  // TEST 5: Public Data-Driven Code Inspection
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Public Pages Dynamic Data Inspection ---');
  const homePageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
  assert(
    homePageCode.includes('getHomepageSections(true)') &&
    homePageCode.includes('getProfile()') &&
    homePageCode.includes('profile?.biography') &&
    homePageCode.includes('content.headline'),
    'Public Homepage is fully data-driven from database sections and profile'
  );

  const tentangPageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/tentang/page.tsx'), 'utf8');
  assert(
    tentangPageCode.includes('getProfile()') &&
    tentangPageCode.includes('getTimeline(true)') &&
    tentangPageCode.includes('getOrganizations(true)'),
    'Public About page is fully data-driven from database profile, timeline, and organizations'
  );

  // --------------------------------------------------------------------------
  // TEST 6: Security & Admin Guards Inspection
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Security & Server Guards Inspection ---');
  const profileActionsCode = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/(authenticated)/profil/actions.ts'), 'utf8');
  assert(profileActionsCode.includes('requireAdmin()'), 'Admin profile actions protected with requireAdmin()');

  const timelineActionsCode = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/(authenticated)/profil/perjalanan/actions.ts'), 'utf8');
  assert(timelineActionsCode.includes('requireAdmin()'), 'Admin timeline actions protected with requireAdmin()');

  const orgActionsCode = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/(authenticated)/profil/organisasi/actions.ts'), 'utf8');
  assert(orgActionsCode.includes('requireAdmin()'), 'Admin organization actions protected with requireAdmin()');

  const homepageActionsCode = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/(authenticated)/homepage/actions.ts'), 'utf8');
  assert(homepageActionsCode.includes('requireAdmin()'), 'Admin homepage actions protected with requireAdmin()');

  console.log('\n======================================================');
  if (failedTests === 0) {
    console.log('ALL PHASE 2 FUNCTIONAL & ARCHITECTURAL TESTS PASSED!');
    process.exit(0);
  } else {
    console.error(`FAILED: ${failedTests} test(s) failed.`);
    process.exit(1);
  }
}

runPhase2Verification().catch((err) => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
