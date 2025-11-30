const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

/**
 * RUTAS PROTEGIDAS (requieren autenticación)
 */

/**
 * POST /orders
 * Crear nueva orden desde el carrito
 * Body: { items: [{ productoId, cantidad }], direccion: { calle, ciudad, codigoPostal, pais }, notas? }
 */
router.post('/', protect, orderController.crearOrden);

/**
 * GET /orders/mis-ordenes
 * Obtener todas las órdenes del usuario autenticado
 * Query: { pagina?, limite? }
 */
router.get('/mis-ordenes', protect, orderController.obtenerMisOrdenes);

/**
 * GET /orders/:id
 * Obtener una orden específica (solo propietario o admin)
 */
router.get('/:id', protect, orderController.obtenerOrdenPorId);

/**
 * PUT /orders/:id/cancelar
 * Cancelar una orden
 */
router.put('/:id/cancelar', protect, orderController.cancelarOrden);

/**
 * RUTAS SOLO PARA ADMIN
 */

/**
 * GET /orders
 * Obtener todas las órdenes
 * Query: { pagina?, limite?, estado? }
 */
router.get('/', protect, admin, orderController.obtenerTodasLasOrdenes);

/**
 * PUT /orders/:id/estado
 * Actualizar estado de la orden
 * Body: { estado, numeroSeguimiento? }
 */
router.put('/:id/estado', protect, admin, orderController.actualizarEstadoOrden);

/**
 * GET /orders/stats/dashboard
 * Obtener estadísticas de órdenes
 */
router.get('/stats/dashboard', protect, admin, orderController.obtenerEstadisticas);

module.exports = router;
