import { supabase } from './supabase'

/**
 * Complete Database Verification Script
 * Check if all tables and data exist in Supabase
 */

export const verifyDatabase = async () => {
  console.log('🔍 VERIFICACIÓN COMPLETA DE BASE DE DATOS')
  console.log('═══════════════════════════════════════════════════════════')

  const results = {}

  try {
    // 1. Check Customers
    console.log('\n📋 Verificando CLIENTES...')
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
    
    if (customersError) {
      console.log('❌ Error:', customersError.message)
      results.customers = { status: 'ERROR', count: 0, error: customersError.message }
    } else {
      console.log(`✅ ${customers?.length || 0} clientes encontrados`)
      results.customers = { status: 'OK', count: customers?.length || 0, data: customers }
    }

    // 2. Check Categories
    console.log('\n📋 Verificando CATEGORÍAS...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    
    if (categoriesError) {
      console.log('❌ Error:', categoriesError.message)
      results.categories = { status: 'ERROR', count: 0, error: categoriesError.message }
    } else {
      console.log(`✅ ${categories?.length || 0} categorías encontradas`)
      results.categories = { status: 'OK', count: categories?.length || 0, data: categories }
    }

    // 3. Check Products
    console.log('\n📋 Verificando PRODUCTOS...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) {
      console.log('❌ Error:', productsError.message)
      results.products = { status: 'ERROR', count: 0, error: productsError.message }
    } else {
      console.log(`✅ ${products?.length || 0} productos encontrados`)
      results.products = { status: 'OK', count: products?.length || 0, data: products }
    }

    // 4. Check Sales
    console.log('\n📋 Verificando VENTAS...')
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
    
    if (salesError) {
      console.log('❌ Error:', salesError.message)
      results.sales = { status: 'ERROR', count: 0, error: salesError.message }
    } else {
      console.log(`✅ ${sales?.length || 0} ventas encontradas`)
      results.sales = { status: 'OK', count: sales?.length || 0, data: sales }
    }

    // 5. Check Sales Details
    console.log('\n📋 Verificando DETALLES DE VENTAS...')
    const { data: salesDetails, error: salesDetailsError } = await supabase
      .from('sales_details')
      .select('*')
    
    if (salesDetailsError) {
      console.log('❌ Error:', salesDetailsError.message)
      results.salesDetails = { status: 'ERROR', count: 0, error: salesDetailsError.message }
    } else {
      console.log(`✅ ${salesDetails?.length || 0} detalles encontrados`)
      results.salesDetails = { status: 'OK', count: salesDetails?.length || 0, data: salesDetails }
    }

    // 6. Check Stock Movements
    console.log('\n📋 Verificando MOVIMIENTOS DE STOCK...')
    const { data: stockMovements, error: stockError } = await supabase
      .from('stock_movements')
      .select('*')
    
    if (stockError) {
      console.log('❌ Error:', stockError.message)
      results.stockMovements = { status: 'ERROR', count: 0, error: stockError.message }
    } else {
      console.log(`✅ ${stockMovements?.length || 0} movimientos encontrados`)
      results.stockMovements = { status: 'OK', count: stockMovements?.length || 0 }
    }

    // 7. Check Suppliers
    console.log('\n📋 Verificando PROVEEDORES...')
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('*')
    
    if (suppliersError) {
      console.log('❌ Error:', suppliersError.message)
      results.suppliers = { status: 'ERROR', count: 0, error: suppliersError.message }
    } else {
      console.log(`✅ ${suppliers?.length || 0} proveedores encontrados`)
      results.suppliers = { status: 'OK', count: suppliers?.length || 0, data: suppliers }
    }

    // 8. Check Users
    console.log('\n📋 Verificando USUARIOS...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    if (usersError) {
      console.log('❌ Error:', usersError.message)
      results.users = { status: 'ERROR', count: 0, error: usersError.message }
    } else {
      console.log(`✅ ${users?.length || 0} usuarios encontrados`)
      results.users = { status: 'OK', count: users?.length || 0 }
    }

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('📊 RESUMEN GENERAL')
    console.log('═══════════════════════════════════════════════════════════')

    // Summary
    let totalOk = 0
    let totalError = 0
    let totalRecords = 0

    for (const [table, result] of Object.entries(results)) {
      if (result.status === 'OK') {
        console.log(`✅ ${table.toUpperCase()}: ${result.count} registros`)
        totalOk++
        totalRecords += result.count
      } else {
        console.log(`❌ ${table.toUpperCase()}: ERROR`)
        totalError++
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log(`✅ Tablas OK: ${totalOk}/8`)
    console.log(`❌ Tablas con ERROR: ${totalError}/8`)
    console.log(`📊 Total de registros: ${totalRecords}`)
    console.log('═══════════════════════════════════════════════════════════')

    return results

  } catch (error) {
    console.error('❌ Error general:', error)
    return null
  }
}

/**
 * Check for missing data
 */
export const checkMissingData = async () => {
  console.log('\n🔎 VERIFICACIÓN DE DATOS FALTANTES')
  console.log('═══════════════════════════════════════════════════════════\n')

  try {
    // 1. Check if customers have no data
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
    
    if (!customers || customers.length === 0) {
      console.log('⚠️  FALTA: No hay clientes registrados')
      console.log('   Solución: Importa database.sql en Supabase')
    } else {
      console.log(`✅ Clientes: ${customers.length} registrados`)
    }

    // 2. Check if products have no data
    const { data: products } = await supabase
      .from('products')
      .select('*')
    
    if (!products || products.length === 0) {
      console.log('⚠️  FALTA: No hay productos registrados')
      console.log('   Solución: Importa database.sql en Supabase')
    } else {
      console.log(`✅ Productos: ${products.length} registrados`)
    }

    // 3. Check if categories have no data
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
    
    if (!categories || categories.length === 0) {
      console.log('⚠️  FALTA: No hay categorías registradas')
      console.log('   Solución: Importa database.sql en Supabase')
    } else {
      console.log(`✅ Categorías: ${categories.length} registradas`)
    }

    // 4. Check if products have categories
    if (products && products.length > 0) {
      const productsWithoutCategory = products.filter(p => !p.category_id)
      if (productsWithoutCategory.length > 0) {
        console.log(`⚠️  FALTA: ${productsWithoutCategory.length} productos sin categoría`)
      }
    }

    // 5. Check if products have prices
    if (products && products.length > 0) {
      const productsWithoutPrice = products.filter(p => !p.unit_price || p.unit_price === 0)
      if (productsWithoutPrice.length > 0) {
        console.log(`⚠️  FALTA: ${productsWithoutPrice.length} productos sin precio`)
      }
    }

    // 6. Check suppliers
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('*')
    
    if (!suppliers || suppliers.length === 0) {
      console.log('ℹ️  Información: No hay proveedores registrados (opcional)')
    }

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('✅ Verificación completada')
    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Export for use in components
export const checkSupabaseStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('count', { count: 'exact' })
      .limit(0)
    
    if (error) {
      return {
        connected: false,
        error: error.message,
        message: 'No se pudo conectar a Supabase. Verifica las credenciales.'
      }
    }
    
    return {
      connected: true,
      error: null,
      message: 'Conectado a Supabase'
    }
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      message: 'Error de conexión'
    }
  }
}
