#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '..', 'src', 'environments');
const envFile = path.join(envDir, 'environment.ts');

// Check if environment file already exists (local development)
if (fs.existsSync(envFile)) {
  console.log('✓ Environment file already exists, skipping generation');
  process.exit(0);
}

// Get environment variables from Vercel with multiple possible names
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

console.log('🔍 Generating environment.ts for production build...');
console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
console.log('SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✓ Found (length: ' + supabaseKey.length + ')' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Missing required environment variables!');
  console.error('Please configure the following variables in Vercel:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_ANON_KEY');
  console.error('\nSee VERCEL_SETUP.md for instructions.');
  console.error('\nDEBUG: All env vars:', Object.keys(process.env).join(', '));
  process.exit(1);
}

// Create environments directory if it doesn't exist
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Generate environment.ts content
const content = `/**
 * Auto-generated environment configuration
 * Generated at build time from environment variables
 */
export const environment = {
  production: true,
  supabase: {
    url: '${supabaseUrl}',
    anonKey: '${supabaseKey}',
  },
};
`;

// Write the file
fs.writeFileSync(envFile, content, 'utf8');
console.log('✓ Generated environment.ts from environment variables');
