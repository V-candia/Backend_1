require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar conexión a BD
const { connectDB } = require('./src/config/database');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');

// Importar middleware
const { errorHandler } = require('./src/middleware/errorHandler');

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MySQL
connectDB();

// ============================================
// MIDDLEWARE GLOBAL
// ============================================

// Logging de peticiones
app.use(morgan('combined'));

// CORS - Permitir comunicación con frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting - Protección contra ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta dirección, intenta más tarde'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Máximo 5 intentos de login
  message: 'Demasiados intentos de login, intenta más tarde'
});

app.use('/api/', limiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);

// ============================================
// RUTAS
// ============================================

/**
 * Ruta de health check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    mensaje: 'Backend de tienda de manga funcionando ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Rutas de autenticación
 * Prefijo: /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * Rutas de productos
 * Prefijo: /api/products
 */
app.use('/api/products', productRoutes);

/**
 * Rutas de órdenes
 * Prefijo: /api/orders
 */
app.use('/api/orders', orderRoutes);

/**
 * Ruta no encontrada (404)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      Servidor de Tienda de Manga       ║
║  Puerto: ${PORT}                       ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}║
║  Status:  En ejecución                 ║
╚════════════════════════════════════════╝
  `);
  console.log('📝 Rutas disponibles:');
  console.log('  • GET  /api/health              - Health check');
  console.log('  • POST /api/auth/register       - Registrar usuario');
  console.log('  • POST /api/auth/login          - Login de usuario');
  console.log('  • GET  /api/auth/perfil         - Obtener perfil');
  console.log('  • GET  /api/products            - Listar productos');
  console.log('  • POST /api/products            - Crear producto (admin)');
  console.log('  • POST /api/orders              - Crear orden');
  console.log('  • GET  /api/orders/mis-ordenes  - Mis órdenes');
  console.log('  • GET  /api/orders              - Todas órdenes (admin)');
});

// ============================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  // Cerrar servidor
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

module.exports = app;
