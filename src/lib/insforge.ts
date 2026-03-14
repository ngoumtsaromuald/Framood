import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL as string;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY as string;

if (!insforgeUrl || !insforgeAnonKey) {
  throw new Error(
    'Missing Insforge environment variables. Check your .env.local file.'
  );
}

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});
