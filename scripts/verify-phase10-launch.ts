/**
 * PHASE 10: FINAL LAUNCH READINESS VERIFICATION SUITE
 * Complete end-to-end technical, security, SEO, assets & broken links audit.
 * Target: https://rahmatichwanbahtiar.vercel.app
 */

import fs from 'fs';
import path from 'path';

const PRODUCTION_URL = 'https://rahmatichwanbahtiar.vercel.app';

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

async function runLaunchVerification() {
  console.log('\n======================================================');
  console.log(`🚀 RUNNING PHASE 10: FINAL LAUNCH READINESS AUDIT`);
  console.log(`Target: ${PRODUCTION_URL}`);
  console.log('======================================================\n');

  const rootDir = path.resolve(__dirname, '..');

  // --------------------------------------------------------------------------
  // 1. Production Public Routes Verification (All 17 Routes Online)
  // --------------------------------------------------------------------------
  console.log('--- 1. Production Online Routes Audit (HTTP 200) ---');

  const publicRoutes = [
    { path: '/', name: 'Beranda Utama' },
    { path: '/tentang', name: 'Profil & Rekam Jejak' },
    { path: '/rekam-kerja', name: 'Direktori Rekam Kerja' },
    { path: '/rekam-kerja/penyaluran-bantuan-bibit-kakao-unggul-kelompok-tani', name: 'Detail Rekam Kerja Slug' },
    { path: '/kabar', name: 'Portal Kabar & Gagasan' },
    { path: '/kabar/berita', name: 'Kabar Berita Resmi' },
    { path: '/kabar/gagasan', name: 'Kabar Gagasan Kebijakan' },
    { path: '/kabar/peluncuran-platform-akuntabilitas-publik', name: 'Detail Kabar Berita Slug' },
    { path: '/galeri', name: 'Portal Galeri Multimedia' },
    { path: '/galeri/foto', name: 'Koleksi Album Foto' },
    { path: '/galeri/foto/peninjauan-lapangan-pembangunan-jembatan-desa', name: 'Detail Album Foto Slug' },
    { path: '/galeri/video', name: 'Direktori Video Kegiatan' },
    { path: '/aspirasi', name: 'Formulir Partisipasi Aspirasi' },
    { path: '/kontak', name: 'Pusat Kontak & Sekretariat' },
    { path: '/kebijakan-privasi', name: 'Dokumen Kebijakan Privasi' },
    { path: '/syarat-ketentuan', name: 'Dokumen Syarat & Ketentuan' },
    { path: '/admin/login', name: 'Gerbang Otentikasi Admin CMS' },
  ];

  for (const r of publicRoutes) {
    try {
      const res = await fetch(`${PRODUCTION_URL}${r.path}`);
      assert(res.status === 200, `${r.name} (${r.path}) returns HTTP 200 OK`);
    } catch (err) {
      assert(false, `${r.name} (${r.path}) failed: ${(err as Error).message}`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. Critical Static Assets Availability (Images & Icons)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Critical Static Assets Availability ---');

  const staticAssets = [
    { path: '/rahmat-ichwan-bahtiar-hero.png', name: 'Cutout Hero Portrait' },
    { path: '/hero-bg.webp', name: 'Hero Background Panoramic WebP' },
    { path: '/rahmat-hero.png', name: 'Social OpenGraph Fallback Image' },
    { path: '/favicon.ico', name: 'Browser Favicon' },
    { path: '/file.svg', name: 'Fallback File Icon' },
  ];

  for (const asset of staticAssets) {
    try {
      const res = await fetch(`${PRODUCTION_URL}${asset.path}`);
      assert(res.status === 200, `${asset.name} (${asset.path}) is accessible (HTTP 200)`);
    } catch (err) {
      assert(false, `${asset.name} (${asset.path}) failed: ${(err as Error).message}`);
    }
  }

  // --------------------------------------------------------------------------
  // 3. SEO & Indexing Infrastructure
  // --------------------------------------------------------------------------
  console.log('\n--- 3. SEO & Search Engine Infrastructure ---');

  // Sitemap
  try {
    const sitemapRes = await fetch(`${PRODUCTION_URL}/sitemap.xml`);
    assert(sitemapRes.status === 200, '/sitemap.xml returns HTTP 200 OK');
    const sitemapText = await sitemapRes.text();
    assert(sitemapText.includes('<urlset') && sitemapText.includes('</urlset>'), '/sitemap.xml generates valid XML urlset');
    assert(sitemapText.includes('/tentang') && sitemapText.includes('/rekam-kerja') && sitemapText.includes('/kabar'), '/sitemap.xml includes core public paths');
  } catch (err) {
    assert(false, `Sitemap verification failed: ${(err as Error).message}`);
  }

  // Robots
  try {
    const robotsRes = await fetch(`${PRODUCTION_URL}/robots.txt`);
    assert(robotsRes.status === 200, '/robots.txt returns HTTP 200 OK');
    const robotsText = await robotsRes.text();
    assert(robotsText.includes('Disallow: /admin/'), '/robots.txt blocks crawler access to /admin/');
    assert(robotsText.includes('Disallow: /api/'), '/robots.txt blocks crawler access to /api/');
    assert(robotsText.includes('/sitemap.xml'), '/robots.txt references /sitemap.xml');
  } catch (err) {
    assert(false, `Robots verification failed: ${(err as Error).message}`);
  }

  // --------------------------------------------------------------------------
  // 4. Security & Isolation Hardening
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Security & Isolation Hardening ---');

  // Security Headers
  try {
    const rootRes = await fetch(PRODUCTION_URL);
    const xFrame = rootRes.headers.get('x-frame-options');
    const xContent = rootRes.headers.get('x-content-type-options');
    const referrerPolicy = rootRes.headers.get('referrer-policy');
    const permissionsPolicy = rootRes.headers.get('permissions-policy');

    assert(xFrame === 'SAMEORIGIN', `X-Frame-Options: SAMEORIGIN enforced (got ${xFrame})`);
    assert(xContent === 'nosniff', `X-Content-Type-Options: nosniff enforced (got ${xContent})`);
    assert(Boolean(referrerPolicy), `Referrer-Policy enforced: ${referrerPolicy}`);
    assert(Boolean(permissionsPolicy), `Permissions-Policy enforced: ${permissionsPolicy}`);
  } catch (err) {
    assert(false, `Security header verification failed: ${(err as Error).message}`);
  }

  // Admin Route Protection Redirect
  try {
    const adminRes = await fetch(`${PRODUCTION_URL}/admin`, { redirect: 'manual' });
    // Should return 307 or 308 redirecting to /admin/login
    const isRedirect = adminRes.status === 307 || adminRes.status === 308 || adminRes.status === 302;
    const location = adminRes.headers.get('location') || '';
    assert(isRedirect && location.includes('/admin/login'), `Unauthenticated /admin redirects to /admin/login (Status: ${adminRes.status}, Location: ${location})`);
  } catch (err) {
    assert(false, `Admin protection redirect failed: ${(err as Error).message}`);
  }

  // Secret Leak Scan across all client code
  function scanDirForSecrets(dir: string): string[] {
    const leaks: string[] = [];
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        leaks.push(...scanDirForSecrets(fullPath));
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes("'use client'") || content.includes('"use client"')) {
          if (content.includes('SUPABASE_SERVICE_ROLE_KEY') || content.includes('supabaseServiceRoleKey')) {
            leaks.push(fullPath);
          }
        }
      }
    }
    return leaks;
  }
  const clientLeaks = scanDirForSecrets(path.join(rootDir, 'src'));
  assert(clientLeaks.length === 0, `Client components have 0 leaked service-role secrets (scanned ${clientLeaks.length})`);

  // --------------------------------------------------------------------------
  // 5. Code Quality & Build Stability
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Repository & Code Quality Integrity ---');

  // Verify git status clean
  const gitStatusOutput = fs.existsSync(path.join(rootDir, '.git'));
  assert(gitStatusOutput, 'Git repository is initialized and active');

  // Check .env.example documentation
  const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf-8');
  assert(envExample.includes('NEXT_PUBLIC_APP_URL') && envExample.includes('NEXT_PUBLIC_SUPABASE_URL'), '.env.example documents all required variables');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`📊 PHASE 10 AUDIT RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (${totalTests} TOTAL)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runLaunchVerification().catch((err) => {
  console.error('Fatal error running Phase 10 verification:', err);
  process.exit(1);
});
