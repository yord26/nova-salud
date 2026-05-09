import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticion } from '../utilidades/api';

export default function Alertas() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarAlertas();
  }, []);

  async function cargarAlertas() {
    try {
      const datos = await peticion('/productos/alertas');
      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-lg">Nova Salud</span>
        </div>
        <button onClick={() => navegar('/dashboard')}
          className="text-sm bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50">
          ← Dashboard
        </button>
      </nav>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">⚠️ Alertas de Bajo Stock</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : productos.length === 0 ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center text-green-700 font-medium">
            ✅ Todos los productos tienen stock suficiente
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  {['Nombre', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Diferencia'].map(col => (
                    <th key={col} className="px-4 py-3 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{p.categoria}</td>
                    <td className="px-4 py-3 text-red-600 font-bold">{p.stock}</td>
                    <td className="px-4 py-3 text-gray-500">{p.stockMinimo}</td>
                    <td className="px-4 py-3 text-red-500 font-semibold">
                      -{p.stockMinimo - p.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}