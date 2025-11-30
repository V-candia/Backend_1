const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Esquema de Usuario
 * - email: Email único del usuario
 * - password: Contraseña hasheada con bcrypt
 * - nombre: Nombre completo
 * - isAdmin: Indicador de rol administrador
 * - fechaRegistro: Fecha de creación de la cuenta
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor proporciona un email válido'
      ]
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: 6,
      select: false // No retorna la contraseña por defecto
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true // createdAt y updatedAt automáticos
  }
);

/**
 * Middleware: Hashear contraseña antes de guardar
 */
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Método: Comparar contraseña ingresada con la hasheada
 */
userSchema.methods.matchPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

/**
 * Método: Retornar usuario sin información sensible
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
