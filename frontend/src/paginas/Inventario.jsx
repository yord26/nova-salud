import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticion } from '../utilidades/api';

export default function Inventario() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '', precio: '', stock: '', stockMinimo: '', categoria: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const datos = await peticion('/productos');
      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function abrirFormularioNuevo() {
    setProductoEditando(null);
    setFormulario({ nombre: '', precio: '', stock: '', stockMinimo: '', categoria: '' });
    setMostrarFormulario(true);
  }

  function abrirFormularioEditar(producto) {
    setProductoEditando(producto);
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      categoria: producto.categoria,
    });
    setMostrarFormulario(true);
  }

  async function guardarProducto() {
    try {
      if (productoEditando) {
        await peticion(`/productos/${productoEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(formulario),
        });
      } else {
        await peticion('/productos', {
          method: 'POST',
          body: JSON.stringify(formulario),
        });
      }
      setMostrarFormulario(false);
      cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await peticion(`/productos/${id}`, { method: 'DELETE' });
      cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra superior */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-lg">Nova Salud</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navegar('/dashboard')}
            className="text-sm bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50">
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Inventario de Productos</h2>
          <button onClick={abrirFormularioNuevo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            + Nuevo Producto
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Modal formulario */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="font-bold text-lg mb-4">
                {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <div className="space-y-3">
                {['nombre', 'precio', 'stock', 'stockMinimo', 'categoria'].map((campo) => (
                  <div key={campo}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {campo === 'stockMinimo' ? 'Stock Mínimo' : campo}
                    </label>
                    <input
                      name={campo}
                      value={formulario[campo]}
                      onChange={manejarCambio}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={guardarProducto}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                  Guardar
                </button>
                <button onClick={() => setMostrarFormulario(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {['Nombre', 'Categoría', 'Precio', 'Stock', 'Stock Mín.', 'Acciones'].map(col => (
                    <th key={col} className="px-4 py-3 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{p.categoria}</td>
                    <td className="px-4 py-3">S/ {p.precio}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock <= p.stockMinimo ? 'text-red-500' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.stockMinimo}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => abrirFormularioEditar(p)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-500">
                        Editar
                      </button>
                      <button onClick={() => eliminarProducto(p.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600">
                        Eliminar
                      </button>
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