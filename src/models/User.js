const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

/**
 * Modelo de Usuario
 * - email: Email único del usuario
 * - password: Contraseña hasheada con bcrypt
 * - nombre: Nombre completo
 * - isAdmin: Indicador de rol administrador
 * - activo: Estado del usuario
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'users'
});

/**
 * Hook: Hashear contraseña antes de guardar
 */
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

/**
 * Método: Comparar contraseña ingresada con la hasheada
 */
User.prototype.matchPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

/**
 * Método: Retornar usuario sin información sensible
 */
User.prototype.toJSON = function() {
  const values = { ...this.dataValues };
  delete values.password;
  return values;
};

module.exports = User;
