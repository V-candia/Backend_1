/**
 * Constantes de la aplicación
 */

const CATEGORIAS_MANGA = [
  'Shounen',
  'Shoujo',
  'Seinen',
  'Josei',
  'Horror',
  'Romance',
  'Aventura',
  'Comedia',
  'Otro'
];

const ESTADOS_ORDEN = [
  'pendiente',
  'procesando',
  'enviado',
  'entregado',
  'cancelado'
];

const MENSAJES = {
  // Éxito
  REGISTRO_EXITOSO: 'Usuario registrado exitosamente',
  LOGIN_EXITOSO: 'Login exitoso',
  PRODUCTO_CREADO: 'Producto creado exitosamente',
  PRODUCTO_ACTUALIZADO: 'Producto actualizado',
  ORDEN_CREADA: 'Orden creada exitosamente',
  
  // Errores
  EMAIL_EXISTENTE: 'El usuario ya existe con este email',
  CREDENCIALES_INVALIDAS: 'Credenciales inválidas',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  PRODUCTO_NO_ENCONTRADO: 'Producto no encontrado',
  ORDEN_NO_ENCONTRADA: 'Orden no encontrada',
  ACCESO_DENEGADO: 'Acceso denegado',
  NO_AUTORIZADO: 'No autorizado. Token no proporcionado',
  TOKEN_INVALIDO: 'Token inválido o expirado',
  STOCK_INSUFICIENTE: 'Stock insuficiente',
  ERROR_INTERNO: 'Error interno del servidor'
};

module.exports = {
  CATEGORIAS_MANGA,
  ESTADOS_ORDEN,
  MENSAJES
};
