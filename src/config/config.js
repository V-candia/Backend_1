/**
 * Configuración centralizada de la aplicación
 */

require('dotenv').config();

const config = {
  // Base de datos
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/manga-store',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Servidor
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_no_cambiar_en_produccion',
    expiresIn: '30d',
    tokenType: 'Bearer'
  },

  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    loginAttempts: 5
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  },

  // Admin
  admin: {
    secret: process.env.ADMIN_SECRET || 'default_admin_secret'
  }
};

// Validar variables críticas en producción
if (config.server.env === 'production') {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI es requerida en producción');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET es requerida en producción');
  }
}

module.exports = config;
