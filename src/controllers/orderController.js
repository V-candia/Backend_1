const { productosData } = require('../data/productos');
const { sequelize } = require('../config/database');
const jwt = require('jsonwebtoken');

exports.crearOrden = async (req, res) => {
  try {
    const { items, direccion } = req.body;
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token requerido'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido'
      });
    }

    const usuarioId = decoded.id || decoded.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se pudo obtener el ID del usuario'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        mensajes: ['items debe contener al menos 1 producto']
      });
    }

    if (!direccion || !direccion.calle || !direccion.ciudad || !direccion.codigoPostal || !direccion.pais) {
      return res.status(400).json({
        success: false,
        mensajes: ['Todos los campos de dirección son requeridos']
      });
    }

    let total = 0;
    const itemsValidados = items.map(item => {
      const producto = productosData.find(p => p.id === parseInt(item.productoId));
      
      if (!producto) {
        throw new Error(`Producto con ID ${item.productoId} no encontrado`);
      }

      if (item.cantidad <= 0) {
        throw new Error(`Cantidad debe ser mayor a 0`);
      }

      if (item.cantidad > producto.stock) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      const subtotal = item.cantidad * producto.precio;
      total += subtotal;

      return {
        productoId: item.productoId,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio: producto.precio,
        subtotal: subtotal
      };
    });

    const query = `INSERT INTO orders (usuarioId, items, total, estado, direccion, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    
    const [result] = await sequelize.query(query, {
      replacements: [usuarioId, JSON.stringify(itemsValidados), total, 'pendiente', JSON.stringify(direccion)],
      type: 'INSERT'
    });

    res.status(201).json({
      success: true,
      mensaje: 'Orden creada exitosamente',
      orden: {
        id: result,
        usuarioId: usuarioId,
        items: itemsValidados,
        total: total,
        estado: 'pendiente',
        direccion: direccion,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(400).json({
      success: false,
      mensaje: error.message || 'Error al crear la orden'
    });
  }
};

exports.obtenerMisOrdenes = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token requerido'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido'
      });
    }

    const usuarioId = decoded.id || decoded.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se pudo obtener el ID del usuario'
      });
    }

    const query = 'SELECT * FROM orders WHERE usuarioId = ? ORDER BY createdAt DESC';
    const [ordenes] = await sequelize.query(query, {
      replacements: [usuarioId],
      type: 'SELECT'
    });

    res.json({
      success: true,
      ordenes: ordenes
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener órdenes'
    });
  }
};

exports.obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token requerido'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido'
      });
    }

    const usuarioId = decoded.id || decoded.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se pudo obtener el ID del usuario'
      });
    }

    const query = 'SELECT * FROM orders WHERE id = ? AND usuarioId = ?';
    const [rows] = await sequelize.query(query, {
      replacements: [id, usuarioId],
      type: 'SELECT'
    });
    
    const orden = rows[0];

    if (!orden) {
      return res.status(404).json({
        success: false,
        mensaje: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      orden: orden
    });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener la orden'
    });
  }
};

module.exports = exports;
