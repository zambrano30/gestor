#!/usr/bin/env node

/**
 * Print Expenses Migration SQL
 * Usage: node scripts/print-expenses-sql.cjs
 */

const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '../expenses-migration.sql');

if (!fs.existsSync(sqlPath)) {
  console.error('❌ expenses-migration.sql no encontrado');
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('\n===== EXPENSES MIGRATION SQL =====\n');
console.log(sqlContent.trim());
console.log('\n===== FIN =====\n');

console.log('📝 Copia lo anterior y ejecútalo en Supabase SQL Editor:');
console.log('   https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new');
