/**
 * Supabase Database TypeScript Definitions
 * Aligned with PostgreSQL migrations (00001_initial_schema.sql)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ActivityType = 'REKAM_KERJA' | 'PROGRAM' | 'KEGIATAN' | 'RESES';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ArticleType = 'BERITA' | 'GAGASAN';
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';
export type AspirationStatus =
  | 'BARU'
  | 'DITINJAU'
  | 'DALAM_TINDAK_LANJUT'
  | 'SELESAI'
  | 'INFORMASI_DIBERIKAN';
export type TimelineCategory =
  | 'PENDIDIKAN'
  | 'KARIER'
  | 'ORGANISASI'
  | 'POLITIK'
  | 'LAINNYA';

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          is_active: boolean;
          order_index: number;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          is_active?: boolean;
          order_index?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          is_active?: boolean;
          order_index?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      profile: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          title: string;
          photo_url: string | null;
          biography: string | null;
          education: Json;
          vision: string | null;
          mission: string | null;
          social_links: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_name: string;
          title: string;
          photo_url?: string | null;
          biography?: string | null;
          education?: Json;
          vision?: string | null;
          mission?: string | null;
          social_links?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_name?: string;
          title?: string;
          photo_url?: string | null;
          biography?: string | null;
          education?: Json;
          vision?: string | null;
          mission?: string | null;
          social_links?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      timeline: {
        Row: {
          id: string;
          year_start: number;
          year_end: number | null;
          title: string;
          description: string;
          category: TimelineCategory;
          image_url: string | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          year_start: number;
          year_end?: number | null;
          title: string;
          description: string;
          category: TimelineCategory;
          image_url?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          year_start?: number;
          year_end?: number | null;
          title?: string;
          description?: string;
          category?: TimelineCategory;
          image_url?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          organization_name: string;
          role: string;
          description: string | null;
          period_start: string;
          period_end: string | null;
          logo_url: string | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          role: string;
          description?: string | null;
          period_start: string;
          period_end?: string | null;
          logo_url?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_name?: string;
          role?: string;
          description?: string | null;
          period_start?: string;
          period_end?: string | null;
          logo_url?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          title: string;
          slug: string;
          type: ActivityType;
          category_id: string | null;
          date: string;
          location: string | null;
          regency: string | null;
          district: string | null;
          summary: string | null;
          description: string;
          beneficiaries: number;
          status: ContentStatus;
          featured: boolean;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          type: ActivityType;
          category_id?: string | null;
          date: string;
          location?: string | null;
          regency?: string | null;
          district?: string | null;
          summary?: string | null;
          description: string;
          beneficiaries?: number;
          status?: ContentStatus;
          featured?: boolean;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          type?: ActivityType;
          category_id?: string | null;
          date?: string;
          location?: string | null;
          regency?: string | null;
          district?: string | null;
          summary?: string | null;
          description?: string;
          beneficiaries?: number;
          status?: ContentStatus;
          featured?: boolean;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          type: ArticleType;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          category: string | null;
          author: string;
          published_at: string | null;
          status: ContentStatus;
          featured: boolean;
          related_activity_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          type: ArticleType;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          category?: string | null;
          author?: string;
          published_at?: string | null;
          status?: ContentStatus;
          featured?: boolean;
          related_activity_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          type?: ArticleType;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          category?: string | null;
          author?: string;
          published_at?: string | null;
          status?: ContentStatus;
          featured?: boolean;
          related_activity_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_url: string | null;
          featured: boolean;
          order_index: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image_url?: string | null;
          featured?: boolean;
          order_index?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image_url?: string | null;
          featured?: boolean;
          order_index?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          album_id: string | null;
          file_url: string;
          media_type: MediaType;
          title: string | null;
          alt_text: string | null;
          caption: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id?: string | null;
          file_url: string;
          media_type: MediaType;
          title?: string | null;
          alt_text?: string | null;
          caption?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string | null;
          file_url?: string;
          media_type?: MediaType;
          title?: string | null;
          alt_text?: string | null;
          caption?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      aspirations: {
        Row: {
          id: string;
          name: string;
          contact: string;
          regency: string | null;
          district: string | null;
          category: string | null;
          subject: string;
          message: string;
          attachment_url: string | null;
          status: AspirationStatus;
          internal_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          regency?: string | null;
          district?: string | null;
          category?: string | null;
          subject: string;
          message: string;
          attachment_url?: string | null;
          status?: AspirationStatus;
          internal_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          regency?: string | null;
          district?: string | null;
          category?: string | null;
          subject?: string;
          message?: string;
          attachment_url?: string | null;
          status?: AspirationStatus;
          internal_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'ADMIN';
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'ADMIN';
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'ADMIN';
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          target_entity?: string;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
      };
    };
  };
}

// Table Row Helper Types
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];
export type Profile = Database['public']['Tables']['profile']['Row'];
export type TimelineItem = Database['public']['Tables']['timeline']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type ActivityCategory = Database['public']['Tables']['activity_categories']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
export type Album = Database['public']['Tables']['albums']['Row'];
export type MediaItem = Database['public']['Tables']['media']['Row'];
export type Aspiration = Database['public']['Tables']['aspirations']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

// Public-safe Aspiration type (strictly excludes internal_note)
export type PublicAspirationInput = Omit<
  Database['public']['Tables']['aspirations']['Insert'],
  'id' | 'status' | 'internal_note' | 'created_at' | 'updated_at'
>;
