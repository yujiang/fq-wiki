/// <reference types="vite/client" />

interface ImportMetaEnv {
//  DEV: boolean;
//  SSR: boolean;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }
