const jwt = require('jsonwebtoken');

/**
 * Middleware: Verificar JWT y autenticar usuario
 * Valida el token JWT y agrega el usuario a req.usuario
 */
const protect = (req, res, next) => {
  let token;

  // Obtener token del header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si existe el token
  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: 'No autorizado. Token no proporcionado'
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware: Verificar si el usuario es administrador
 */
const admin = (req, res, next) => {
  if (!req.usuario || !req.usuario.isAdmin) {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Permisos de administrador requeridos'
    });
  }
  next();
};

/**
 * Middleware: Verificar si el usuario es propietario del recurso o es admin
 */
const verificarPropietario = (req, res, next) => {
  const { usuarioId } = req.params;

  // Sequelize usa .id, no ._id
  if (req.usuario.id.toString() !== usuarioId && !req.usuario.isAdmin) {
    return res.status(403).json({
      success: false,
      mensaje: 'No tienes permiso para acceder a este recurso'
    });
  }

  next();
};

module.exports = {
  protect,
  admin,
  verificarPropietario
};
