import { NextResponse } from 'next/server';
import { getMediaItems } from '@/services/media';
import type { MediaType } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as MediaType | null;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const items = await getMediaItems({
      media_type: type || undefined,
      search,
      limit,
    });

    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
