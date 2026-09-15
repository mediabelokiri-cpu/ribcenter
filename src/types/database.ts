/**
 * Database Types Definition Placeholder
 * 
 * Outlines the architectural direction of the database entities planned for future phases:
 * - site_settings
 * - homepage_sections
 * - profile
 * - timeline
 * - organizations
 * - activities
 * - activity_categories
 * - articles
 * - media
 * - albums
 * - aspirations
 * - admin_users
 * - audit_logs
 * 
 * The actual database schema and Supabase generated types will be established in:
 * PHASE 1 — DATABASE & CMS FOUNDATION.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          is_active?: boolean;
          order_index?: number;
          content?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          is_active?: boolean;
          order_index?: number;
          content?: Json;
          updated_at?: string;
        };
      };
      profile: {
        Row: {
          id: string;
          full_name: string;
          title: string;
          bio: string;
          vision: string;
          mission: string;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          title: string;
          bio: string;
          vision: string;
          mission: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          title?: string;
          bio?: string;
          vision?: string;
          mission?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      timeline: {
        Row: {
          id: string;
          year: number;
          title: string;
          description: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          title: string;
          description: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          title?: string;
          description?: string;
          category?: string;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          organization_name: string;
          role: string;
          period_start: string;
          period_end: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          role: string;
          period_start: string;
          period_end?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_name?: string;
          role?: string;
          period_start?: string;
          period_end?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          title: string;
          slug: string;
          date: string;
          category_id: string | null;
          location: string | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          date: string;
          category_id?: string | null;
          location?: string | null;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          date?: string;
          category_id?: string | null;
          location?: string | null;
          description?: string;
          created_at?: string;
        };
      };
      activity_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          published_at: string | null;
          status: 'draft' | 'published';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image?: string | null;
          published_at?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          published_at?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          url: string;
          file_name: string;
          file_type: string;
          file_size: number;
          album_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          file_name: string;
          file_type: string;
          file_size: number;
          album_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          album_id?: string | null;
          created_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_media_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
        };
      };
      aspirations: {
        Row: {
          id: string;
          sender_name: string;
          sender_contact: string;
          subject: string;
          message: string;
          status: 'pending' | 'reviewed' | 'addressed';
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_name: string;
          sender_contact: string;
          subject: string;
          message: string;
          status?: 'pending' | 'reviewed' | 'addressed';
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_name?: string;
          sender_contact?: string;
          subject?: string;
          message?: string;
          status?: 'pending' | 'reviewed' | 'addressed';
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          target_entity?: string;
          target_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}
