const mongoose = require('mongoose');

/**
 * Esquema de Orden/Compra
 * - usuarioId: Referencia al usuario que hizo la compra
 * - items: Array de productos en la orden
 * - total: Total de la orden
 * - estado: Estado del pedido (pendiente, procesando, enviado, entregado, cancelado)
 * - direccion: Dirección de envío
 */
const orderSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del usuario es requerido']
    },
    items: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        nombre: {
          type: String,
          required: true
        },
        precio: {
          type: Number,
          required: true
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1
        },
        subtotal: {
          type: Number,
          required: true
        }
      }
    ],
    total: {
      type: Number,
      required: [true, 'El total es requerido'],
      min: 0
    },
    estado: {
      type: String,
      enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente'
    },
    direccion: {
      calle: {
        type: String,
        required: true
      },
      ciudad: {
        type: String,
        required: true
      },
      codigoPostal: {
        type: String,
        required: true
      },
      pais: {
        type: String,
        required: true
      }
    },
    notas: {
      type: String,
      trim: true
    },
    numeroSeguimiento: {
      type: String
    }
  },
  { 
    timestamps: true
  }
);

/**
 * Índices para mejorar búsquedas
 */
orderSchema.index({ usuarioId: 1, createdAt: -1 });
orderSchema.index({ estado: 1 });

module.exports = mongoose.model('Order', orderSchema);
