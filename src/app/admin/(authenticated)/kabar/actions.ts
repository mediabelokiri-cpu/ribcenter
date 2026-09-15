'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  isArticleSlugAvailable,
} from '@/services/articles';
import type { ArticleType, ContentStatus } from '@/types/database';
import { slugify } from '@/lib/slug';

function revalidateAllArticlePaths(slug?: string) {
  revalidatePath('/admin/kabar');
  revalidatePath('/admin/kabar/berita');
  revalidatePath('/admin/kabar/gagasan');
  revalidatePath('/kabar');
  revalidatePath('/kabar/berita');
  revalidatePath('/kabar/gagasan');
  revalidatePath('/');
  if (slug) {
    revalidatePath(`/kabar/${slug}`);
  }
}

export async function createArticleAction(formData: FormData) {
  await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const type = (formData.get('type') as ArticleType) || 'BERITA';
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim();
  const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
  const category = (formData.get('category') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || 'Rahmat Ichwan Bahtiar';
  const publishedAt = (formData.get('published_at') as string)?.trim() || null;
  const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const relatedActivityId = (formData.get('related_activity_id') as string)?.trim() || null;
  const seoTitle = (formData.get('seo_title') as string)?.trim() || null;
  const seoDescription = (formData.get('seo_description') as string)?.trim() || null;

  if (!title) {
    return { success: false, error: 'Judul artikel wajib diisi.' };
  }
  if (!type || !['BERITA', 'GAGASAN'].includes(type)) {
    return { success: false, error: 'Tipe artikel wajib BERITA atau GAGASAN.' };
  }
  if (!content) {
    return { success: false, error: 'Isi lengkap artikel wajib diisi.' };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const isAvailable = await isArticleSlugAvailable(slug);
  if (!isAvailable) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  try {
    const newArticle = await createArticle({
      title,
      slug,
      type,
      excerpt,
      content,
      cover_image_url: coverImageUrl,
      category,
      author,
      published_at: publishedAt,
      status,
      featured,
      related_activity_id: relatedActivityId,
      seo_title: seoTitle,
      seo_description: seoDescription,
    });

    revalidateAllArticlePaths(newArticle.slug);
    return { success: true, articleId: newArticle.id, slug: newArticle.slug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat artikel.';
    return { success: false, error: message };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const type = (formData.get('type') as ArticleType) || 'BERITA';
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim();
  const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
  const category = (formData.get('category') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || 'Rahmat Ichwan Bahtiar';
  const publishedAt = (formData.get('published_at') as string)?.trim() || null;
  const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const relatedActivityId = (formData.get('related_activity_id') as string)?.trim() || null;
  const seoTitle = (formData.get('seo_title') as string)?.trim() || null;
  const seoDescription = (formData.get('seo_description') as string)?.trim() || null;

  if (!title) {
    return { success: false, error: 'Judul artikel wajib diisi.' };
  }
  if (!content) {
    return { success: false, error: 'Isi artikel tidak boleh kosong.' };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const isAvailable = await isArticleSlugAvailable(slug, id);
  if (!isAvailable) {
    return { success: false, error: `Slug "${slug}" sudah digunakan oleh artikel lain.` };
  }

  try {
    const updated = await updateArticle(id, {
      title,
      slug,
      type,
      excerpt,
      content,
      cover_image_url: coverImageUrl,
      category,
      author,
      published_at: publishedAt,
      status,
      featured,
      related_activity_id: relatedActivityId,
      seo_title: seoTitle,
      seo_description: seoDescription,
    });

    revalidateAllArticlePaths(updated.slug);
    return { success: true, articleId: updated.id, slug: updated.slug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui artikel.';
    return { success: false, error: message };
  }
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();

  try {
    const success = await deleteArticle(id);
    if (!success) {
      return { success: false, error: 'Artikel tidak ditemukan atau gagal dihapus.' };
    }

    revalidateAllArticlePaths();
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus artikel.';
    return { success: false, error: message };
  }
}

export async function toggleArticleStatusAction(id: string, newStatus: ContentStatus) {
  await requireAdmin();

  try {
    const updated = await updateArticle(id, { status: newStatus });
    revalidateAllArticlePaths(updated.slug);
    return { success: true, status: updated.status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah status artikel.';
    return { success: false, error: message };
  }
}

export async function toggleArticleFeaturedAction(id: string, featured: boolean) {
  await requireAdmin();

  try {
    const updated = await updateArticle(id, { featured });
    revalidateAllArticlePaths(updated.slug);
    return { success: true, featured: updated.featured };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui status unggulan.';
    return { success: false, error: message };
  }
}
