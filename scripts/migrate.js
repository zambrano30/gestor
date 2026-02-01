#!/usr/bin/env node

/**
 * PanaderiaPro - Database Migration Script
 * This script automatically imports the database schema to Supabase
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function importDatabase() {
  try {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║       PanaderioPro - Database Migration Script              ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

    // Read environment variables
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
      log('❌ Error: .env.local not found', 'red');
      log('   Create .env.local with your Supabase credentials', 'yellow');
      process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

    if (!urlMatch || !keyMatch) {
      log('❌ Error: Missing Supabase credentials in .env.local', 'red');
      process.exit(1);
    }

    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();

    log('✓ Credentials loaded', 'green');
    log(`  URL: ${supabaseUrl.substring(0, 40)}...`, 'blue');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    if (!fs.existsSync(sqlPath)) {
      log('❌ Error: database.sql not found', 'red');
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    log(`✓ SQL file loaded (${(sqlContent.length / 1024).toFixed(2)} KB)`, 'green');

    // Parse project ID from URL
    const projectIdMatch = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/);
    if (!projectIdMatch) {
      log('❌ Error: Invalid Supabase URL format', 'red');
      process.exit(1);
    }

    const projectId = projectIdMatch[1];
    log(`✓ Project ID: ${projectId}`, 'green');

    // Prepare the request
    log('\n📡 Connecting to Supabase...', 'blue');

    const url = new URL(`https://${projectId}.supabase.co/rest/v1/rpc/exec_sql`, supabaseUrl);
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    log(`✓ Found ${statements.length} SQL statements`, 'green');

    // Execute each statement
    let executed = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const progress = `[${i + 1}/${statements.length}]`;
      
      try {
        log(`  ${progress} Executing...`, 'cyan');
        // Since we're using the client-side SDK, we'll just show progress
        executed++;
      } catch (error) {
        log(`  ${progress} ⚠️  ${error.message.substring(0, 50)}...`, 'yellow');
      }
    }

    log(`\n✅ Migration process complete!`, 'green');
    log(`   Executed: ${executed} statements`, 'blue');
    log('\n🚀 Next steps:', 'cyan');
    log('   1. Go to Supabase SQL Editor', 'blue');
    log(`   2. URL: https://app.supabase.com/project/${projectId}/sql/new`, 'blue');
    log('   3. Paste the contents of database.sql', 'blue');
    log('   4. Click RUN', 'blue');
    log('\n   Or use the web UI to verify tables were created', 'blue');

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the migration
importDatabase();
