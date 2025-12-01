const { DataTypes, JSON: SequelizeJSON } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');

/**
 * Modelo de Orden/Compra
 * - usuarioId: Referencia al usuario que hizo la compra
 * - items: Array de productos en JSON
 * - total: Total de la orden
 * - estado: Estado del pedido
 * - direccion: Dirección de envío
 */
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: SequelizeJSON,
    allowNull: false,
    defaultValue: []
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  direccion: {
    type: SequelizeJSON,
    allowNull: false
  },
  notas: {
    type: DataTypes.TEXT
  },
  numeroSeguimiento: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  tableName: 'orders'
});

// Relaciones
Order.belongsTo(User, { foreignKey: 'usuarioId' });
User.hasMany(Order, { foreignKey: 'usuarioId' });

module.exports = Order;
