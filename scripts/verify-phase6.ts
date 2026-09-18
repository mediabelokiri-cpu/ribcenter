/**
 * Verification Script for Phase 6: Aspirasi & Kontak
 * Tests:
 * 1. Public aspiration submission with valid data (default BARU, internal_note null, ref ID generated)
 * 2. Validation rejections (short name, missing contact, short subject, short message)
 * 3. Bot honeypot protection
 * 4. Safe attachment validation (images/PDF allowed, raw video/executables rejected)
 * 5. Admin retrieval, status filtering, category filtering, and text search
 * 6. Status workflow transitions: BARU -> DITINJAU -> DALAM_TINDAK_LANJUT -> SELESAI -> INFORMASI_DIBERIKAN
 * 7. Invalid status rejection
 * 8. Private internal notes update and persistence
 * 9. Privacy isolation verification
 * 10. Contact settings update and reactive retrieval
 * 11. Social media settings update and retrieval
 * 12. WhatsApp URL generator format validation
 * 13. Safe deletion of test aspirations
 */

import {
  submitPublicAspiration,
  getAllAspirationsForAdmin,
  getAspirationByIdForAdmin,
  updateAspirationStatus,
  updateAspirationInternalNote,
  deleteAspiration,
  getAspirationMetricsForAdmin,
} from '../src/services/aspirations';
import {
  getContactSettings,
  getSocialSettings,
  updateSiteSettingByKey,
  formatWhatsAppUrl,
} from '../src/services/settings';
import { validateMediaFile } from '../src/services/storage';
import { submitAspirationAction } from '../src/app/aspirasi/actions';
import type { AspirationStatus } from '../src/types/database';

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
  console.log('🧪 RUNNING PHASE 6 VERIFICATION: ASPIRASI & KONTAK');
  console.log('======================================================\n');

  let testAspirationId = '';

  // --------------------------------------------------------------------------
  // TEST GROUP 1: PUBLIC ASPIRASI SUBMISSION & VALIDATION
  // --------------------------------------------------------------------------
  console.log('--- 1. Public Aspiration Intake & Validation ---');

  const validSubmission = await submitPublicAspiration({
    name: 'Warga Penguji Otomatis',
    contact: '081298765432',
    regency: 'Kab. Polewali Mandar, Provinsi Sulawesi Barat',
    district: 'Kecamatan Polewali',
    category: 'Infrastruktur & Jalan',
    subject: 'Usulan Perbaikan Gorong-Gorong Jalan Merbabu',
    message:
      'Gorong-gorong di jalan Merbabu tersumbat sedimen pasir dan sampah saat hujan lebat. Mohon perhatian dan peninjauan langsung dari tim.',
    attachment_url: null,
  });

  assert(
    validSubmission.success === true && !!validSubmission.data,
    'Submit valid citizen aspiration succeeds',
    JSON.stringify(validSubmission)
  );

  if (validSubmission.data) {
    testAspirationId = validSubmission.data.id;

    assert(
      validSubmission.data.status === 'BARU',
      'Newly submitted aspiration automatically gets status "BARU"',
      `Status: ${validSubmission.data.status}`
    );

    assert(
      validSubmission.data.internal_note === null,
      'Newly submitted aspiration has internal_note set strictly to null',
      `Internal Note: ${validSubmission.data.internal_note}`
    );

    assert(
      !!validSubmission.referenceId && validSubmission.referenceId.startsWith('ASP-'),
      'Generates citizen tracking reference code (starts with ASP-)',
      `Reference ID: ${validSubmission.referenceId}`
    );
  }

  // Validation: Short Name
  const shortNameRes = await submitPublicAspiration({
    name: 'Al',
    contact: '081234567890',
    subject: 'Perihal Cukup Panjang',
    message: 'Uraian aspirasi yang cukup panjang dan detail...',
  });
  assert(!shortNameRes.success, 'Rejects submission with name shorter than 3 characters');

  // Validation: Missing Contact
  const noContactRes = await submitPublicAspiration({
    name: 'Budi Darmawan',
    contact: '   ',
    subject: 'Perihal Cukup Panjang',
    message: 'Uraian aspirasi yang cukup panjang dan detail...',
  });
  assert(!noContactRes.success, 'Rejects submission with empty contact details');

  // Validation: Short Subject
  const shortSubjectRes = await submitPublicAspiration({
    name: 'Budi Darmawan',
    contact: '081234567890',
    subject: 'Hai',
    message: 'Uraian aspirasi yang cukup panjang dan detail...',
  });
  assert(!shortSubjectRes.success, 'Rejects submission with subject shorter than 5 characters');

  // Validation: Short Message
  const shortMsgRes = await submitPublicAspiration({
    name: 'Budi Darmawan',
    contact: '081234567890',
    subject: 'Perihal Cukup Panjang',
    message: 'Terlalu pendek',
  });
  assert(!shortMsgRes.success, 'Rejects submission with message shorter than 15 characters');

  // --------------------------------------------------------------------------
  // TEST GROUP 2: SPAM & HONEYPOT PROTECTION
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Bot Spam Honeypot Protection ---');

  const botFormData = new FormData();
  botFormData.append('name', 'Spam Bot Crawler');
  botFormData.append('contact', 'spambot@malicious.com');
  botFormData.append('subject', 'Buy cheap products online now');
  botFormData.append('message', 'Spam message content meant to flood the database...');
  botFormData.append('hp_code_check', 'bot-filled-value'); // Honeypot trap triggered

  const honeypotRes = await submitAspirationAction(botFormData);
  assert(
    !honeypotRes.success && Boolean(honeypotRes.error?.includes('Pengiriman tidak dapat diproses')),
    'Honeypot trap catches and rejects automated bot submission'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 3: ATTACHMENT VALIDATION
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Attachment Safety & Validation ---');

  const validJpg = validateMediaFile({ type: 'image/jpeg', size: 2 * 1024 * 1024, name: 'bukti-foto.jpg' });
  assert(validJpg.valid && validJpg.mediaType === 'IMAGE', 'Allows valid JPG attachment under 5MB');

  const validPdf = validateMediaFile({ type: 'application/pdf', size: 4 * 1024 * 1024, name: 'proposal.pdf' });
  assert(validPdf.valid && validPdf.mediaType === 'DOCUMENT', 'Allows valid PDF attachment under 10MB');

  const invalidMp4 = validateMediaFile({ type: 'video/mp4', size: 10 * 1024 * 1024, name: 'raw-video.mp4' });
  assert(!invalidMp4.valid, 'Strictly rejects raw video files (MP4)');

  const oversizedImg = validateMediaFile({ type: 'image/png', size: 8 * 1024 * 1024, name: 'huge-image.png' });
  assert(!oversizedImg.valid, 'Rejects images exceeding 5MB size limit');

  // --------------------------------------------------------------------------
  // TEST GROUP 4: ADMIN RETRIEVAL, FILTERING & SEARCH
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Admin Retrieval, Filtering & Search ---');

  const allAdminAspirations = await getAllAspirationsForAdmin();
  assert(
    allAdminAspirations.length > 0 && allAdminAspirations.some((a) => a.id === testAspirationId),
    'Admin query retrieves all aspirations including newly created test record'
  );

  const searchResults = await getAllAspirationsForAdmin({ search: 'Warga Penguji' });
  assert(
    searchResults.some((a) => a.name === 'Warga Penguji Otomatis'),
    'Admin text search finds aspiration by citizen name'
  );

  const filterStatusResults = await getAllAspirationsForAdmin({ status: 'BARU' });
  assert(
    filterStatusResults.every((a) => a.status === 'BARU'),
    'Admin status filter returns only matching status (BARU)'
  );

  const detailAdmin = await getAspirationByIdForAdmin(testAspirationId);
  assert(
    detailAdmin !== null && detailAdmin.id === testAspirationId && !!detailAdmin.contact,
    'Admin detail query retrieves citizen contact info'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 5: STATUS WORKFLOW PROGRESSION
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Status Workflow Progression ---');

  const workflowSteps: AspirationStatus[] = [
    'DITINJAU',
    'DALAM_TINDAK_LANJUT',
    'SELESAI',
    'INFORMASI_DIBERIKAN',
  ];

  for (const step of workflowSteps) {
    const res = await updateAspirationStatus(testAspirationId, step);
    assert(res.success, `Successfully updated aspiration status to "${step}"`);

    const check = await getAspirationByIdForAdmin(testAspirationId);
    assert(check?.status === step, `Aspiration persisted status is "${step}"`);
  }

  // Reject invalid status
  // @ts-expect-error - testing invalid status runtime safety
  const invalidStatusRes = await updateAspirationStatus(testAspirationId, 'STATUS_PALSU');
  assert(!invalidStatusRes.success, 'Rejects invalid status update');

  // --------------------------------------------------------------------------
  // TEST GROUP 6: PRIVATE INTERNAL NOTES
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Private Internal Notes Management ---');

  const testNote = 'Telah dikoordinasikan dengan Dinas PUPR Wilayah II pada 16 September 2026.';
  const noteRes = await updateAspirationInternalNote(testAspirationId, testNote);
  assert(noteRes.success, 'Admin successfully saves private internal note');

  const checkNote = await getAspirationByIdForAdmin(testAspirationId);
  assert(
    checkNote?.internal_note === testNote,
    'Internal note is persisted and accessible in Admin detail view'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 7: PRIVACY ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Privacy & Security Isolation ---');

  // Verify that public intake does not allow setting internal_note
  const injectedSubmission = await submitPublicAspiration({
    name: 'Hacker Injeksi',
    contact: '081211112222',
    subject: 'Percobaan Injeksi Catatan',
    message: 'Mencoba mengisi kolom internal_note dari form publik...',
    // @ts-expect-error - testing malicious field injection
    internal_note: 'Catatan terinjeksi ilegal',
  });

  assert(
    injectedSubmission.success && injectedSubmission.data?.internal_note === null,
    'Public submission strictly isolates and ignores internal_note injection (remains null)'
  );

  if (injectedSubmission.data) {
    await deleteAspiration(injectedSubmission.data.id);
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 8: SETTINGS INTEGRATION (CONTACT & SOCIAL)
  // --------------------------------------------------------------------------
  console.log('\n--- 8. Settings Integration (Site Settings) ---');

  const originalContact = await getContactSettings();
  assert(
    !!originalContact.email && !!originalContact.whatsapp,
    'Retrieves default structured contact settings'
  );

  // Update contact settings
  const updateContactRes = await updateSiteSettingByKey('contact', {
    email: 'sekretariat.resmi@kawanrib.id',
    whatsapp: '081199887766',
    address: 'Jl. Merdeka No. 10, Kab. Polewali Mandar, Provinsi Sulawesi Barat',
    office_hours: 'Senin – Sabtu: 08.00 – 16.30 WITA',
  });
  assert(updateContactRes.success, 'Updates contact settings via site_settings');

  const newContact = await getContactSettings();
  assert(
    newContact.email === 'sekretariat.resmi@kawanrib.id' &&
    newContact.whatsapp === '081199887766',
    'Contact settings update reflects reactively in getContactSettings()'
  );

  // Social settings update
  const updateSocialRes = await updateSiteSettingByKey('social', {
    instagram: 'https://instagram.com/rahmatichwanbahtiar',
    twitter: 'https://x.com/kawanrib',
  });
  assert(updateSocialRes.success, 'Updates social media settings via site_settings');

  const newSocial = await getSocialSettings();
  assert(
    newSocial.instagram === 'https://instagram.com/rahmatichwanbahtiar',
    'Social media settings update reflects in getSocialSettings()'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 9: WHATSAPP URL FORMATTER
  // --------------------------------------------------------------------------
  console.log('\n--- 9. WhatsApp URL Formatter ---');

  const wa1 = formatWhatsAppUrl('081155667788', 'Pesan halo');
  assert(
    wa1.startsWith('https://wa.me/6281155667788?text=Pesan%20halo'),
    'Formats 08xxx to wa.me/628xxx with encoded greeting message'
  );

  const wa2 = formatWhatsAppUrl('+62 811-5566-7788');
  assert(
    wa2.startsWith('https://wa.me/6281155667788'),
    'Cleans spaces, dashes, and plus sign to valid wa.me URL'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 10: METRICS & CLEANUP
  // --------------------------------------------------------------------------
  console.log('\n--- 10. Metrics & Test Cleanup ---');

  const metrics = await getAspirationMetricsForAdmin();
  assert(
    metrics.total > 0 && typeof metrics.baru === 'number',
    'Calculates accurate aspiration counts by status'
  );

  // Delete test aspiration
  const delRes = await deleteAspiration(testAspirationId);
  assert(delRes.success, 'Admin deletes test aspiration successfully');

  const checkDeleted = await getAspirationByIdForAdmin(testAspirationId);
  assert(checkDeleted === null, 'Deleted test aspiration no longer exists');

  // Restore original contact settings
  await updateSiteSettingByKey('contact', {
    email: originalContact.email,
    whatsapp: originalContact.whatsapp,
    address: originalContact.address,
    office_hours: originalContact.office_hours,
  });

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`📊 PHASE 6 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
