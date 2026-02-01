import React from 'react'

function LoginForm() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900"> {/* Contenedor principal */}
      <form className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm"> {/* Formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Iniciar Sesión</h2>
        {/* Campos del formulario (email, password, botón) */}
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="email" type="email" placeholder="Ingresa tu usuario " />
        </div>
        <div className="mb-6">
          <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
          <input className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" id="password" type="password" placeholder="Ingresa tu contraseña" />
        </div>
        <div className="flex items-center justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;



