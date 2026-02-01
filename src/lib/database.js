import { supabase } from './supabase'

// ========== CUSTOMERS ==========

export const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('active', true)
  
  if (error) console.error('Error fetching customers:', error)
  return data || []
}

export const addCustomer = async (customer) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
  
  if (error) console.error('Error adding customer:', error)
  return data ? data[0] : null
}

// ========== PRODUCTS ==========

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      unit_price,
      stock,
      minimum_stock,
      sku,
      category_id,
      categories(name)
    `)
    .eq('active', true)
  
  if (error) console.error('Error fetching products:', error)
  return data || []
}

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) console.error('Error fetching product:', error)
  return data
}

export const updateProductStock = async (productId, newStock) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()
  
  if (error) console.error('Error updating stock:', error)
  return data ? data[0] : null
}

// ========== SALES ==========

export const fetchSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      id,
      sale_number,
      sale_date,
      total,
      status,
      payment_method,
      customers(name),
      sales_details(quantity, unit_price, products(name))
    `)
    .order('sale_date', { ascending: false })
  
  if (error) console.error('Error fetching sales:', error)
  return data || []
}

export const createSale = async (saleData, salesDetails) => {
  try {
    // Create sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([saleData])
      .select()
    
    if (saleError) throw saleError
    
    const saleId = sale[0].id
    
    // Create sales details
    if (salesDetails && salesDetails.length > 0) {
      const detailsWithSaleId = salesDetails.map(detail => ({
        ...detail,
        sale_id: saleId
      }))
      
      const { error: detailsError } = await supabase
        .from('sales_details')
        .insert(detailsWithSaleId)
      
      if (detailsError) throw detailsError
    }
    
    return sale[0]
  } catch (error) {
    console.error('Error creating sale:', error)
    return null
  }
}

export const updateSaleStatus = async (saleId, status) => {
  const { data, error } = await supabase
    .from('sales')
    .update({ status })
    .eq('id', saleId)
    .select()
  
  if (error) console.error('Error updating sale status:', error)
  return data ? data[0] : null
}

// ========== CATEGORIES ==========

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) console.error('Error fetching categories:', error)
  return data || []
}

// ========== STOCK MOVEMENTS ==========

export const addStockMovement = async (movement) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .insert([movement])
    .select()
  
  if (error) console.error('Error adding stock movement:', error)
  return data ? data[0] : null
}

export const fetchStockMovements = async (productId = null) => {
  let query = supabase
    .from('stock_movements')
    .select(`
      id,
      movement_type,
      quantity,
      created_at,
      products(name),
      notes
    `)
    .order('created_at', { ascending: false })
  
  if (productId) {
    query = query.eq('product_id', productId)
  }
  
  const { data, error } = await query
  
  if (error) console.error('Error fetching stock movements:', error)
  return data || []
}

// ========== SUPPLIERS ==========

export const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('active', true)
    .order('name')
  
  if (error) console.error('Error fetching suppliers:', error)
  return data || []
}

export const addSupplier = async (supplier) => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
  
  if (error) console.error('Error adding supplier:', error)
  return data ? data[0] : null
}

// ========== EXPENSES ==========

export const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })
  
  if (error) console.error('Error fetching expenses:', error)
  return data || []
}

export const addExpense = async (expense) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
  
  if (error) console.error('Error adding expense:', error)
  return data ? data[0] : null
}

// ========== PURCHASES ==========

export const createPurchase = async (purchaseData, purchaseDetails) => {
  try {
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select()
    
    if (purchaseError) throw purchaseError
    
    const purchaseId = purchase[0].id
    
    const detailsWithPurchaseId = purchaseDetails.map(detail => ({
      ...detail,
      purchase_id: purchaseId
    }))
    
    const { error: detailsError } = await supabase
      .from('purchases_details')
      .insert(detailsWithPurchaseId)
    
    if (detailsError) throw detailsError
    
    return purchase[0]
  } catch (error) {
    console.error('Error creating purchase:', error)
    return null
  }
}

export const fetchPurchases = async () => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      id,
      purchase_number,
      purchase_date,
      total,
      status,
      suppliers(name),
      purchases_details(quantity, unit_price, products(name))
    `)
    .order('purchase_date', { ascending: false })
  
  if (error) console.error('Error fetching purchases:', error)
  return data || []
}

// ========== REPORTS ==========

export const fetchDailyReports = async (startDate = null, endDate = null) => {
  let query = supabase
    .from('daily_reports')
    .select('*')
    .order('report_date', { ascending: false })
  
  if (startDate) {
    query = query.gte('report_date', startDate)
  }
  
  if (endDate) {
    query = query.lte('report_date', endDate)
  }
  
  const { data, error } = await query
  
  if (error) console.error('Error fetching daily reports:', error)
  return data || []
}

export const updateDailyReport = async (reportDate, updates) => {
  const { data, error } = await supabase
    .from('daily_reports')
    .update(updates)
    .eq('report_date', reportDate)
    .select()
  
  if (error) console.error('Error updating daily report:', error)
  return data ? data[0] : null
}

// ========== VIEWS ==========

export const fetchLatestSales = async () => {
  const { data, error } = await supabase
    .from('latest_sales')
    .select('*')
    .limit(10)
  
  if (error) console.error('Error fetching latest sales:', error)
  return data || []
}

export const fetchCurrentStock = async () => {
  const { data, error } = await supabase
    .from('current_stock')
    .select('*')
  
  if (error) console.error('Error fetching current stock:', error)
  return data || []
}

export const fetchSalesByCategory = async () => {
  const { data, error } = await supabase
    .from('sales_by_category')
    .select('*')
  
  if (error) console.error('Error fetching sales by category:', error)
  return data || []
}
