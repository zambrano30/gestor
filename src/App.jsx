import { useState, useEffect } from 'react'
import Login from "./pages/Login"
import Sales from "./pages/Sales"
import AdminPanel from "./components/AdminPanel"
import DatabaseVerification from "./components/DatabaseVerification"
import SupabaseStatus from "./components/SupabaseStatus"
import { supabase } from "./lib/supabase"
import { AlertCircle, Settings } from 'lucide-react'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [showVerification, setShowVerification] = useState(false)
  const [showSupabaseStatus, setShowSupabaseStatus] = useState(false)

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        if (!supabase) {
          setDbError('Configuración de Supabase incompleta. Verifica las variables de entorno.')
          setLoading(false)
          return
        }

        console.log('🔍 Verificando base de datos...')
        
        // Try to fetch from customers table to verify it exists
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .limit(1)
        
        if (error) {
          console.error('❌ Error de BD:', error.message)
          
          // If we get a "relation does not exist" error, show admin panel
          if (error.message?.includes('does not exist') || error.message?.includes('no existe')) {
            console.log('📊 Tablas no encontradas. Mostrando panel de importación.')
            setDbError('Las tablas aún no existen. Por favor, importa el SQL.')
            setShowAdmin(true)
          } else {
            console.log('⚠️ Error de conexión:', error.message)
            setDbError(`Error de conexión: ${error.message}`)
          }
        } else {
          console.log('✅ Base de datos verificada. Clientes encontrados:', data?.length || 0)
        }
      } catch (err) {
        console.error('❌ Error en verificación:', err)
        setDbError(`Error inesperado: ${err.message}`)
        setShowAdmin(true)
      } finally {
        setLoading(false)
      }
    }

    checkDatabase()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg mb-4">🔄 Verificando base de datos...</div>
          <div className="text-gray-400 text-sm">Por favor espera...</div>
        </div>
      </div>
    )
  }

  // Show error state if there's a DB error
  if (dbError && !showAdmin) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-white text-xl font-bold mb-2">Error de Base de Datos</h2>
          <p className="text-gray-300 mb-6">{dbError}</p>
          <button
            onClick={() => {
              setShowAdmin(true)
              setDbError(null)
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mr-2"
          >
            Importar Base de Datos
          </button>
          <button
            onClick={() => setShowVerification(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Verificar Datos
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {showSupabaseStatus && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={() => setShowSupabaseStatus(false)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
          <SupabaseStatus />
        </div>
      )}
      {showVerification && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={() => setShowVerification(false)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
          <DatabaseVerification />
        </div>
      )}
      {showAdmin && <AdminPanel onSuccess={() => {
        setShowAdmin(false)
        window.location.reload()
      }} />}
      
      {/* Button to check Supabase status - always visible */}
      {!showSupabaseStatus && !showVerification && !showAdmin && (
        <button
          onClick={() => setShowSupabaseStatus(true)}
          className="fixed bottom-4 right-4 z-40 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors tooltip"
          title="Verificar Estado de Supabase"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}
      
      <Sales />
    </>
  )
}

export default App
