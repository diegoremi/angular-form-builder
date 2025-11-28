#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '..', 'src', 'environments');
const envFile = path.join(envDir, 'environment.ts');

// Get environment variables from Vercel or use defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Check if environment file already exists (local development)
if (fs.existsSync(envFile)) {
  console.log('✓ Environment file already exists, skipping generation');
  process.exit(0);
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
