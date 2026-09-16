import { getMediaItems, getAllAlbumsForAdmin } from '@/services/media';
import { MediaLibraryManager } from '../media-library-manager';

export const dynamic = 'force-dynamic';

export default async function AdminVideoPage() {
  const [videos, albums] = await Promise.all([
    getMediaItems({ media_type: 'VIDEO', limit: 100 }),
    getAllAlbumsForAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-xs text-amber-900">
        <span className="font-bold">Informasi Kebijakan Video Eksternal:</span> Website ini mengutamakan penyematan video melalui tautan resmi (seperti YouTube) agar performa website tetap ringan, cepat diakses warga di seluruh daerah, dan hemat kuota server.
      </div>
      <MediaLibraryManager initialMedia={videos} albums={albums} />
    </div>
  );
}
