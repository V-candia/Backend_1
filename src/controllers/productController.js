const Product = require('../models/Product');
const { ErrorAPI } = require('../middleware/errorHandler');
const { validarProducto } = require('../utils/validacion');

/**
 * Controlador: Obtener todos los productos con filtros
 * GET /products
 * Query params: categoria, buscar, pagina, limite
 */
exports.obtenerProductos = async (req, res, next) => {
  try {
    const { categoria, buscar, pagina = 1, limite = 10 } = req.query;
    const filtro = {};

    // Filtrar por categoría
    if (categoria) {
      filtro.categoria = categoria;
    }

    // Búsqueda por texto
    if (buscar) {
      filtro.$text = { $search: buscar };
    }

    const skip = (pagina - 1) * limite;

    const productos = await Product.find(filtro)
      .limit(parseInt(limite))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filtro);

    res.status(200).json({
      success: true,
      total,
      pagina: parseInt(pagina),
      paginas: Math.ceil(total / limite),
      productos
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

    const producto = await Product.findById(id);

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

    const skip = (pagina - 1) * limite;

    const productos = await Product.find({ categoria })
      .limit(parseInt(limite))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ categoria });

    res.status(200).json({
      success: true,
      total,
      pagina: parseInt(pagina),
      paginas: Math.ceil(total / limite),
      productos
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

    const producto = new Product(value);
    await producto.save();

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

    const producto = await Product.findByIdAndUpdate(
      id,
      value,
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

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

    const producto = await Product.findByIdAndDelete(id);

    if (!producto) {
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

    const producto = await Product.findByIdAndUpdate(
      id,
      { stock: cantidad },
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

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
