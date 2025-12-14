/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL?: string; // Optional - defaults to http://192.168.1.96:8051/api
  readonly PUBLIC_SITE_NAME?: string; // Optional - site name for multi-tenant API (e.g., "soundboardgo")
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

