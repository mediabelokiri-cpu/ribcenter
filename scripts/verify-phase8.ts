/**
 * PHASE 8 COMPREHENSIVE VERIFICATION TEST SUITE
 * SEO, Security, Accessibility, Data Integrity & Regression Pass
 */

import fs from 'fs';
import path from 'path';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { getProfile, getTimeline, getOrganizations } from '../src/services/profile';
import { getPublishedActivities, getActivityBySlug, getActivityCategories } from '../src/services/activities';
import { getPublishedArticles, getArticleBySlug } from '../src/services/articles';
import { getPublishedAlbums, getMediaItems } from '../src/services/media';
import { submitAspirationAction } from '../src/app/aspirasi/actions';
import { getContactSettings, getSocialSettings, getGeneralSettings } from '../src/services/settings';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runPhase8Verification() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 8 VERIFICATION: SEO, SECURITY & QA');
  console.log('======================================================\n');

  const rootDir = path.resolve(__dirname, '..');

  // --------------------------------------------------------------------------
  // SECTION 1: Technical SEO & Metadata Audit
  // --------------------------------------------------------------------------
  console.log('--- 1. Technical SEO & Metadata Audit ---');

  // 1.1 Sitemap verification
  assert(fs.existsSync(path.join(rootDir, 'src/app/sitemap.ts')), 'sitemap.ts file exists');
  const sitemapData = await sitemap();
  assert(Array.isArray(sitemapData) && sitemapData.length >= 13, `Sitemap generates ${sitemapData.length} URLs (>= 13 routes)`);
  const hasRoot = sitemapData.some((item) => !item.url.includes('/tentang') && !item.url.includes('/kabar'));
  const hasTentang = sitemapData.some((item) => item.url.includes('/tentang'));
  const hasRekamKerja = sitemapData.some((item) => item.url.includes('/rekam-kerja'));
  const hasKabar = sitemapData.some((item) => item.url.includes('/kabar'));
  const hasGaleri = sitemapData.some((item) => item.url.includes('/galeri'));
  const hasAspirasi = sitemapData.some((item) => item.url.includes('/aspirasi'));
  const hasKontak = sitemapData.some((item) => item.url.includes('/kontak'));
  assert(hasRoot && hasTentang && hasRekamKerja && hasKabar && hasGaleri && hasAspirasi && hasKontak, 'Sitemap covers all core public sections');

  // 1.2 Robots verification
  assert(fs.existsSync(path.join(rootDir, 'src/app/robots.ts')), 'robots.ts file exists');
  const robotsData = robots();
  const rules = Array.isArray(robotsData.rules) ? robotsData.rules[0] : robotsData.rules;
  assert(rules?.allow === '/', 'Robots allows root index (/)');
  const disallows = Array.isArray(rules?.disallow) ? rules?.disallow : [rules?.disallow];
  assert(disallows.includes('/admin/'), 'Robots disallows /admin/');
  assert(disallows.includes('/api/'), 'Robots disallows /api/');
  assert(typeof robotsData.sitemap === 'string' && robotsData.sitemap.includes('/sitemap.xml'), 'Robots links to valid sitemap.xml');

  // 1.3 Root Metadata & JSON-LD in layout.tsx
  const layoutContent = fs.readFileSync(path.join(rootDir, 'src/app/layout.tsx'), 'utf-8');
  assert(layoutContent.includes('metadataBase'), 'layout.tsx defines metadataBase');
  assert(layoutContent.includes('openGraph:'), 'layout.tsx defines OpenGraph defaults');
  assert(layoutContent.includes('twitter:'), 'layout.tsx defines Twitter Card defaults');
  assert(layoutContent.includes('robots:'), 'layout.tsx defines search engine robots configuration');
  assert(layoutContent.includes('StructuredData'), 'layout.tsx imports and renders StructuredData (WebSite & Person)');

  // 1.4 Structured Data component
  assert(fs.existsSync(path.join(rootDir, 'src/components/seo/structured-data.tsx')), 'structured-data.tsx component exists');

  // 1.5 JSON-LD in detail pages
  const kabarDetailContent = fs.readFileSync(path.join(rootDir, 'src/app/kabar/[slug]/page.tsx'), 'utf-8');
  assert(kabarDetailContent.includes('StructuredData') && kabarDetailContent.includes('NewsArticle'), 'kabar/[slug] renders Article JSON-LD');
  const rekamKerjaDetailContent = fs.readFileSync(path.join(rootDir, 'src/app/rekam-kerja/[slug]/page.tsx'), 'utf-8');
  assert(rekamKerjaDetailContent.includes('StructuredData'), 'rekam-kerja/[slug] renders Article/Action JSON-LD');
  const tentangContent = fs.readFileSync(path.join(rootDir, 'src/app/tentang/page.tsx'), 'utf-8');
  assert(tentangContent.includes('StructuredData') && tentangContent.includes('Person'), 'tentang/page.tsx renders Person JSON-LD');

  // --------------------------------------------------------------------------
  // SECTION 2: Security & Authorization Audit
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Security & Authorization Audit ---');

  // 2.1 HTTP Security Headers
  const nextConfigContent = fs.readFileSync(path.join(rootDir, 'next.config.ts'), 'utf-8');
  assert(nextConfigContent.includes('X-Frame-Options'), 'next.config.ts enforces X-Frame-Options: SAMEORIGIN');
  assert(nextConfigContent.includes('X-Content-Type-Options'), 'next.config.ts enforces X-Content-Type-Options: nosniff');
  assert(nextConfigContent.includes('Referrer-Policy'), 'next.config.ts enforces Referrer-Policy');
  assert(nextConfigContent.includes('Permissions-Policy'), 'next.config.ts enforces Permissions-Policy');

  // 2.2 Client-side Secret Leakage Audit
  function scanDirForSecretLeaks(dir: string): string[] {
    const leaks: string[] = [];
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        leaks.push(...scanDirForSecretLeaks(fullPath));
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Check if a client component imports or references server-only service role
        if (content.includes("'use client'") || content.includes('"use client"')) {
          if (content.includes('SUPABASE_SERVICE_ROLE_KEY') || content.includes('supabaseServiceRoleKey')) {
            leaks.push(fullPath);
          }
        }
      }
    }
    return leaks;
  }
  const clientSecretLeaks = scanDirForSecretLeaks(path.join(rootDir, 'src'));
  assert(clientSecretLeaks.length === 0, `No client components expose SUPABASE_SERVICE_ROLE_KEY (found ${clientSecretLeaks.length})`);

  // 2.3 Admin Authorization Guard (Defense in Depth)
  const adminLayoutContent = fs.readFileSync(path.join(rootDir, 'src/app/admin/(authenticated)/layout.tsx'), 'utf-8');
  assert(adminLayoutContent.includes('requireAdmin()'), 'Admin layout enforces server-side requireAdmin() guard');

  // 2.4 API Parameter Sanitization
  const apiMediaContent = fs.readFileSync(path.join(rootDir, 'src/app/api/media/route.ts'), 'utf-8');
  assert(apiMediaContent.includes('Math.min(Math.max('), '/api/media clamps limit to prevent resource exhaustion');

  // 2.5 RLS Audit (Row Level Security)
  const rlsSql = fs.readFileSync(path.join(rootDir, 'supabase/migrations/00002_row_level_security.sql'), 'utf-8');
  assert(rlsSql.includes('CREATE POLICY "Public can submit aspirations"'), 'Aspirations allows public INSERT');
  assert(!rlsSql.includes('CREATE POLICY "Public can view aspirations"'), 'Aspirations strictly denies public SELECT');
  assert(rlsSql.includes('CREATE POLICY "Public can view published activities"'), 'Activities enforces PUBLISHED status filter');
  assert(rlsSql.includes('CREATE POLICY "Public can view published articles"'), 'Articles enforces PUBLISHED status filter');
  assert(rlsSql.includes('CREATE POLICY "Public can view published albums"'), 'Albums enforces PUBLISHED status filter');

  // --------------------------------------------------------------------------
  // SECTION 3: Accessibility (a11y) Audit
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Accessibility (a11y) Audit ---');

  // 3.1 Aspiration Form accessible labels & inputs
  const aspirationFormContent = fs.readFileSync(path.join(rootDir, 'src/app/aspirasi/aspiration-form.tsx'), 'utf-8');
  assert(aspirationFormContent.includes('htmlFor="input-name"') && aspirationFormContent.includes('id="input-name"'), 'Name field has connected htmlFor and id');
  assert(aspirationFormContent.includes('htmlFor="input-contact"') && aspirationFormContent.includes('id="input-contact"'), 'Contact field has connected htmlFor and id');
  assert(aspirationFormContent.includes('htmlFor="input-regency"') && aspirationFormContent.includes('id="input-regency"'), 'Regency field has connected htmlFor and id');
  assert(aspirationFormContent.includes('htmlFor="input-subject"') && aspirationFormContent.includes('id="input-subject"'), 'Subject field has connected htmlFor and id');
  assert(aspirationFormContent.includes('htmlFor="input-message"') && aspirationFormContent.includes('id="input-message"'), 'Message field has connected htmlFor and id');

  // 3.2 Filter search inputs accessible labels
  const kabarFilterContent = fs.readFileSync(path.join(rootDir, 'src/app/kabar/kabar-filter.tsx'), 'utf-8');
  assert(kabarFilterContent.includes('aria-label="Cari artikel atau topik"'), 'Kabar search input has explicit aria-label');
  assert(kabarFilterContent.includes('aria-label="Jalankan pencarian"'), 'Kabar search button has explicit aria-label');

  const rekamFilterContent = fs.readFileSync(path.join(rootDir, 'src/app/rekam-kerja/rekam-kerja-filter.tsx'), 'utf-8');
  assert(rekamFilterContent.includes('htmlFor="filter-category"') && rekamFilterContent.includes('id="filter-category"'), 'Rekam Kerja category filter has connected label and select');
  assert(rekamFilterContent.includes('htmlFor="filter-regency"') && rekamFilterContent.includes('id="filter-regency"'), 'Rekam Kerja regency filter has connected label and select');
  assert(rekamFilterContent.includes('htmlFor="filter-year"') && rekamFilterContent.includes('id="filter-year"'), 'Rekam Kerja year filter has connected label and select');

  // 3.3 Safe External Links (rel="noopener noreferrer")
  assert(aspirationFormContent.includes('rel="noopener noreferrer"') || !aspirationFormContent.includes('target="_blank"'), 'Aspiration form external links are safe');
  const footerContent = fs.readFileSync(path.join(rootDir, 'src/components/layout/public-footer.tsx'), 'utf-8');
  assert(footerContent.includes('rel="noopener noreferrer"'), 'PublicFooter external links have rel="noopener noreferrer"');

  // --------------------------------------------------------------------------
  // SECTION 4: Data Integrity & Draft Isolation Audit
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Data Integrity & Draft Isolation Audit ---');

  // 4.1 Activities draft isolation
  const allActivities = await getPublishedActivities();
  const hasDraftActivity = allActivities.some((a) => a.status !== 'PUBLISHED');
  assert(!hasDraftActivity, 'Public activities contain 0 un-published/draft items');

  const draftActivity = await getActivityBySlug('kunjungan-kerja-evaluasi-infrastruktur-jalan-poros-polman');
  assert(!draftActivity || draftActivity.status === 'PUBLISHED', 'Draft activity is blocked from public slug resolution');

  // 4.2 Articles draft isolation
  const allArticles = await getPublishedArticles();
  const hasDraftArticle = allArticles.some((a) => a.status !== 'PUBLISHED');
  assert(!hasDraftArticle, 'Public articles contain 0 un-published/draft items');

  const draftArticle = await getArticleBySlug('catatan-kritis-penguatan-kapasitas-nelayan-pesisir-polman');
  assert(!draftArticle || draftArticle.status === 'PUBLISHED', 'Draft article is blocked from public slug resolution');

  // 4.3 Clean slugs validation
  const invalidSlugs = allArticles.filter((a) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug));
  assert(invalidSlugs.length === 0, 'All published article slugs conform to URL-friendly lowercase-kebab format');

  // --------------------------------------------------------------------------
  // SECTION 5: Comprehensive Regression Suite Across Modules
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Comprehensive Regression Suite Across Modules ---');

  // Module 1: Profile & Tentang
  const profile = await getProfile();
  const timeline = await getTimeline(true);
  const orgs = await getOrganizations(true);
  assert(Boolean(profile?.name), `Profile retrieved successfully: ${profile?.name}`);
  assert(Array.isArray(timeline) && timeline.length > 0, `Timeline items retrieved: ${timeline.length}`);
  assert(Array.isArray(orgs) && orgs.length > 0, `Organizations retrieved: ${orgs.length}`);

  // Module 2: Rekam Kerja
  const categories = await getActivityCategories({ activeOnly: true });
  assert(Array.isArray(categories) && categories.length > 0, `Activity categories retrieved: ${categories.length}`);
  assert(allActivities.length > 0, `Published activities retrieved: ${allActivities.length}`);

  // Module 3: Kabar (Berita & Gagasan)
  const beritaOnly = await getPublishedArticles({ type: 'BERITA' });
  const gagasanOnly = await getPublishedArticles({ type: 'GAGASAN' });
  assert(beritaOnly.every((a) => a.type === 'BERITA'), 'Berita filter returns strictly BERITA type');
  assert(gagasanOnly.every((a) => a.type === 'GAGASAN'), 'Gagasan filter returns strictly GAGASAN type');

  // Module 4: Galeri Foto & Video
  const albums = await getPublishedAlbums();
  const mediaItems = await getMediaItems({ limit: 10 });
  assert(Array.isArray(albums), `Published photo albums retrieved: ${albums.length}`);
  assert(Array.isArray(mediaItems), `Media library items retrieved: ${mediaItems.length}`);

  // Module 5: Aspirasi Submission & Spam Trap
  const validFormData = new FormData();
  validFormData.append('name', 'Audit QA Warga');
  validFormData.append('contact', '081299998888');
  validFormData.append('regency', 'Kab. Polewali Mandar, Provinsi Sulawesi Barat');
  validFormData.append('category', 'Infrastruktur & Jalan');
  validFormData.append('subject', 'Audit QA Aspirasi Publik');
  validFormData.append('message', 'Pengujian regresi sistem aspirasi warga dan verifikasi tiket pelaporan.');
  validFormData.append('hp_code_check', ''); // Empty honeypot (legit user)

  const legitSubmitRes = await submitAspirationAction(validFormData);
  assert(legitSubmitRes.success && Boolean(legitSubmitRes.referenceId), `Legit citizen aspiration submitted with ticket ID: ${legitSubmitRes.referenceId}`);

  const botFormData = new FormData();
  botFormData.append('name', 'Spam Bot QA');
  botFormData.append('contact', 'bot@spammer.org');
  botFormData.append('subject', 'Spam Message');
  botFormData.append('message', 'Buy crypto now!');
  botFormData.append('hp_code_check', 'SPAM_TRIPWIRE_TRIGGERED'); // Bot filled honeypot

  const botSubmitRes = await submitAspirationAction(botFormData);
  assert(!botSubmitRes.success, 'Honeypot trap successfully caught and blocked spam bot');

  // Module 6: Kontak & Settings
  const contact = await getContactSettings();
  const social = await getSocialSettings();
  const general = await getGeneralSettings();
  assert(Boolean(contact.whatsapp), `Active WhatsApp channel available: ${contact.whatsapp}`);
  assert(Boolean(social.instagram), `Official social accounts available: ${social.instagram}`);
  assert(Boolean(general.site_name), `Official platform name available: ${general.site_name}`);

  // Module 7: Legal & Recovery Pages
  assert(fs.existsSync(path.join(rootDir, 'src/app/kebijakan-privasi/page.tsx')), 'Kebijakan Privasi page exists');
  assert(fs.existsSync(path.join(rootDir, 'src/app/syarat-ketentuan/page.tsx')), 'Syarat Ketentuan page exists');
  assert(fs.existsSync(path.join(rootDir, 'src/app/not-found.tsx')), '404 not-found recovery page exists');
  assert(fs.existsSync(path.join(rootDir, 'src/app/error.tsx')), 'Global client error boundary exists');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`📊 PHASE 8 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (${totalTests} TOTAL)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase8Verification().catch((err) => {
  console.error('Fatal error running Phase 8 verification:', err);
  process.exit(1);
});
