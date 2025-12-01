const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

/**
 * GET /orders
 * Obtener todas las órdenes del usuario autenticado
 * (Alias para /mis-ordenes para compatibilidad con frontend)
 */
router.get('/', protect, orderController.obtenerMisOrdenes);

/**
 * POST /orders
 * Crear nueva orden desde el carrito
 * Body: { items: [{ productoId, cantidad }], direccion: { calle, ciudad, codigoPostal, pais } }
 */
router.post('/', protect, orderController.crearOrden);

/**
 * GET /orders/mis-ordenes
 * Obtener todas las órdenes del usuario autenticado
 */
router.get('/mis-ordenes', protect, orderController.obtenerMisOrdenes);

/**
 * GET /orders/:id
 * Obtener una orden específica
 */
router.get('/:id', protect, orderController.obtenerOrdenPorId);

module.exports = router;
