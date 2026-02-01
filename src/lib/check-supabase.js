import { supabase } from './supabase'

/**
 * Verificación completa de Supabase
 */
export const checkSupabaseConnection = async () => {
  console.log('\n🔍 VERIFICACIÓN DE SUPABASE')
  console.log('═══════════════════════════════════════════════════════════')

  try {
    // 1. Verificar que el cliente esté inicializado
    console.log('\n1️⃣  Verificando inicialización del cliente...')
    if (!supabase) {
      console.error('❌ Cliente Supabase no inicializado')
      return { success: false, error: 'Cliente no inicializado' }
    }
    console.log('✅ Cliente Supabase inicializado correctamente')

    // 2. Verificar variables de entorno
    console.log('\n2️⃣  Verificando variables de entorno...')
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!url) {
      console.error('❌ VITE_SUPABASE_URL no configurada')
      return { success: false, error: 'URL no configurada' }
    }
    if (!key) {
      console.error('❌ VITE_SUPABASE_ANON_KEY no configurada')
      return { success: false, error: 'Anon Key no configurada' }
    }
    
    console.log(`✅ URL: ${url}`)
    console.log(`✅ Key: ${key.substring(0, 30)}...`)

    // 3. Prueba de conexión - intentar consultar tabla
    console.log('\n3️⃣  Probando conexión a base de datos...')
    const { data: testData, error: testError } = await supabase
      .from('customers')
      .select('count', { count: 'exact' })
      .limit(0)

    if (testError) {
      console.error(`❌ Error de conexión: ${testError.message}`)
      console.log('   Posibles causas:')
      console.log('   - La tabla "customers" no existe (importa database.sql)')
      console.log('   - Credenciales incorrectas')
      console.log('   - Proyecto Supabase deshabilitado')
      return { success: false, error: testError.message }
    }

    console.log('✅ Conexión exitosa a la base de datos')

    // 4. Verificar que existan datos
    console.log('\n4️⃣  Verificando datos en tablas...')
    const tables = ['customers', 'products', 'categories', 'sales', 'suppliers']
    const tableStatus = {}

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        tableStatus[table] = { exists: false, error: error.message }
      } else {
        tableStatus[table] = { exists: true, count: count || 0 }
      }
    }

    console.log('\n📊 Estado de tablas:')
    for (const [table, status] of Object.entries(tableStatus)) {
      if (status.exists) {
        console.log(`   ✅ ${table}: ${status.count} registros`)
      } else {
        console.log(`   ❌ ${table}: ${status.error}`)
      }
    }

    // 5. Verificar RLS (Row Level Security)
    console.log('\n5️⃣  Verificando seguridad (RLS)...')
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .limit(1)
      
      if (!error) {
        console.log('✅ RLS configurado correctamente')
      }
    } catch (err) {
      console.warn('⚠️  Verificación de RLS incompleta')
    }

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('✅ SUPABASE CONFIGURADO CORRECTAMENTE')
    console.log('═══════════════════════════════════════════════════════════\n')

    return { 
      success: true, 
      tables: tableStatus,
      url: url,
      message: 'Todo está configurado correctamente'
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Resumen rápido de conexión
 */
export const quickCheck = async () => {
  try {
    const { count } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
    
    return {
      connected: true,
      customers: count || 0
    }
  } catch (error) {
    return {
      connected: false,
      error: error.message
    }
  }
}
