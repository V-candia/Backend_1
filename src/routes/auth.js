const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * RUTAS PÚBLICAS
 */

/**
 * POST /auth/register
 * Registrar nuevo usuario
 * Body: { email, password, nombre }
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Login de usuario
 * Body: { email, password }
 */
router.post('/login', authController.login);

/**
 * RUTAS PROTEGIDAS (requieren autenticación)
 */

/**
 * GET /auth/perfil
 * Obtener perfil del usuario autenticado
 */
router.get('/perfil', protect, authController.obtenerPerfil);

/**
 * PUT /auth/perfil
 * Actualizar perfil del usuario
 * Body: { nombre?, email? }
 */
router.put('/perfil', protect, authController.actualizarPerfil);

/**
 * POST /auth/cambiar-password
 * Cambiar contraseña del usuario
 * Body: { passwordActual, passwordNueva, passwordNuevaConfirm }
 */
router.post('/cambiar-password', protect, authController.cambiarPassword);

/**
 * GET /auth/verify
 * Verificar validez del token
 */
router.get('/verify', protect, authController.verifyToken);

module.exports = router;
