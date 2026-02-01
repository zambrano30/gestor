#!/usr/bin/env node

/**
 * Copy Database SQL to Clipboard
 * Usage: node scripts/copy-sql.js
 */

const fs = require('fs');
const path = require('path');
const clipboardy = require('clipboardy');

async function copySQLToClipboard() {
  try {
    const sqlPath = path.join(__dirname, '../database.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ database.sql not found');
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Copiando database.sql al portapapeles...');
    console.log(`   Tamaño: ${(sqlContent.length / 1024).toFixed(2)} KB`);
    
    try {
      await clipboardy.write(sqlContent);
      console.log('✅ SQL copiado al portapapeles!');
      console.log('\n📝 Próximos pasos:');
      console.log('   1. Ve a: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new');
      console.log('   2. Pega el contenido (Ctrl + V)');
      console.log('   3. Haz clic en RUN');
      console.log('   4. ¡Listo!');
    } catch (err) {
      console.log('⚠️  No se pudo copiar al portapapeles automáticamente');
      console.log('   Copia el contenido manualmente desde database.sql');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

copySQLToClipboard();
