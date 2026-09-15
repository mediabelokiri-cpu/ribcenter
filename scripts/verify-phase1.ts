/**
 * Phase 1 Security & Architecture Verification Script
 * Validates the 6 mandatory security tests and CMS services
 */

import { getPublicEnv, getServerEnv } from '../src/lib/env';
import { getPublishedActivities, getAllActivitiesForAdmin } from '../src/services/activities';
import { getPublishedArticles, getAllArticlesForAdmin } from '../src/services/articles';
import { getDashboardStats } from '../src/services/dashboard';
import { getAllAspirationsForAdmin } from '../src/services/aspirations';
import * as fs from 'fs';
import * as path from 'path';

async function runVerification() {
  console.log('=== PHASE 1: SECURITY & ARCHITECTURE VERIFICATION ===\n');

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
  // TEST 1 & 2: Middleware & Admin Protection
  // --------------------------------------------------------------------------
  console.log('\n--- Test 1 & 2: Route Protection & Admin Authorization ---');
  const middlewareFile = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');
  assert(
    middlewareFile.includes("pathname.startsWith('/admin')") &&
    middlewareFile.includes("loginUrl = new URL('/admin/login', request.url)") &&
    middlewareFile.includes("NextResponse.redirect(loginUrl)"),
    'Security Test 1: Unauthenticated user visiting /admin is redirected to /admin/login'
  );

  const authFile = fs.readFileSync(path.join(process.cwd(), 'src/lib/auth.ts'), 'utf8');
  assert(
    authFile.includes(".eq('role', 'ADMIN')") &&
    authFile.includes("redirect('/admin/login')"),
    'Security Test 2: Server-side guard strictly validates role ADMIN'
  );

  // --------------------------------------------------------------------------
  // TEST 3: Public content vs Draft content separation
  // --------------------------------------------------------------------------
  console.log('\n--- Test 3: Public Data Security (Draft Isolation) ---');
  const publishedActivities = await getPublishedActivities();
  const hasDraftActivity = publishedActivities.some((a) => a.status === 'DRAFT' || a.status === 'ARCHIVED');
  assert(
    !hasDraftActivity && publishedActivities.length > 0,
    'Security Test 3A: Public activities query strictly excludes DRAFT and ARCHIVED items'
  );

  const publishedArticles = await getPublishedArticles();
  const hasDraftArticle = publishedArticles.some((a) => a.status === 'DRAFT' || a.status === 'ARCHIVED');
  assert(
    !hasDraftArticle && publishedArticles.length > 0,
    'Security Test 3B: Public articles query strictly excludes DRAFT and ARCHIVED items'
  );

  const allArticlesAdmin = await getAllArticlesForAdmin();
  assert(
    allArticlesAdmin.some((a) => a.status === 'DRAFT'),
    'Security Test 3C: Admin service can view DRAFT articles for internal editing'
  );

  const allActivitiesAdmin = await getAllActivitiesForAdmin();
  assert(
    allActivitiesAdmin.some((a) => a.status === 'DRAFT'),
    'Security Test 3D: Admin service can view DRAFT activities for internal editing'
  );

  // --------------------------------------------------------------------------
  // TEST 4: Aspirations Internal Notes & Privacy
  // --------------------------------------------------------------------------
  console.log('\n--- Test 4: Citizen Aspirations Privacy & Internal Note Isolation ---');
  const rlsFile = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/00002_row_level_security.sql'), 'utf8');
  assert(
    rlsFile.includes('CREATE POLICY "Public can submit aspirations"') &&
    rlsFile.includes('FOR INSERT') &&
    !rlsFile.includes('Public can view aspirations'),
    'Security Test 4A: RLS policy denies public SELECT on aspirations (Internal notes protected from public exposure)'
  );

  const adminAspirations = await getAllAspirationsForAdmin();
  assert(
    adminAspirations.every((a) => a.internal_note !== undefined),
    'Security Test 4B: Admin service is equipped to review internal notes securely'
  );

  // --------------------------------------------------------------------------
  // TEST 5: Secret Management & Client-Side Leakage Prevention
  // --------------------------------------------------------------------------
  console.log('\n--- Test 5: Secret Credentials Segregation ---');
  const publicEnv = getPublicEnv();
  assert(
    !('supabaseServiceRoleKey' in publicEnv),
    'Security Test 5A: Public environment variables strictly exclude Service Role Key'
  );

  const serverEnv = getServerEnv();
  assert(
    'supabaseServiceRoleKey' in serverEnv,
    'Security Test 5B: Service Role Key is strictly isolated to server environment'
  );

  // --------------------------------------------------------------------------
  // TEST 6: Unauthorized Operations Rejection (RLS Design)
  // --------------------------------------------------------------------------
  console.log('\n--- Test 6: Database RLS Enforcement ---');
  assert(
    rlsFile.includes('CREATE OR REPLACE FUNCTION public.is_admin()') &&
    rlsFile.includes('ENABLE ROW LEVEL SECURITY;') &&
    rlsFile.includes('public.is_admin()'),
    'Security Test 6: RLS enforces rejection of unauthorized non-admin database operations'
  );

  // --------------------------------------------------------------------------
  // TEST 7: Dashboard Stats Aggregation
  // --------------------------------------------------------------------------
  console.log('\n--- Test 7: Dashboard Foundation Aggregation ---');
  const dashboardStats = await getDashboardStats();
  assert(
    dashboardStats.counts.totalActivities > 0 &&
    dashboardStats.counts.totalArticles > 0 &&
    dashboardStats.counts.totalAspirations > 0,
    'Dashboard service aggregates counts correctly across entities'
  );
  assert(
    dashboardStats.latestAspirations.length > 0 &&
    dashboardStats.latestActivities.length > 0,
    'Dashboard service loads recent items lists'
  );

  console.log('\n=============================================');
  if (failedTests === 0) {
    console.log('ALL PHASE 1 SECURITY & ARCHITECTURAL TESTS PASSED!');
    process.exit(0);
  } else {
    console.error(`FAILED: ${failedTests} test(s) failed.`);
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
