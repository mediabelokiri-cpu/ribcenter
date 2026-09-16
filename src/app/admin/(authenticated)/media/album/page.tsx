import { getAllAlbumsForAdmin, getMediaItems } from '@/services/media';
import { AlbumListManager } from './album-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminAlbumsPage() {
  const [albums, allMedia] = await Promise.all([
    getAllAlbumsForAdmin(),
    getMediaItems({ limit: 1000 }),
  ]);

  // Calculate media counts per album
  const mediaCounts: Record<string, number> = {};
  allMedia.forEach((m) => {
    if (m.album_id) {
      mediaCounts[m.album_id] = (mediaCounts[m.album_id] || 0) + 1;
    }
  });

  return <AlbumListManager initialAlbums={albums} mediaCounts={mediaCounts} />;
}
