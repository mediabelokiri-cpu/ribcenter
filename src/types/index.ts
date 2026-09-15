/**
 * Common shared TypeScript definitions.
 */

export interface NavItem {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteMeta {
  title: string;
  description: string;
  url: string;
  author: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export * from './database';
