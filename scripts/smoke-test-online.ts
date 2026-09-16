/**
 * ONLINE SMOKE TEST FOR PRODUCTION DEPLOYMENT
 * Target: https://rahmatichwanbahtiar.vercel.app
 */

const BASE_URL = 'https://rahmatichwanbahtiar.vercel.app';

interface RouteTest {
  path: string;
  expectedStatus: number;
  expectedText?: string;
  name: string;
}

const routesToTest: RouteTest[] = [
  { path: '/', expectedStatus: 200, expectedText: 'KAWAN RIB', name: 'Homepage (Beranda)' },
  { path: '/tentang', expectedStatus: 200, expectedText: 'Rahmat Ichwan Bahtiar', name: 'Profil & Tentang' },
  { path: '/rekam-kerja', expectedStatus: 200, expectedText: 'Rekam Kerja', name: 'Rekam Kerja Directory' },
  { path: '/kabar', expectedStatus: 200, expectedText: 'Kabar', name: 'Kabar Portal' },
  { path: '/kabar/berita', expectedStatus: 200, expectedText: 'Berita', name: 'Kabar Berita' },
  { path: '/kabar/gagasan', expectedStatus: 200, expectedText: 'Gagasan', name: 'Kabar Gagasan' },
  { path: '/galeri', expectedStatus: 200, expectedText: 'Galeri', name: 'Galeri Multimedia' },
  { path: '/galeri/foto', expectedStatus: 200, expectedText: 'Album Foto', name: 'Galeri Foto' },
  { path: '/galeri/video', expectedStatus: 200, expectedText: 'Video', name: 'Galeri Video' },
  { path: '/aspirasi', expectedStatus: 200, expectedText: 'Aspirasi', name: 'Aspirasi Warga Form' },
  { path: '/kontak', expectedStatus: 200, expectedText: 'Kontak', name: 'Kontak & Sekretariat' },
  { path: '/kebijakan-privasi', expectedStatus: 200, expectedText: 'Kebijakan Privasi', name: 'Kebijakan Privasi' },
  { path: '/syarat-ketentuan', expectedStatus: 200, expectedText: 'Syarat', name: 'Syarat & Ketentuan' },
  { path: '/sitemap.xml', expectedStatus: 200, expectedText: '<urlset', name: 'XML Sitemap Endpoint' },
  { path: '/robots.txt', expectedStatus: 200, expectedText: 'Disallow', name: 'Robots.txt Endpoint' },
  { path: '/admin/login', expectedStatus: 200, expectedText: 'Admin', name: 'Admin Login Gate' },
];

async function runOnlineSmokeTests() {
  console.log('\n======================================================');
  console.log(`🌐 EXECUTING ONLINE SMOKE TESTS: ${BASE_URL}`);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  for (const route of routesToTest) {
    const targetUrl = `${BASE_URL}${route.path}`;
    try {
      const response = await fetch(targetUrl);
      const isStatusMatch = response.status === route.expectedStatus;
      let isTextMatch = true;

      if (route.expectedText) {
        const bodyText = await response.text();
        isTextMatch = bodyText.includes(route.expectedText);
      }

      if (isStatusMatch && isTextMatch) {
        passed++;
        console.log(`  ✓ PASS [${response.status}]: ${route.name} (${route.path})`);
      } else {
        failed++;
        console.error(`  ✗ FAIL [${response.status}]: ${route.name} (Expected status ${route.expectedStatus}, text match: ${isTextMatch})`);
      }
    } catch (err) {
      failed++;
      console.error(`  ✗ ERROR: Failed to fetch ${targetUrl}:`, (err as Error).message);
    }
  }

  // Security Headers Check on root response
  try {
    const rootRes = await fetch(BASE_URL);
    const xFrame = rootRes.headers.get('x-frame-options');
    const xContent = rootRes.headers.get('x-content-type-options');
    const referrerPolicy = rootRes.headers.get('referrer-policy');

    if (xFrame && xContent && referrerPolicy) {
      passed++;
      console.log(`  ✓ PASS: HTTP Security Headers verified (X-Frame: ${xFrame}, X-Content-Type: ${xContent})`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: Missing one or more HTTP security headers`);
    }
  } catch (err) {
    failed++;
    console.error(`  ✗ ERROR checking security headers:`, (err as Error).message);
  }

  console.log('\n======================================================');
  console.log(`📊 ONLINE SMOKE TEST RESULTS: ${passed} PASSED, ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runOnlineSmokeTests().catch((err) => {
  console.error('Fatal error in smoke test:', err);
  process.exit(1);
});
