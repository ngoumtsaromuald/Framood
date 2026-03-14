/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSFORGE_URL: string;
  readonly VITE_INSFORGE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_ANTHROPIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
