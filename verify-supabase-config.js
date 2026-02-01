#!/usr/bin/env node

/**
 * Script de Verificación de Supabase
 * Uso: node verify-supabase-config.js
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

console.clear()
console.log('\n🔍 VERIFICADOR DE CONFIGURACIÓN SUPABASE')
console.log('═══════════════════════════════════════════════════════════\n')

// 1. Verificar archivo .env.local
console.log('1️⃣  Verificando archivo .env.local...')
const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local NO ENCONTRADO')
  console.log('   Crea el archivo con tus credenciales de Supabase\n')
  process.exit(1)
}

console.log('✅ Archivo .env.local encontrado\n')

// 2. Leer variables de entorno
console.log('2️⃣  Leyendo variables de entorno...')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=')
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const url = envVars.VITE_SUPABASE_URL
const key = envVars.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.log('❌ Faltan variables de entorno requeridas')
  console.log('   El .env.local debe contener:')
  console.log('   - VITE_SUPABASE_URL')
  console.log('   - VITE_SUPABASE_ANON_KEY\n')
  process.exit(1)
}

console.log(`✅ URL: ${url}`)
console.log(`✅ Key: ${key.substring(0, 30)}...\n`)

// 3. Crear cliente Supabase
console.log('3️⃣  Creando cliente Supabase...')
const supabase = createClient(url, key)

if (!supabase) {
  console.log('❌ Error al crear cliente Supabase\n')
  process.exit(1)
}

console.log('✅ Cliente Supabase creado\n')

// 4. Probar conexión
console.log('4️⃣  Probando conexión a base de datos...')

try {
  const { count, error } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.log(`❌ Error: ${error.message}`)
    
    if (error.message.includes('does not exist') || error.message.includes('no existe')) {
      console.log('\n💡 Las tablas no existen. Necesitas importar database.sql')
      console.log('   Ve a: https://app.supabase.com')
      console.log('   1. Selecciona tu proyecto')
      console.log('   2. SQL Editor → New Query')
      console.log('   3. Copia el contenido de database.sql')
      console.log('   4. Pégalo y ejecuta (RUN)\n')
    }
    process.exit(1)
  }

  console.log(`✅ Conexión exitosa`)
  console.log(`   Clientes en base de datos: ${count}\n`)

} catch (error) {
  console.log(`❌ Error: ${error.message}\n`)
  process.exit(1)
}

// 5. Verificar tablas principales
console.log('5️⃣  Verificando tablas...')
const tables = ['customers', 'products', 'categories', 'sales', 'suppliers']
let tableErrors = 0

for (const table of tables) {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`)
      tableErrors++
    } else {
      console.log(`   ✅ ${table}: ${count} registros`)
    }
  } catch (err) {
    console.log(`   ❌ ${table}: ${err.message}`)
    tableErrors++
  }
}

console.log('')

if (tableErrors > 0) {
  console.log(`⚠️  ${tableErrors} tabla(s) con error. Importa database.sql en Supabase.\n`)
} else {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('✅ SUPABASE CONFIGURADO CORRECTAMENTE')
  console.log('═══════════════════════════════════════════════════════════\n')
}
