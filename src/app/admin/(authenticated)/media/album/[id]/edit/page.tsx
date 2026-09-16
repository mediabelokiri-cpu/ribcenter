import { notFound } from 'next/navigation';
import {
  getAlbumByIdForAdmin,
  getMediaByAlbum,
  getMediaItems,
} from '@/services/media';
import { AlbumForm } from '../../album-form';

export const dynamic = 'force-dynamic';

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAlbumEditPage({ params }: EditAlbumPageProps) {
  const { id } = await params;
  const album = await getAlbumByIdForAdmin(id);

  if (!album) {
    notFound();
  }

  const [attachedMedia, unassignedMedia] = await Promise.all([
    getMediaByAlbum(id, false),
    getMediaItems({ album_id: null, media_type: 'IMAGE', limit: 100 }),
  ]);

  return (
    <AlbumForm
      initialData={album}
      initialMedia={attachedMedia}
      allUnassignedMedia={unassignedMedia}
    />
  );
}
