const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

/**
 * RUTAS PÚBLICAS
 */

/**
 * GET /products
 * Obtener todos los productos con filtros y paginación
 * Query: { categoria?, buscar?, pagina?, limite? }
 */
router.get('/', productController.obtenerProductos);

/**
 * GET /products/:id
 * Obtener un producto específico
 */
router.get('/:id', productController.obtenerProductoPorId);

/**
 * GET /products/categoria/:categoria
 * Obtener productos por categoría
 */
router.get('/categoria/:categoria', productController.obtenerPorCategoria);

/**
 * RUTAS PROTEGIDAS (solo admin)
 */

/**
 * POST /products
 * Crear nuevo producto
 * Body: { nombre, descripcion, precio, imagen, stock, categoria, autor?, editorial? }
 */
router.post('/', protect, admin, productController.crearProducto);

/**
 * PUT /products/:id
 * Actualizar producto
 */
router.put('/:id', protect, admin, productController.actualizarProducto);

/**
 * DELETE /products/:id
 * Eliminar producto
 */
router.delete('/:id', protect, admin, productController.eliminarProducto);

/**
 * PATCH /products/:id/stock
 * Actualizar stock del producto
 * Body: { cantidad }
 */
router.patch('/:id/stock', protect, admin, productController.actualizarStock);

module.exports = router;
