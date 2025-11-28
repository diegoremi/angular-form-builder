/**
 * Environment configuration template for development
 *
 * Copy this file to environment.ts and fill in your Supabase credentials
 * File: cp environment.template.ts environment.ts
 */
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
};
