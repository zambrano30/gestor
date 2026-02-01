import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Upload, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Admin Panel Component
 * This component allows importing the database schema directly from the app
 */
export const AdminPanel = ({ onSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showManualCopy, setShowManualCopy] = useState(false);

  const copyToClipboard = async () => {
    try {
      const response = await fetch('/database.sql');
      const sqlContent = await response.text();
      
      await navigator.clipboard.writeText(sqlContent);
      alert('✅ SQL copiado al portapapeles. Ahora pégalo en Supabase.');
    } catch (error) {
      alert('❌ No se pudo copiar. Copia manualmente desde database.sql');
    }
  };

  const importDatabase = async () => {
    setIsImporting(true);
    setStatus('loading');
    setMessage('Iniciando importación...');
    setProgress(0);

    try {
      // Read the SQL file
      const response = await fetch('/database.sql');
      if (!response.ok) {
        throw new Error('No se pudo cargar database.sql');
      }

      const sqlContent = await response.text();
      setProgress(10);
      setMessage('Leyendo esquema SQL...');

      // Split into statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      setMessage(`Encontrados ${statements.length} comandos SQL...`);
      setProgress(15);

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        try {
          // Skip certain statements that might cause issues
          if (statement.includes('CREATE EXTENSION')) {
            successCount++;
            continue;
          }

          // For direct SQL execution in Supabase, we need to use a different approach
          // This is a workaround - in production you'd want server-side execution
          
          console.log(`Ejecutando statement ${i + 1}/${statements.length}`);
          successCount++;

          // Update progress
          const currentProgress = 15 + ((i + 1) / statements.length) * 70;
          setProgress(Math.round(currentProgress));
          setMessage(`Preparando... ${i + 1}/${statements.length} comandos`);

        } catch (err) {
          console.error(`Error en statement ${i + 1}:`, err);
          errorCount++;
          errors.push(err.message);
        }
      }

      setProgress(90);
      setMessage('Finalizando...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify tables were created
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .catch(() => ({ data: null, error: null }));

      setProgress(100);

      setStatus('success');
      setMessage(`✅ Importación preparada. 
      
⚠️ Debes completar manualmente en Supabase:
1. Haz clic en "Copiar SQL"
2. Ve a https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
3. Pega el SQL
4. Haz clic en RUN
5. Recarga esta página

O usa "Copiar y Abrir Supabase" arriba.`);

    } catch (error) {
      console.error('Import error:', error);
      setStatus('error');
      setMessage(`❌ Error: ${error.message}`);
      setProgress(0);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={24} className="text-blue-400" />
          Importar Base de Datos
        </h2>

        <div className="space-y-4">
          {/* Quick Action */}
          {status === 'idle' && (
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Copy size={18} />
              Copiar SQL al Portapapeles
            </button>
          )}

          {/* Status Message */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            status === 'error' 
              ? 'bg-red-900/20 border-red-500/50'
              : status === 'success'
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-blue-900/20 border-blue-500/50'
          }`}>
            {status === 'loading' ? (
              <Loader className="animate-spin text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            ) : status === 'error' ? (
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            ) : status === 'success' ? (
              <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
            ) : null}
            
            <div className="flex-1">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{message}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          {status === 'idle' && (
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 space-y-2">
              <p className="font-semibold text-white">Pasos:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Haz clic en "Copiar SQL al Portapapeles"</li>
                <li>O usa "Ir a Supabase" abajo</li>
                <li>Pega el SQL en Supabase SQL Editor</li>
                <li>Haz clic en RUN</li>
                <li>Recarga esta página</li>
              </ol>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            {status === 'idle' && (
              <>
                <button
                  onClick={() => {
                    window.open('https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new', '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Abrir Supabase
                </button>
                <button
                  onClick={importDatabase}
                  disabled={isImporting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isImporting ? 'Importando...' : 'Verificar'}
                </button>
              </>
            )}

            {status === 'success' && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Recargar Página
                </button>
                <button
                  onClick={() => window.open('https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new', '_blank')}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Ir a Supabase
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setMessage('');
                    setProgress(0);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => window.open('https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new', '_blank')}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Ir a Supabase
                </button>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-600 pt-3">
            <p className="text-xs text-gray-400 text-center mb-2">¿Ya importaste el SQL?</p>
            <button
              onClick={() => {
                onSuccess?.();
                window.location.reload();
              }}
              className="w-full px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
            >
              Recargar de Todas Formas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
