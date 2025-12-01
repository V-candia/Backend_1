const Product = require('../models/Product');
const { Op } = require('sequelize');
const { validarProducto } = require('../utils/validacion');

/**
 * Controlador: Obtener todos los productos con filtros
 * GET /products
 */
exports.obtenerProductos = async (req, res, next) => {
  try {
    const { categoria, buscar, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};

    if (categoria && categoria !== 'Todos') {
      where.categoria = categoria;
    }

    if (buscar) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${buscar}%` } },
        { autor: { [Op.like]: `%${buscar}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      total: count,
      pagina: parseInt(pagina),
      paginas: Math.ceil(count / limite),
      productos: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener un producto por ID
 * GET /products/:id
 */
exports.obtenerProductoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      producto
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener productos por categoría
 * GET /products/categoria/:categoria
 */
exports.obtenerPorCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params;
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    const { count, rows } = await Product.findAndCountAll({
      where: { categoria },
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      total: count,
      pagina: parseInt(pagina),
      paginas: Math.ceil(count / limite),
      productos: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Crear nuevo producto (solo admin)
 * POST /products
 */
exports.crearProducto = async (req, res, next) => {
  try {
    const { error, value } = validarProducto(req.body);

    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        mensajes
      });
    }

    const producto = await Product.create(value);

    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      producto
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Actualizar producto (solo admin)
 * PUT /products/:id
 */
exports.actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = validarProducto(req.body);

    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        mensajes
      });
    }

    const [updated] = await Product.update(value, {
      where: { id }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const producto = await Product.findByPk(id);

    res.status(200).json({
      success: true,
      mensaje: 'Producto actualizado',
      producto
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Eliminar producto (solo admin)
 * DELETE /products/:id
 */
exports.eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      mensaje: 'Producto eliminado'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Actualizar stock del producto
 * PATCH /products/:id/stock
 */
exports.actualizarStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (typeof cantidad !== 'number') {
      return res.status(400).json({
        success: false,
        mensaje: 'Cantidad debe ser un número'
      });
    }

    const [updated] = await Product.update(
      { stock: cantidad },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const producto = await Product.findByPk(id);

    res.status(200).json({
      success: true,
      mensaje: 'Stock actualizado',
      producto
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
