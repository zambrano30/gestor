import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader, Copy, ExternalLink } from 'lucide-react'
import { checkSupabaseConnection } from '../lib/check-supabase'

export default function SupabaseStatus() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const verify = async () => {
      setLoading(true)
      const result = await checkSupabaseConnection()
      setStatus(result)
      setLoading(false)
    }
    verify()
  }, [])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Verificando Supabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔧 Estado de Supabase</h1>

        {/* Main Status Card */}
        <div className={`rounded-lg p-8 mb-8 border-2 ${
          status?.success 
            ? 'bg-green-500/10 border-green-500' 
            : 'bg-red-500/10 border-red-500'
        }`}>
          <div className="flex items-center gap-4">
            {status?.success ? (
              <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
            )}
            <div>
              <h2 className={`text-2xl font-bold ${
                status?.success ? 'text-green-500' : 'text-red-500'
              }`}>
                {status?.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
              </h2>
              <p className="text-gray-300 mt-2">
                {status?.message || status?.error}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        {status?.success && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* URL */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-bold mb-3">Supabase URL</h3>
              <div className="bg-gray-900 rounded p-3 flex items-center justify-between gap-2">
                <code className="text-gray-400 text-sm truncate">
                  {status?.url}
                </code>
                <button
                  onClick={() => copyToClipboard(status?.url)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Documentation Link */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-bold mb-3">Acciones Rápidas</h3>
              <div className="space-y-2">
                <a
                  href={`${status?.url.replace('/api', '')}/auth/v1/callback`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Dashboard
                </a>
                <a
                  href="https://supabase.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Documentación
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tables Status */}
        {status?.tables && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📊 Estado de Tablas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(status.tables).map(([table, info]) => (
                <div
                  key={table}
                  className={`rounded-lg p-4 border ${
                    info.exists
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {info.exists ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-bold text-white capitalize">{table}</span>
                  </div>
                  {info.exists ? (
                    <p className="text-gray-300 text-sm">{info.count} registros</p>
                  ) : (
                    <p className="text-red-400 text-sm text-xs">{info.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Troubleshooting */}
        {!status?.success && (
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6">
            <h3 className="text-yellow-500 font-bold text-lg mb-4">🔧 Solucionar Problemas</h3>
            <ol className="text-gray-300 space-y-3 text-sm">
              <li>
                <strong>1. Verifica credenciales:</strong> Asegúrate de que `.env.local` tenga las keys correctas
              </li>
              <li>
                <strong>2. Importa database.sql:</strong> Ve a Supabase → SQL Editor → New Query → Pega y ejecuta
              </li>
              <li>
                <strong>3. Revisa el proyecto:</strong> Confirma que el proyecto esté activo en Supabase
              </li>
              <li>
                <strong>4. Recarga la página:</strong> Presiona F5 o cierra y abre de nuevo
              </li>
              <li>
                <strong>5. Revisa la consola:</strong> Abre DevTools (F12) para ver mensajes de error
              </li>
            </ol>
          </div>
        )}

        {/* Environment Variables Info */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500 rounded-lg p-6">
          <h3 className="text-blue-500 font-bold text-lg mb-3">ℹ️  Variables de Entorno</h3>
          <p className="text-gray-300 text-sm mb-3">
            El archivo `.env.local` debe contener:
          </p>
          <div className="bg-gray-900 rounded p-4 text-gray-300 text-sm space-y-2">
            <code>VITE_SUPABASE_URL=https://your-project.supabase.co</code>
            <br />
            <code>VITE_SUPABASE_ANON_KEY=your-anon-key</code>
          </div>
        </div>
      </div>
    </div>
  )
}
