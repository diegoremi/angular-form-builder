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

// Get environment variables from Vercel or use defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('🔍 Checking environment variables...');
console.log('SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Missing required environment variables!');
  console.error('Please configure the following variables in Vercel:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_ANON_KEY');
  console.error('\nSee VERCEL_SETUP.md for instructions.');
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
