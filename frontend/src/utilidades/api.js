const BASE_URL = 'http://localhost:3000/api';

export async function peticion(ruta, opciones = {}) {
  const token = localStorage.getItem('token');

  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...opciones,
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error en la petición');
  }

  return datos;
}