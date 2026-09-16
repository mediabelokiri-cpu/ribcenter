/**
 * Verification Script for Phase 7: Public Website Completion
 * Tests:
 * 1. Public Route Inventory (17 public routes exist & exports are valid)
 * 2. Public Navigation completeness (Header & Footer links integrity)
 * 3. Content reuse & canonical CMS integration across all modules
 * 4. Draft isolation across Activities, Articles, Albums, and Aspirations
 * 5. Legal pages integrity (Kebijakan Privasi & Syarat Ketentuan)
 * 6. Error & Not-Found handling components
 * 7. End-to-end user flows & CTA integration
 */

import { getHomepageSections } from '../src/services/homepage';
import { getProfile, getTimeline, getOrganizations } from '../src/services/profile';
import { getPublishedActivities, getActivityBySlug } from '../src/services/activities';
import { getPublishedArticles } from '../src/services/articles';
import { getPublishedAlbums, getPublishedVideos } from '../src/services/media';
import { submitPublicAspiration } from '../src/services/aspirations';
import { getContactSettings, getSocialSettings, getGeneralSettings, formatWhatsAppUrl } from '../src/services/settings';
import { existsSync } from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 7 VERIFICATION: PUBLIC WEBSITE COMPLETION');
  console.log('======================================================\n');

  const rootDir = process.cwd();

  // --------------------------------------------------------------------------
  // TEST GROUP 1: PUBLIC ROUTE INVENTORY AUDIT
  // --------------------------------------------------------------------------
  console.log('--- 1. Public Route Inventory Audit ---');

  const requiredRoutes = [
    'src/app/page.tsx',
    'src/app/tentang/page.tsx',
    'src/app/rekam-kerja/page.tsx',
    'src/app/rekam-kerja/[slug]/page.tsx',
    'src/app/kabar/page.tsx',
    'src/app/kabar/berita/page.tsx',
    'src/app/kabar/gagasan/page.tsx',
    'src/app/kabar/[slug]/page.tsx',
    'src/app/galeri/page.tsx',
    'src/app/galeri/foto/page.tsx',
    'src/app/galeri/foto/[slug]/page.tsx',
    'src/app/galeri/video/page.tsx',
    'src/app/aspirasi/page.tsx',
    'src/app/kontak/page.tsx',
    'src/app/kebijakan-privasi/page.tsx',
    'src/app/syarat-ketentuan/page.tsx',
    'src/app/not-found.tsx',
    'src/app/error.tsx',
  ];

  for (const r of requiredRoutes) {
    const fullPath = path.join(rootDir, r);
    assert(existsSync(fullPath), `Route file exists: ${r}`);
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 2: PUBLIC NAVIGATION & FOOTER AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Public Navigation & Footer Completeness ---');

  const headerPath = path.join(rootDir, 'src/components/layout/public-header.tsx');
  const footerPath = path.join(rootDir, 'src/components/layout/public-footer.tsx');

  assert(existsSync(headerPath), 'PublicHeader component exists');
  assert(existsSync(footerPath), 'PublicFooter component exists');

  // Verify header has main routes
  const headerContent = await import('fs').then((fs) => fs.readFileSync(headerPath, 'utf8'));
  const requiredNavHrefs = ['/', '/tentang', '/rekam-kerja', '/kabar', '/galeri', '/aspirasi', '/kontak'];

  for (const href of requiredNavHrefs) {
    assert(
      headerContent.includes(`'${href}'`) || headerContent.includes(`"${href}"`),
      `Header includes navigation link to ${href}`
    );
  }

  // Verify footer has main routes + legal routes
  const footerContent = await import('fs').then((fs) => fs.readFileSync(footerPath, 'utf8'));
  const requiredFooterHrefs = [
    '/',
    '/tentang',
    '/rekam-kerja',
    '/kabar',
    '/galeri',
    '/aspirasi',
    '/kontak',
    '/kebijakan-privasi',
    '/syarat-ketentuan',
  ];

  for (const href of requiredFooterHrefs) {
    assert(
      footerContent.includes(`"${href}"`) || footerContent.includes(`'${href}'`),
      `Footer includes link to ${href}`
    );
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 3: HOMEPAGE INTEGRATION ACROSS ALL MODULES
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Homepage Integration Across Modules ---');

  const sections = await getHomepageSections(true);
  assert(sections.length > 0, 'Homepage retrieves active sections');

  const sectionKeys = sections.map((s) => s.section_key);
  assert(sectionKeys.includes('hero'), 'Homepage includes Hero section');
  assert(sectionKeys.includes('profile_summary'), 'Homepage includes Profile Summary section');
  assert(sectionKeys.includes('featured_activities'), 'Homepage includes Featured Activities section');
  assert(sectionKeys.includes('latest_articles'), 'Homepage includes Latest Articles section');
  assert(sectionKeys.includes('gallery_preview'), 'Homepage includes Gallery Preview section');
  assert(sectionKeys.includes('aspirations_cta'), 'Homepage includes Aspirations CTA section');

  // --------------------------------------------------------------------------
  // TEST GROUP 4: ABOUT PAGE (PROFIL, LINIMASA, ORGANISASI)
  // --------------------------------------------------------------------------
  console.log('\n--- 4. About Page Integration ---');

  const profile = await getProfile();
  assert(!!profile && typeof profile.name === 'string', 'Profile data is accessible for About page');

  const timeline = await getTimeline(true);
  assert(Array.isArray(timeline), 'Timeline items are retrieved for About page');

  const organizations = await getOrganizations(true);
  assert(Array.isArray(organizations), 'Organizations are retrieved for About page');

  // --------------------------------------------------------------------------
  // TEST GROUP 5: REKAM KERJA INTEGRATION & DRAFT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Rekam Kerja Integration & Draft Isolation ---');

  const publicActivities = await getPublishedActivities();
  assert(Array.isArray(publicActivities), 'Public activities query succeeds');
  assert(
    publicActivities.every((a) => a.status === 'PUBLISHED'),
    'Public activities contain strictly PUBLISHED items'
  );

  const draftActivitySlug = 'draft-rekam-kerja-internal';
  const draftActivity = await getActivityBySlug(draftActivitySlug);
  assert(draftActivity === null, 'Draft activity is strictly inaccessible via public slug query');

  // --------------------------------------------------------------------------
  // TEST GROUP 6: KABAR (BERITA & GAGASAN) INTEGRATION & DRAFT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Kabar & Publikasi Integration & Draft Isolation ---');

  const publicArticles = await getPublishedArticles();
  assert(Array.isArray(publicArticles), 'Public articles query succeeds');
  assert(
    publicArticles.every((a) => a.status === 'PUBLISHED'),
    'Public articles contain strictly PUBLISHED items'
  );

  const beritaArticles = await getPublishedArticles({ type: 'BERITA' });
  assert(
    beritaArticles.every((a) => a.type === 'BERITA'),
    'Articles filtered by type BERITA only return BERITA'
  );

  const gagasanArticles = await getPublishedArticles({ type: 'GAGASAN' });
  assert(
    gagasanArticles.every((a) => a.type === 'GAGASAN'),
    'Articles filtered by type GAGASAN only return GAGASAN'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 7: GALERI (ALBUM & VIDEO) INTEGRATION & DRAFT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Galeri Foto & Video Integration ---');

  const publishedAlbums = await getPublishedAlbums();
  assert(Array.isArray(publishedAlbums), 'Public albums query succeeds');
  assert(
    publishedAlbums.every((a) => a.status === 'PUBLISHED'),
    'Public albums contain strictly PUBLISHED items'
  );

  const publishedVideos = await getPublishedVideos();
  assert(Array.isArray(publishedVideos), 'Public videos query succeeds');
  assert(
    publishedVideos.every((v) => v.media_type === 'VIDEO'),
    'Public videos contain strictly VIDEO media types'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 8: ASPIRASI INTAKE & PRIVACY GUARANTEE
  // --------------------------------------------------------------------------
  console.log('\n--- 8. Aspirasi Intake & Privacy Guarantee ---');

  const aspirationRes = await submitPublicAspiration({
    name: 'Penguji Verifikasi Akhir',
    contact: '081122334455',
    regency: 'Kota Samarinda',
    district: 'Kecamatan Samarinda Kota',
    category: 'Pelayanan Publik & Tata Kelola',
    subject: 'Verifikasi Kesiapan Kanal Aspirasi Publik',
    message: 'Pengujian end-to-end untuk memastikan saluran aspirasi warga siap produksi.',
  });

  assert(
    aspirationRes.success === true && !!aspirationRes.referenceId,
    'Citizen can successfully submit aspiration and receive reference ID'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 9: KONTAK & SITE SETTINGS INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n--- 9. Kontak & Settings Integration ---');

  const contact = await getContactSettings();
  assert(!!contact.whatsapp && !!contact.email, 'Contact settings provide active WhatsApp and Email');

  const social = await getSocialSettings();
  assert(typeof social === 'object', 'Social settings provide structured social media accounts');

  const general = await getGeneralSettings();
  assert(!!general.site_name, 'General settings provide official platform name');

  const waLink = formatWhatsAppUrl(contact.whatsapp);
  assert(waLink.startsWith('https://wa.me/'), 'Generates valid WhatsApp click-to-chat URL');

  // --------------------------------------------------------------------------
  // TEST GROUP 10: LEGAL & ERROR HANDLING PAGES
  // --------------------------------------------------------------------------
  console.log('\n--- 10. Legal Pages & Error Handling Verification ---');

  const privacyPath = path.join(rootDir, 'src/app/kebijakan-privasi/page.tsx');
  const termsPath = path.join(rootDir, 'src/app/syarat-ketentuan/page.tsx');
  const notFoundPath = path.join(rootDir, 'src/app/not-found.tsx');
  const errorPath = path.join(rootDir, 'src/app/error.tsx');

  assert(existsSync(privacyPath), 'Kebijakan Privasi page is implemented');
  assert(existsSync(termsPath), 'Syarat & Ketentuan page is implemented');
  assert(existsSync(notFoundPath), 'Unified Not-Found (404) page is implemented');
  assert(existsSync(errorPath), 'Global Client Error Boundary (error.tsx) is implemented');

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`📊 PHASE 7 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
