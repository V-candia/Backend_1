const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Servicio de autenticación
 */
const authService = {
  /**
   * Registrar nuevo usuario
   */
  register: async (email, password, nombre) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nombre
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || data.mensajes?.join(', ') || 'Error al registrar');
      }

      // Guardar token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al iniciar sesión');
      }

      // Guardar token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener perfil
   */
  obtenerPerfil: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al obtener perfil');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar perfil
   */
  actualizarPerfil: async (nombre, email) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al actualizar perfil');
      }

      // Actualizar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cambiar contraseña
   */
  cambiarPassword: async (passwordActual, passwordNueva, passwordNuevaConfirm) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/cambiar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
          passwordNuevaConfirm
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al cambiar contraseña');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  /**
   * Obtener token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Obtener usuario
   */
  getUsuario: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
};

export default authService;
