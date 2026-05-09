import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navegar = useNavigate();
  const nombre = localStorage.getItem('nombre');

  function cerrarSesion() {
    localStorage.clear();
    navegar('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra superior */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-lg">Nova Salud</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hola, {nombre}</span>
          <button
            onClick={cerrarSesion}
            className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Tarjetas resumen */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Panel de Control</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => navegar('/inventario')}
            className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-sm">Inventario</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">📦</p>
            <p className="text-gray-600 text-sm mt-1">Gestionar productos</p>
          </div>

          <div
            onClick={() => navegar('/ventas')}
            className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-sm">Ventas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">🧾</p>
            <p className="text-gray-600 text-sm mt-1">Registrar ventas</p>
          </div>

          <div
            onClick={() => navegar('/alertas')}
            className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition border-l-4 border-red-500"
          >
            <p className="text-gray-500 text-sm">Alertas de Stock</p>
            <p className="text-3xl font-bold text-red-500 mt-1">⚠️</p>
            <p className="text-gray-600 text-sm mt-1">Productos con bajo stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}