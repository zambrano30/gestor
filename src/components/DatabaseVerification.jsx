import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { verifyDatabase, checkMissingData, checkSupabaseStatus } from '../lib/verify-db'

export default function DatabaseVerification() {
  const [verification, setVerification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState(null)

  useEffect(() => {
    const runVerification = async () => {
      setLoading(true)
      
      // Check connection first
      const status = await checkSupabaseStatus()
      setDbStatus(status)

      if (status.connected) {
        // Run verification
        const results = await verifyDatabase()
        setVerification(results)
        
        // Check for missing data
        await checkMissingData()
      }
      
      setLoading(false)
    }

    runVerification()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando base de datos...</p>
        </div>
      </div>
    )
  }

  if (!dbStatus?.connected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-red-500/10 border border-red-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-500 font-bold text-lg mb-2">Error de Conexión</h3>
              <p className="text-gray-300 text-sm mb-4">{dbStatus?.error}</p>
              <p className="text-gray-400 text-sm">Verifica que las credenciales de Supabase sean correctas en el archivo `.env.local`</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">📊 Verificación de Base de Datos</h1>

        {verification && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customers */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.customers?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Clientes</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.customers?.status === 'OK' 
                  ? `${verification.customers?.count} clientes` 
                  : verification.customers?.error}
              </p>
            </div>

            {/* Categories */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.categories?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Categorías</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.categories?.status === 'OK' 
                  ? `${verification.categories?.count} categorías` 
                  : verification.categories?.error}
              </p>
            </div>

            {/* Products */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.products?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Productos</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.products?.status === 'OK' 
                  ? `${verification.products?.count} productos` 
                  : verification.products?.error}
              </p>
            </div>

            {/* Sales */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.sales?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Ventas</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.sales?.status === 'OK' 
                  ? `${verification.sales?.count} ventas` 
                  : verification.sales?.error}
              </p>
            </div>

            {/* Sales Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.salesDetails?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Detalles Ventas</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.salesDetails?.status === 'OK' 
                  ? `${verification.salesDetails?.count} detalles` 
                  : verification.salesDetails?.error}
              </p>
            </div>

            {/* Suppliers */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.suppliers?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Proveedores</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.suppliers?.status === 'OK' 
                  ? `${verification.suppliers?.count} proveedores` 
                  : verification.suppliers?.error}
              </p>
            </div>

            {/* Stock Movements */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.stockMovements?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Movimientos Stock</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.stockMovements?.status === 'OK' 
                  ? `${verification.stockMovements?.count} movimientos` 
                  : verification.stockMovements?.error}
              </p>
            </div>

            {/* Users */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {verification.users?.status === 'OK' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-white font-bold">Usuarios</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {verification.users?.status === 'OK' 
                  ? `${verification.users?.count} usuarios` 
                  : verification.users?.error}
              </p>
            </div>
          </div>
        )}

        {/* Missing Data Info */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500 rounded-lg p-6">
          <h3 className="text-yellow-500 font-bold mb-3">📝 Si Falta Algún Dato:</h3>
          <ol className="text-gray-300 space-y-2 text-sm">
            <li>1. Ve a <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">app.supabase.com</a></li>
            <li>2. Selecciona tu proyecto</li>
            <li>3. Ve a SQL Editor → New Query</li>
            <li>4. Abre el archivo <code className="bg-gray-800 px-2 py-1 rounded">database.sql</code> de este proyecto</li>
            <li>5. Copia todo el contenido y pégalo en Supabase</li>
            <li>6. Haz clic en RUN</li>
            <li>7. Recarga esta página</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
