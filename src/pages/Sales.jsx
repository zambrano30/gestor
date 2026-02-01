import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Wallet, ArrowLeft, Save, Receipt, Menu, ShoppingCart, Loader, Users } from 'lucide-react';
import { fetchSales, fetchProducts, fetchCustomers, createSale, fetchLatestSales, addCustomer, fetchExpenses, addExpense } from '../lib/database';

const SalesApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ total: 0, sales: 0, expenses: 0 });
  const [salesList, setSalesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [newSale, setNewSale] = useState({
    productId: '',
    customerId: '',
    quantity: 1,
    unitPrice: 0,
    isFreeSale: false,
    freeAmount: '',
    freeDescription: ''
  });
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [salesData, productsData, customersData, expensesData] = await Promise.all([
          fetchLatestSales(),
          fetchProducts(),
          fetchCustomers(),
          fetchExpenses()
        ]);
        
        setSalesList(salesData || []);
        setProducts(productsData || []);
        setCustomers(customersData || []);
        setExpensesList(expensesData || []);
        
        // Calculate balance
        const totalSales = salesData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
        const totalExpenses = expensesData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
        setBalance({
          total: totalSales - totalExpenses,
          sales: totalSales,
          expenses: totalExpenses
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleAddSale = async (e) => {
    e.preventDefault();
    const isFreeSale = newSale.isFreeSale;

    if (isFreeSale) {
      if (!newSale.freeAmount || newSale.freeAmount <= 0) {
        alert('Por favor ingresa un monto válido para la venta libre');
        return;
      }
    } else {
      if (!newSale.productId || !newSale.customerId || !newSale.quantity) {
        alert('Por favor completa todos los campos');
        return;
      }
    }

    setLoading(true);
    try {
      const saleTotal = isFreeSale
        ? parseFloat(newSale.freeAmount) || 0
        : newSale.quantity * newSale.unitPrice;

      const saleData = {
        customer_id: newSale.customerId || null,
        sale_number: `SALE-${Date.now()}`,
        sale_date: new Date().toISOString().split('T')[0],
        total: saleTotal,
        status: 'completed',
        payment_method: 'cash',
        notes: isFreeSale
          ? (newSale.freeDescription?.trim() || 'Venta libre')
          : null
      };

      const salesDetails = !isFreeSale && newSale.productId ? [{
        product_id: newSale.productId,
        quantity: newSale.quantity,
        unit_price: newSale.unitPrice,
        subtotal: newSale.quantity * newSale.unitPrice
      }] : [];

      await createSale(saleData, salesDetails);

      // Reload sales
      const updatedSales = await fetchLatestSales();
      setSalesList(updatedSales || []);
      
      // Update balance
      const totalSales = updatedSales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
      setBalance(prev => ({
        ...prev,
        total: totalSales,
        sales: totalSales
      }));

      setNewSale({
        productId: '',
        customerId: '',
        quantity: 1,
        unitPrice: 0,
        isFreeSale: false,
        freeAmount: '',
        freeDescription: ''
      });
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Error al crear la venta');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice'
        ? parseFloat(value) || 0
        : name === 'freeAmount'
          ? (value === '' ? '' : parseFloat(value) || 0)
          : name === 'productId' || name === 'customerId'
            ? String(value)
            : value
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    if (!newCustomer.name) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }

    setLoading(true);
    try {
      const customer = await addCustomer({
        name: newCustomer.name,
        email: newCustomer.email || null,
        phone: newCustomer.phone || null,
        active: true
      });

      if (customer) {
        // Reload customers
        const updatedCustomers = await fetchCustomers();
        setCustomers(updatedCustomers || []);
        setNewCustomer({ name: '', email: '', phone: '' });
        setCurrentScreen('dashboard');
        alert('✅ Cliente agregado correctamente');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error al agregar cliente');
    }
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!newExpense.amount || newExpense.amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        amount: parseFloat(newExpense.amount),
        category: newExpense.category || null,
        description: newExpense.description || null,
        expense_date: newExpense.expenseDate
      };

      await addExpense(expenseData);

      const updatedExpenses = await fetchExpenses();
      setExpensesList(updatedExpenses || []);

      const totalExpenses = updatedExpenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      const totalSales = salesList?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
      setBalance(prev => ({
        ...prev,
        total: totalSales - totalExpenses,
        expenses: totalExpenses
      }));

      setNewExpense({
        amount: '',
        category: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      setCurrentScreen('dashboard');
      alert('✅ Gasto registrado correctamente');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error al registrar el gasto');
    }
    setLoading(false);
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: name === 'amount' ? value : value
    }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedProduct = products.find(p => String(p.id) === String(newSale.productId));
  const totalAmount = (newSale.isFreeSale
    ? (parseFloat(newSale.freeAmount) || 0)
    : (newSale.quantity * newSale.unitPrice)
  ).toFixed(2);

  if (loading && currentScreen === 'dashboard') {
    return (
      <div className="flex h-screen bg-background-dark items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Conditional Screen Rendering
  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 border-r border-gray-800 bg-background-dark flex flex-col justify-between py-6 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="flex flex-col gap-8 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center text-white">
                <ShoppingCart size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-bold leading-none">PanaderiaPro</h1>
                <p className="text-gray-400 text-xs font-normal">Gestor de Ventas</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => { setCurrentScreen('dashboard'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 transition-colors"
              >
                <Wallet size={20} />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => { setCurrentScreen('add-sale'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <PlusCircle size={20} />
                <span className="text-sm font-medium">Nueva Venta</span>
              </button>
              <button
                onClick={() => { setCurrentScreen('sales-list'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="text-sm font-medium">Historial</span>
              </button>
              <button
                onClick={() => { setCurrentScreen('add-expense'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <Receipt size={20} />
                <span className="text-sm font-medium">Registrar Gasto</span>
              </button>
              <button
                onClick={() => { setCurrentScreen('expenses-list'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <Receipt size={20} />
                <span className="text-sm font-medium">Historial de Gastos</span>
              </button>
              <button
                onClick={() => { setCurrentScreen('add-customer'); setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              >
                <Users size={20} />
                <span className="text-sm font-medium">Agregar Cliente</span>
              </button>
            </nav>
          </div>
          <div className="px-4">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Sesión iniciada como</p>
              <p className="text-sm font-semibold text-white">Panadería</p>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-40" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background-dark">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">PanaderiaPro</h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* --- DASHBOARD SCREEN --- */}
          {currentScreen === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet size={28} className="opacity-80" />
                  <span className="text-lg opacity-90">Balance Total</span>
                </div>
                <h2 className="text-5xl font-bold mb-8">${balance.total.toLocaleString()}</h2>
                
                <div className="grid grid-cols-2 gap-4 border-t border-blue-400/30 pt-6">
                  <div>
                    <p className="text-blue-100 text-sm">Ventas Totales</p>
                    <p className="text-2xl font-semibold text-green-300">+ ${balance.sales.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Gastos Totales</p>
                    <p className="text-2xl font-semibold text-red-300">- ${balance.expenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setCurrentScreen('add-sale')}
                  className="flex items-center justify-center gap-4 bg-gray-800 p-6 rounded-xl border-2 border-transparent hover:border-blue-500 shadow-md transition-all group"
                >
                  <div className="bg-blue-600/20 p-3 rounded-full text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PlusCircle size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">Nueva Venta</p>
                    <p className="text-sm text-gray-400">Registra un ingreso</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentScreen('sales-list')}
                  className="flex items-center justify-center gap-4 bg-gray-800 p-6 rounded-xl border-2 border-transparent hover:border-green-500 shadow-md transition-all group"
                >
                  <div className="bg-green-600/20 p-3 rounded-full text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <ShoppingCart size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">Historial de Ventas</p>
                    <p className="text-sm text-gray-400">Ver todas las ventas</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentScreen('add-expense')}
                  className="flex items-center justify-center gap-4 bg-gray-800 p-6 rounded-xl border-2 border-transparent hover:border-red-500 shadow-md transition-all group"
                >
                  <div className="bg-red-600/20 p-3 rounded-full text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Receipt size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">Registrar Gasto</p>
                    <p className="text-sm text-gray-400">Anota una salida</p>
                  </div>
                </button>
              </div>

              {/* Recent Sales Summary */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Últimas Ventas</h3>
                <div className="space-y-3">
                  {salesList.slice(-3).map(sale => (
                    <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{sale.products?.name || 'Producto'}</p>
                        <p className="text-sm text-gray-400">{sale.customers?.name || 'Cliente'}</p>
                      </div>
                      <p className="text-green-400 font-bold">${sale.total.toLocaleString()}</p>
                    </div>
                  ))}
                  {salesList.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No hay ventas registradas</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- ADD SALE SCREEN --- */}
          {currentScreen === 'add-sale' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Registrar Nueva Venta</h2>
              </div>

              <form onSubmit={handleAddSale} className="bg-gray-800 rounded-xl p-6 space-y-6">
                {/* Free Sale Toggle */}
                <div className="flex items-center justify-between bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <div>
                    <p className="text-white font-semibold">Venta Libre</p>
                    <p className="text-sm text-gray-400">Registrar venta sin cliente ni producto</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSale.isFreeSale}
                      onChange={(e) => setNewSale(prev => ({
                        ...prev,
                        isFreeSale: e.target.checked,
                        freeAmount: e.target.checked ? '' : prev.freeAmount,
                        freeDescription: e.target.checked ? '' : prev.freeDescription,
                        customerId: e.target.checked ? '' : prev.customerId,
                        productId: e.target.checked ? '' : prev.productId,
                        quantity: e.target.checked ? 1 : prev.quantity,
                        unitPrice: e.target.checked ? 0 : prev.unitPrice
                      }))}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${newSale.isFreeSale ? 'bg-blue-600' : 'bg-gray-600'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${newSale.isFreeSale ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </label>
                </div>

                {newSale.isFreeSale && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Monto de Venta Libre</label>
                      <input
                        type="number"
                        name="freeAmount"
                        value={newSale.freeAmount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (opcional)</label>
                      <input
                        type="text"
                        name="freeDescription"
                        value={newSale.freeDescription}
                        onChange={handleInputChange}
                        placeholder="Ej: Venta rápida, ajuste, etc."
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
                  <select
                    name="customerId"
                    value={newSale.customerId || ''}
                    onChange={handleInputChange}
                    disabled={newSale.isFreeSale}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  >
                    <option value="">Selecciona un cliente</option>
                    {customers.length === 0 && (
                      <option value="" disabled>No hay clientes disponibles</option>
                    )}
                    {customers.map(customer => (
                      <option key={customer.id} value={String(customer.id)}>{customer.name}</option>
                    ))}
                  </select>
                </div>

                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Producto</label>
                  <select
                    name="productId"
                    value={newSale.productId || ''}
                    onChange={(e) => {
                      const productId = String(e.target.value);
                      setNewSale(prev => ({
                        ...prev,
                        productId: productId
                      }));
                      const product = products.find(p => String(p.id) === productId);
                      if (product) {
                        setNewSale(prev => ({
                          ...prev,
                          unitPrice: product.unit_price || 0
                        }));
                      }
                    }}
                    disabled={newSale.isFreeSale}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  >
                    <option value="">Selecciona un producto</option>
                    {products.length === 0 && (
                      <option value="" disabled>No hay productos disponibles</option>
                    )}
                    {products.map(product => (
                      <option key={product.id} value={String(product.id)}>
                        {product.name} - ${product.unit_price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Info */}
                {selectedProduct && (
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <strong>{selectedProduct.name}</strong> - Stock disponible: {selectedProduct.stock} unidades
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (newSale.isFreeSale) return;
                          setNewSale(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }));
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-60"
                        disabled={newSale.isFreeSale}
                      >
                        <MinusCircle size={20} />
                      </button>
                      <input
                        type="number"
                        name="quantity"
                        value={newSale.quantity}
                        onChange={handleInputChange}
                        min="1"
                        disabled={newSale.isFreeSale}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSale.isFreeSale) return;
                          setNewSale(prev => ({ ...prev, quantity: prev.quantity + 1 }));
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-60"
                        disabled={newSale.isFreeSale}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Precio Unitario</label>
                      <input
                      type="number"
                      name="unitPrice"
                      value={newSale.unitPrice}
                      onChange={handleInputChange}
                      step="0.01"
                        disabled={newSale.isFreeSale}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-300">Total:</span>
                    <span className="text-3xl font-bold text-green-400">${totalAmount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('dashboard')}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save size={20} />
                    Guardar Venta
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- ADD EXPENSE SCREEN --- */}
          {currentScreen === 'add-expense' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Registrar Gasto</h2>
              </div>

              <form onSubmit={handleAddExpense} className="bg-gray-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monto</label>
                    <input
                      type="number"
                      name="amount"
                      value={newExpense.amount}
                      onChange={handleExpenseInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
                    <input
                      type="date"
                      name="expenseDate"
                      value={newExpense.expenseDate}
                      onChange={handleExpenseInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría (opcional)</label>
                  <input
                    type="text"
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseInputChange}
                    placeholder="Ej: Servicios, Insumos, Transporte"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (opcional)</label>
                  <textarea
                    name="description"
                    value={newExpense.description}
                    onChange={handleExpenseInputChange}
                    rows={3}
                    placeholder="Detalle del gasto"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('dashboard')}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Receipt size={20} />
                    Guardar Gasto
                  </button>
                </div>
              </form>

              <div className="bg-gray-800 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold mb-4">Últimos Gastos</h3>
                <div className="space-y-3">
                  {expensesList.slice(0, 5).map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{expense.category || 'Gasto'}</p>
                        <p className="text-sm text-gray-400">{expense.description || 'Sin descripción'}</p>
                      </div>
                      <p className="text-red-400 font-bold">-${Number(expense.amount).toLocaleString()}</p>
                    </div>
                  ))}
                  {expensesList.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No hay gastos registrados</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- SALES LIST SCREEN --- */}
          {currentScreen === 'sales-list' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Historial de Ventas</h2>
              </div>

              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Producto</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Cliente</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Cantidad</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Monto</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {salesList.map(sale => (
                        <tr key={sale.id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-white">{sale.products?.name || 'Producto'}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{sale.customers?.name || 'Cliente'}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {sale.sales_details?.[0]?.quantity || 0} unidades
                          </td>
                          <td className="px-6 py-4 text-sm text-green-400 font-semibold">${sale.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{sale.sale_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {salesList.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    No hay ventas registradas
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- EXPENSES LIST SCREEN --- */}
          {currentScreen === 'expenses-list' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Historial de Gastos</h2>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-2 text-gray-400 font-medium">Fecha</th>
                        <th className="py-3 px-2 text-gray-400 font-medium">Categoría</th>
                        <th className="py-3 px-2 text-gray-400 font-medium">Descripción</th>
                        <th className="py-3 px-2 text-gray-400 font-medium text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expensesList.map(expense => (
                        <tr key={expense.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2 text-white">{expense.expense_date}</td>
                          <td className="py-3 px-2 text-white">{expense.category || 'Gasto'}</td>
                          <td className="py-3 px-2 text-gray-300">{expense.description || 'Sin descripción'}</td>
                          <td className="py-3 px-2 text-right text-red-400 font-semibold">-${Number(expense.amount).toLocaleString()}</td>
                        </tr>
                      ))}
                      {expensesList.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-gray-400">No hay gastos registrados</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- ADD CUSTOMER SCREEN --- */}
          {currentScreen === 'add-customer' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Agregar Nuevo Cliente</h2>
              </div>

              <form onSubmit={handleAddCustomer} className="bg-gray-800 rounded-xl p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Cliente *</label>
                  <input
                    type="text"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleCustomerInputChange}
                    placeholder="Ej: Juan García López"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleCustomerInputChange}
                    placeholder="Ej: juan@example.com"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleCustomerInputChange}
                    placeholder="Ej: 1234567890"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Nota:</strong> Solo el nombre es obligatorio. El email y teléfono son opcionales.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('dashboard')}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Guardar Cliente
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* List of Customers */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Clientes Registrados ({customers.length})</h3>
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Nombre</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Teléfono</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {customers.map(customer => (
                          <tr key={customer.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-white font-semibold">{customer.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{customer.email || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{customer.phone || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {customers.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                      No hay clientes registrados
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesApp;

