/**
 * Environment configuration template for production
 *
 * Copy this file to environment.prod.ts and fill in your Supabase credentials
 * File: cp environment.prod.template.ts environment.prod.ts
 */
export const environment = {
  production: true,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
};
