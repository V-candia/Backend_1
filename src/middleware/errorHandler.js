/**
 * Middleware: Manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      errores: messages
    });
  }

  // Error de duplicado en Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = Object.keys(err.fields)[0];
    return res.status(400).json({
      success: false,
      mensaje: `El ${field} ya está registrado`
    });
  }

  // Error de validación de Mongoose (Legacy)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      errores: messages
    });
  }

  // Error de duplicado en MongoDB (Legacy)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      mensaje: `El ${field} ya está registrado`
    });
  }

  // Error de cast de ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      mensaje: 'ID inválido'
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    success: false,
    mensaje: err.mensaje || 'Error interno del servidor',
    error: err.message,
    stack: err.stack
  });
};

/**
 * Clase personalizada para errores de API
 */
class ErrorAPI extends Error {
  constructor(mensaje, statusCode = 500) {
    super(mensaje);
    this.statusCode = statusCode;
    this.mensaje = mensaje;
  }
}

module.exports = {
  errorHandler,
  ErrorAPI
};
