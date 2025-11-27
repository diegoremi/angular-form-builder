/**
 * Environment configuration template for development
 *
 * INSTRUCTIONS:
 * 1. Copy this file to environment.ts
 * 2. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your actual values
 * 3. Get these values from: Supabase Dashboard > Settings > API
 */
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
  }
};
