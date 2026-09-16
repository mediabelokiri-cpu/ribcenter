import { NextResponse } from 'next/server';
import { getMediaItems } from '@/services/media';
import type { MediaType } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawType = searchParams.get('type');
    const type = rawType === 'IMAGE' || rawType === 'VIDEO' ? (rawType as MediaType) : undefined;
    const search = searchParams.get('search')?.slice(0, 100) || undefined;
    const parsedLimit = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Math.min(Math.max(1, isNaN(parsedLimit) ? 50 : parsedLimit), 200);

    const items = await getMediaItems({
      media_type: type,
      search,
      limit,
    });

    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
