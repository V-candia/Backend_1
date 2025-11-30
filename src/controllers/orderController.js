const Order = require('../models/Order');
const Product = require('../models/Product');
const { validarOrden } = require('../utils/validacion');

/**
 * Controlador: Crear nueva orden
 * POST /orders
 */
exports.crearOrden = async (req, res, next) => {
  try {
    const { error, value } = validarOrden(req.body);

    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        mensajes
      });
    }

    const { items, direccion, notas } = value;
    let total = 0;
    const itemsProcessados = [];

    // Procesar cada item del carrito
    for (const item of items) {
      const producto = await Product.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: `Producto con ID ${item.productoId} no encontrado`
        });
      }

      // Verificar disponibilidad de stock
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          mensaje: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`
        });
      }

      // Calcular subtotal
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      itemsProcessados.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: item.cantidad,
        subtotal
      });

      // Reducir stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Crear la orden
    const orden = new Order({
      usuarioId: req.usuario._id,
      items: itemsProcessados,
      total,
      direccion,
      notas,
      estado: 'pendiente'
    });

    await orden.save();
    await orden.populate('usuarioId', 'nombre email');
    await orden.populate('items.productoId');

    res.status(201).json({
      success: true,
      mensaje: 'Orden creada exitosamente',
      orden
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener órdenes del usuario autenticado
 * GET /orders/mis-ordenes
 */
exports.obtenerMisOrdenes = async (req, res, next) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const skip = (pagina - 1) * limite;

    const ordenes = await Order.find({ usuarioId: req.usuario._id })
      .populate('items.productoId', 'nombre imagen precio')
      .limit(parseInt(limite))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({ usuarioId: req.usuario._id });

    res.status(200).json({
      success: true,
      total,
      pagina: parseInt(pagina),
      paginas: Math.ceil(total / limite),
      ordenes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener una orden específica del usuario
 * GET /orders/:id
 */
exports.obtenerOrdenPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orden = await Order.findById(id)
      .populate('usuarioId', 'nombre email')
      .populate('items.productoId');

    if (!orden) {
      return res.status(404).json({
        success: false,
        mensaje: 'Orden no encontrada'
      });
    }

    // Verificar que el usuario sea propietario o admin
    if (orden.usuarioId._id.toString() !== req.usuario._id && !req.usuario.isAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para acceder a esta orden'
      });
    }

    res.status(200).json({
      success: true,
      orden
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener todas las órdenes (solo admin)
 * GET /orders
 */
exports.obtenerTodasLasOrdenes = async (req, res, next) => {
  try {
    const { pagina = 1, limite = 10, estado } = req.query;
    const skip = (pagina - 1) * limite;
    const filtro = {};

    if (estado) {
      filtro.estado = estado;
    }

    const ordenes = await Order.find(filtro)
      .populate('usuarioId', 'nombre email')
      .populate('items.productoId', 'nombre imagen')
      .limit(parseInt(limite))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filtro);

    res.status(200).json({
      success: true,
      total,
      pagina: parseInt(pagina),
      paginas: Math.ceil(total / limite),
      ordenes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Actualizar estado de la orden (solo admin)
 * PUT /orders/:id/estado
 */
exports.actualizarEstadoOrden = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, numeroSeguimiento } = req.body;

    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        mensaje: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`
      });
    }

    const actualizaciones = { estado };
    if (numeroSeguimiento) {
      actualizaciones.numeroSeguimiento = numeroSeguimiento;
    }

    const orden = await Order.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate('usuarioId', 'nombre email')
     .populate('items.productoId');

    if (!orden) {
      return res.status(404).json({
        success: false,
        mensaje: 'Orden no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      mensaje: 'Estado de la orden actualizado',
      orden
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Cancelar orden
 * PUT /orders/:id/cancelar
 */
exports.cancelarOrden = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orden = await Order.findById(id);

    if (!orden) {
      return res.status(404).json({
        success: false,
        mensaje: 'Orden no encontrada'
      });
    }

    // Verificar que el usuario sea propietario o admin
    if (orden.usuarioId.toString() !== req.usuario._id && !req.usuario.isAdmin) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para cancelar esta orden'
      });
    }

    // Solo se pueden cancelar órdenes pendientes o procesando
    if (!['pendiente', 'procesando'].includes(orden.estado)) {
      return res.status(400).json({
        success: false,
        mensaje: `No se puede cancelar una orden en estado ${orden.estado}`
      });
    }

    // Restituir stock
    for (const item of orden.items) {
      const producto = await Product.findById(item.productoId);
      if (producto) {
        producto.stock += item.cantidad;
        await producto.save();
      }
    }

    orden.estado = 'cancelado';
    await orden.save();

    res.status(200).json({
      success: true,
      mensaje: 'Orden cancelada y stock restituido',
      orden
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener estadísticas de órdenes (solo admin)
 * GET /orders/stats/dashboard
 */
exports.obtenerEstadisticas = async (req, res, next) => {
  try {
    const totalOrdenes = await Order.countDocuments();
    const ingresoTotal = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordenesPorEstado = await Order.aggregate([
      { $group: { _id: '$estado', cantidad: { $sum: 1 } } }
    ]);

    const ordenesPorMes = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          cantidad: { $sum: 1 },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      estadisticas: {
        totalOrdenes,
        ingresoTotal: ingresoTotal[0]?.total || 0,
        ordenesPorEstado,
        ordenesPorMes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
