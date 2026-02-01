import { supabase } from './supabase'

/**
 * Test connection to Supabase
 * Run this in the browser console to verify everything is working
 */

export const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase Connection...')
  
  try {
    // Test 1: Basic connection
    console.log('✓ Client initialized')
    
    // Test 2: Fetch customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(1)
    
    if (customersError) {
      console.error('❌ Customers table error:', customersError.message)
      return false
    }
    console.log('✓ Customers table accessible:', customers?.length, 'records')
    
    // Test 3: Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('❌ Products table error:', productsError.message)
      return false
    }
    console.log('✓ Products table accessible:', products?.length, 'records')
    
    // Test 4: Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError.message)
      return false
    }
    console.log('✓ Categories table accessible:', categories?.length, 'records')
    
    // Test 5: Fetch sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(1)
    
    if (salesError) {
      console.error('❌ Sales table error:', salesError.message)
      return false
    }
    console.log('✓ Sales table accessible:', sales?.length, 'records')
    
    console.log('✅ All tests passed! Database is ready to use.')
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

/**
 * Test creating a new customer
 */
export const testAddCustomer = async (name) => {
  try {
    console.log('🧪 Testing add customer...')
    
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: name || 'Test Customer',
        email: `test-${Date.now()}@example.com`,
        phone: '1234567890'
      }])
      .select()
    
    if (error) {
      console.error('❌ Error adding customer:', error)
      return null
    }
    
    console.log('✅ Customer created:', data[0])
    return data[0]
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return null
  }
}

/**
 * Test creating a new sale
 */
export const testCreateSale = async (customerId, productId) => {
  try {
    console.log('🧪 Testing create sale...')
    
    // First get the product to know the price
    const { data: product } = await supabase
      .from('products')
      .select('unit_price')
      .eq('id', productId)
      .single()
    
    if (!product) {
      console.error('❌ Product not found')
      return null
    }
    
    // Create sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        customer_id: customerId,
        sale_number: `TEST-${Date.now()}`,
        sale_date: new Date().toISOString().split('T')[0],
        total: product.unit_price * 2,
        status: 'completed',
        payment_method: 'test'
      }])
      .select()
    
    if (saleError) {
      console.error('❌ Error creating sale:', saleError)
      return null
    }
    
    console.log('✅ Sale created:', sale[0])
    return sale[0]
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return null
  }
}

/**
 * Show all available test functions
 */
export const showTestMenu = () => {
  console.clear()
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              PANADERIA PRO - TEST FUNCTIONS                    ║
╚════════════════════════════════════════════════════════════════╝

Available test functions (run in browser console):

1. testSupabaseConnection()
   → Tests if all tables are accessible
   → Use this first!

2. testAddCustomer('Name')
   → Creates a test customer
   → Example: testAddCustomer('Juan Pérez')

3. testCreateSale(customerId, productId)
   → Creates a test sale
   → You need customer and product IDs

Example flow:
  1. testSupabaseConnection()          // Check everything
  2. testAddCustomer('Test Customer')  // Create a customer
  3. testCreateSale(customerId, productId)  // Create a sale

Import these functions in your component:
  import { testSupabaseConnection } from '../lib/database'
  
Then in console, run:
  testSupabaseConnection()

═══════════════════════════════════════════════════════════════════
  `)
}

// Auto show menu when imported
if (typeof window !== 'undefined') {
  console.log('📝 Type: showTestMenu() in the console to see available tests')
}
