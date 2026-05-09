import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticion } from '../utilidades/api';

export default function Ventas() {
  const navegar = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({ productoId: '', cantidad: '' });

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    try {
      const [listaVentas, listaProductos] = await Promise.all([
        peticion('/ventas'),
        peticion('/productos'),
      ]);
      setVentas(listaVentas);
      setProductos(listaProductos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function registrarVenta() {
    if (!formulario.productoId || !formulario.cantidad) {
      setError('Completa todos los campos');
      return;
    }
    try {
      await peticion('/ventas', {
        method: 'POST',
        body: JSON.stringify({
          cliente: 'Cliente General',
          items: [{
            productoId: Number(formulario.productoId),
            cantidad: Number(formulario.cantidad),
          }],
        }),
      });
      setMostrarFormulario(false);
      setFormulario({ productoId: '', cantidad: '' });
      setError('');
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarVenta(id) {
    if (!confirm('¿Eliminar esta venta?')) return;
    try {
      await peticion(`/ventas/${id}`, { method: 'DELETE' });
      cargarDatos();
    } catch (err) {
      setError(err.message);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Registro de Ventas</h2>
          <button onClick={() => setMostrarFormulario(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
            + Nueva Venta
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="font-bold text-lg mb-4">Nueva Venta</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <select name="productoId" value={formulario.productoId} onChange={manejarCambio}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Seleccionar...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} — S/ {p.precio} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input type="number" name="cantidad" value={formulario.cantidad}
                    onChange={manejarCambio} min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex gap-3 mt-5">
                <button onClick={registrarVenta}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
                  Registrar
                </button>
                <button onClick={() => { setMostrarFormulario(false); setError(''); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  {['#', 'Producto', 'Cantidad', 'Total', 'Fecha', 'Acciones'].map(col => (
                    <th key={col} className="px-4 py-3 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                      No hay ventas registradas
                    </td>
                  </tr>
                ) : (
                  ventas.map((v, i) => (
                    <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {v.items ? v.items.map(item => {
                          const prod = productos.find(p => p.id === item.productoId);
                          return prod ? prod.nombre : item.productoId;
                        }).join(', ') : v.productoId}
                      </td>
                      <td className="px-4 py-3">
                        {v.items ? v.items.reduce((acc, item) => acc + item.cantidad, 0) : v.cantidad}
                      </td>
                      <td className="px-4 py-3 text-green-600 font-semibold">S/ {Number(v.total).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(v.fecha).toLocaleString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => eliminarVenta(v.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}