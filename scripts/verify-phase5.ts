/**
 * Verification Script for Phase 5: Media & Galeri
 * Run with: npx.cmd tsx scripts/verify-phase5.ts
 */

import { validateMediaFile, generateStoragePath } from '../src/services/storage';
import {
  parseVideoUrl,
  createMediaItem,
  getMediaItems,
  getMediaById,
  updateMediaItem,
  deleteMediaItem,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getPublishedAlbums,
  getAlbumBySlug,
  getMediaByAlbum,
  isAlbumSlugAvailable,
  attachMediaToAlbum,
  detachMediaFromAlbum,
} from '../src/services/media';

async function runPhase5Verification() {
  console.log('=== PHASE 5: MEDIA & GALERI VERIFICATION ===\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedTests++;
    }
  }

  // --------------------------------------------------------------------------
  // 1. STORAGE VALIDATION & SANITIZATION
  // --------------------------------------------------------------------------
  console.log('--- 1. Storage Validation & Sanitization ---');

  const validImage = validateMediaFile({
    name: 'foto-kegiatan.jpg',
    type: 'image/jpeg',
    size: 2 * 1024 * 1024, // 2MB
  });
  assert(validImage.valid && validImage.mediaType === 'IMAGE', 'Validates JPEG image file correctly');

  const validWebp = validateMediaFile({
    name: 'dokumentasi.webp',
    type: 'image/webp',
    size: 1 * 1024 * 1024,
  });
  assert(validWebp.valid && validWebp.mediaType === 'IMAGE', 'Validates WebP image file correctly');

  const validPdf = validateMediaFile({
    name: 'laporan-akuntabilitas.pdf',
    type: 'application/pdf',
    size: 3 * 1024 * 1024,
  });
  assert(validPdf.valid && validPdf.mediaType === 'DOCUMENT', 'Validates PDF document file correctly');

  const oversizeImage = validateMediaFile({
    name: 'giant-photo.png',
    type: 'image/png',
    size: 12 * 1024 * 1024, // 12MB > 5MB
  });
  assert(!oversizeImage.valid && Boolean(oversizeImage.error), 'Rejects oversized image (> 5MB)');

  const illegalFileType = validateMediaFile({
    name: 'script.exe',
    type: 'application/x-msdownload',
    size: 1000,
  });
  assert(!illegalFileType.valid && Boolean(illegalFileType.error), 'Rejects illegal executable file type');

  const rawVideoRejected = validateMediaFile({
    name: 'video-mentah.mp4',
    type: 'video/mp4',
    size: 50 * 1024 * 1024,
  });
  assert(!rawVideoRejected.valid, 'Rejects raw video upload (enforcing external video URL scope)');

  const storagePath = generateStoragePath('Kunjungan Lapangan & Desa 2026.PNG');
  assert(
    storagePath.cleanFileName.endsWith('.png') &&
      !storagePath.cleanFileName.includes(' ') &&
      !storagePath.cleanFileName.includes('&'),
    'Sanitizes filename cleanly removing spaces and special characters'
  );

  // --------------------------------------------------------------------------
  // 2. EXTERNAL VIDEO PARSER (YOUTUBE / VIMEO)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. External Video Parser ---');

  const ytStandard = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert(
    ytStandard.platform === 'youtube' &&
      ytStandard.videoId === 'dQw4w9WgXcQ' &&
      ytStandard.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ') &&
      ytStandard.thumbnailUrl.includes('dQw4w9WgXcQ'),
    'Parses standard YouTube watch URL correctly'
  );

  const ytShortUrl = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert(ytShortUrl.videoId === 'dQw4w9WgXcQ', 'Parses short youtu.be URL correctly');

  const ytShorts = parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ');
  assert(ytShorts.videoId === 'dQw4w9WgXcQ', 'Parses YouTube Shorts URL correctly');

  // --------------------------------------------------------------------------
  // 3. MEDIA CRUD & TYPE FILTERING
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Media CRUD & Type Filtering ---');

  const photoMediaRes = await createMediaItem({
    album_id: null,
    file_url: 'https://images.example.com/test-photo-p5.jpg',
    media_type: 'IMAGE',
    title: '[TEST P5] Foto Penyerahan Bibit',
    alt_text: 'Penyerahan bibit tani',
    caption: 'Foto dokumentasi uji coba Phase 5',
    metadata: { size: 102400, mime_type: 'image/jpeg' },
  });
  assert(photoMediaRes.success && Boolean(photoMediaRes.data?.id), 'Creates IMAGE media item');
  const photoId = photoMediaRes.data!.id;

  const videoMediaRes = await createMediaItem({
    album_id: null,
    file_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    media_type: 'VIDEO',
    title: '[TEST P5] Video Liputan Penyerahan Bantuan',
    alt_text: 'Video bantuan alsintan',
    caption: 'Video dokumentasi uji coba Phase 5',
    metadata: {
      platform: 'youtube',
      videoId: 'dQw4w9WgXcQ',
      embed_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    },
  });
  assert(videoMediaRes.success && Boolean(videoMediaRes.data?.id), 'Creates VIDEO media item');
  const videoId = videoMediaRes.data!.id;

  // Filter by type
  const imageFiltered = await getMediaItems({ media_type: 'IMAGE', search: '[TEST P5]' });
  assert(imageFiltered.length >= 1 && imageFiltered.every((m) => m.media_type === 'IMAGE'), 'Filters media by IMAGE type');

  const videoFiltered = await getMediaItems({ media_type: 'VIDEO', search: '[TEST P5]' });
  assert(videoFiltered.length >= 1 && videoFiltered.every((m) => m.media_type === 'VIDEO'), 'Filters media by VIDEO type');

  // Search by keyword
  const searchResults = await getMediaItems({ search: 'Bibit' });
  assert(searchResults.some((m) => m.id === photoId), 'Searches media by keyword');

  // Update media
  const updateRes = await updateMediaItem(photoId, {
    title: '[TEST P5] Foto Penyerahan Bibit (Revisi)',
  });
  assert(
    Boolean(updateRes.success && updateRes.data?.title?.includes('(Revisi)')),
    'Updates media title successfully'
  );

  // --------------------------------------------------------------------------
  // 4. ALBUM CRUD & SLUG GENERATION
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Album CRUD & Slug Validation ---');

  const albumRes = await createAlbum({
    title: '[TEST P5] Album Dokumentasi Reses 2026',
    slug: 'test-p5-album-dokumentasi-reses-2026',
    description: 'Album pengujian untuk verifikasi sistem galeri',
    cover_image_url: 'https://images.example.com/album-cover.jpg',
    featured: true,
    order_index: 10,
    status: 'PUBLISHED',
  });
  assert(albumRes.success && Boolean(albumRes.data?.id), 'Creates new Album with slug');
  const albumId = albumRes.data!.id;
  const albumSlug = albumRes.data!.slug;

  const isAvailableSelf = await isAlbumSlugAvailable(albumSlug, albumId);
  assert(isAvailableSelf, 'Slug check allows self-update for existing album');

  const isAvailableDuplicate = await isAlbumSlugAvailable(albumSlug);
  assert(!isAvailableDuplicate, 'Slug check blocks duplicate slug for other albums');

  // --------------------------------------------------------------------------
  // 5. ALBUM-TO-MEDIA RELATIONSHIP (ATTACH & DETACH)
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Album-to-Media Relationship ---');

  const attachRes = await attachMediaToAlbum([photoId, videoId], albumId);
  assert(attachRes.success, 'Attaches multiple media items to album');

  const albumPhotos = await getMediaByAlbum(albumId, false);
  assert(
    albumPhotos.some((m) => m.id === photoId) && albumPhotos.some((m) => m.id === videoId),
    'Retrieves media items linked to album'
  );

  const detachRes = await detachMediaFromAlbum(videoId);
  assert(detachRes.success, 'Detaches media item from album');

  const updatedAlbumPhotos = await getMediaByAlbum(albumId, false);
  assert(!updatedAlbumPhotos.some((m) => m.id === videoId), 'Verified media is detached from album');

  // --------------------------------------------------------------------------
  // 6. PUBLICATION STATUS & STRICT DRAFT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Publication Status & Strict Draft Isolation ---');

  // Set album to DRAFT
  await updateAlbum(albumId, { status: 'DRAFT' });

  // Check getPublishedAlbums()
  const publicAlbums = await getPublishedAlbums();
  assert(!publicAlbums.some((a) => a.id === albumId), 'Security 6A: getPublishedAlbums strictly excludes DRAFT album');

  // Check getAlbumBySlug()
  const draftSlugQuery = await getAlbumBySlug(albumSlug);
  assert(draftSlugQuery === null, 'Security 6B: getAlbumBySlug strictly returns null for DRAFT album (404 isolation)');

  // Check public getMediaByAlbum()
  const publicMediaInDraftAlbum = await getMediaByAlbum(albumId, true);
  assert(publicMediaInDraftAlbum.length === 0, 'Security 6C: Public media query blocks media inside DRAFT album');

  // Re-publish album
  await updateAlbum(albumId, { status: 'PUBLISHED' });
  const publishedSlugQuery = await getAlbumBySlug(albumSlug);
  assert(publishedSlugQuery !== null && publishedSlugQuery.id === albumId, 'Published album is accessible publicly');

  // --------------------------------------------------------------------------
  // 7. CLEANUP TEST DATA
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Cleanup Test Data ---');

  await deleteMediaItem(photoId);
  await deleteMediaItem(videoId);
  await deleteAlbum(albumId);

  const checkMediaDeleted = await getMediaById(photoId);
  const checkAlbumDeleted = await getAlbumBySlug(albumSlug);
  assert(checkMediaDeleted === null && checkAlbumDeleted === null, 'Test media and albums successfully cleaned up');

  // --------------------------------------------------------------------------
  // FINAL SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);

  if (failedTests === 0) {
    console.log('ALL PHASE 5 MEDIA & GALERI TESTS PASSED!');
  } else {
    console.error('SOME PHASE 5 TESTS FAILED.');
    process.exit(1);
  }
}

runPhase5Verification().catch((err) => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
