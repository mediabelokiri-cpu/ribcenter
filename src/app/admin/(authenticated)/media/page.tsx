import { getMediaItems, getAllAlbumsForAdmin } from '@/services/media';
import { MediaLibraryManager } from './media-library-manager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const [media, albums] = await Promise.all([
    getMediaItems({ limit: 100 }),
    getAllAlbumsForAdmin(),
  ]);

  return <MediaLibraryManager initialMedia={media} albums={albums} />;
}
