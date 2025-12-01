const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo de Producto
 * - nombre: Nombre del manga
 * - descripcion: Descripción del producto
 * - precio: Precio en unidades monetarias
 * - imagen: URL de la imagen
 * - stock: Cantidad disponible
 * - categoria: Categoría del manga
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  categoria: {
    type: DataTypes.ENUM('Shounen', 'Shoujo', 'Seinen', 'Josei', 'Horror', 'Romance', 'Aventura', 'Comedia', 'Otro'),
    defaultValue: 'Otro'
  },
  autor: {
    type: DataTypes.STRING,
    trim: true
  },
  editorial: {
    type: DataTypes.STRING,
    trim: true
  },
  calificacion: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  numeroResenas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'products'
});

module.exports = Product;
