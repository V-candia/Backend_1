const mongoose = require('mongoose');

/**
 * Esquema de Producto
 * - nombre: Nombre del manga
 * - descripcion: Descripción del producto
 * - precio: Precio en unidades monetarias
 * - imagen: URL de la imagen
 * - stock: Cantidad disponible
 * - categoria: Categoría del manga (Shounen, Shoujo, Seinen, etc)
 */
const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo']
    },
    imagen: {
      type: String,
      required: [true, 'La URL de la imagen es requerida']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es requerido'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: ['Shounen', 'Shoujo', 'Seinen', 'Josei', 'Horror', 'Romance', 'Aventura', 'Comedia', 'Otro'],
      default: 'Otro'
    },
    autor: {
      type: String,
      trim: true
    },
    editorial: {
      type: String,
      trim: true
    },
    calificacion: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    numeroResenas: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true
  }
);

/**
 * Índices para mejorar búsquedas
 */
productSchema.index({ nombre: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1 });

module.exports = mongoose.model('Product', productSchema);
