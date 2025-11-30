const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorAPI } = require('../middleware/errorHandler');
const { validarRegistro, validarLogin } = require('../utils/validacion');

/**
 * Generar JWT token
 */
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      isAdmin: usuario.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Controlador: Registrar nuevo usuario
 * POST /auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { error, value } = validarRegistro(req.body);
    
    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        mensajes
      });
    }

    const { email, password, nombre } = value;

    // Verificar si el usuario ya existe
    let usuario = await User.findOne({ where: { email } });
    if (usuario) {
      return res.status(400).json({
        success: false,
        mensaje: 'El usuario ya existe con este email'
      });
    }

    // Crear nuevo usuario
    usuario = await User.create({
      email,
      password,
      nombre,
      isAdmin: false
    });

    // Generar token
    const token = generarToken(usuario);

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: usuario.toJSON ? usuario.toJSON() : usuario.dataValues
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Login de usuario
 * POST /auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { error, value } = validarLogin(req.body);
    
    if (error) {
      const mensajes = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        mensajes
      });
    }

    const { email, password } = value;

    // Buscar usuario
    const usuario = await User.findOne({ where: { email } });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const esValida = await usuario.matchPassword(password);
    if (!esValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        mensaje: 'Esta cuenta ha sido desactivada'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    res.status(200).json({
      success: true,
      mensaje: 'Login exitoso',
      token,
      usuario: usuario.dataValues
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Obtener perfil del usuario autenticado
 * GET /auth/perfil
 */
exports.obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      usuario: usuario.dataValues
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Actualizar perfil del usuario
 * PUT /auth/perfil
 */
exports.actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, email } = req.body;
    const actualizaciones = {};

    if (nombre) actualizaciones.nombre = nombre;
    if (email && email !== req.usuario.email) {
      // Verificar que el email no esté registrado
      const usuarioExistente = await User.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'Este email ya está registrado'
        });
      }
      actualizaciones.email = email;
    }

    await User.update(
      actualizaciones,
      { where: { id: req.usuario.id } }
    );

    const usuario = await User.findByPk(req.usuario.id);

    res.status(200).json({
      success: true,
      mensaje: 'Perfil actualizado',
      usuario: usuario.dataValues
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador: Cambiar contraseña
 * POST /auth/cambiar-password
 */
exports.cambiarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva, passwordNuevaConfirm } = req.body;

    if (!passwordActual || !passwordNueva || !passwordNuevaConfirm) {
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos son requeridos'
      });
    }

    if (passwordNueva !== passwordNuevaConfirm) {
      return res.status(400).json({
        success: false,
        mensaje: 'Las contraseñas no coinciden'
      });
    }

    const usuario = await User.findByPk(req.usuario.id);

    // Verificar contraseña actual
    const esValida = await usuario.matchPassword(passwordActual);
    if (!esValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Contraseña actual inválida'
      });
    }

    await User.update(
      { password: passwordNueva },
      { where: { id: req.usuario.id } }
    );

    res.status(200).json({
      success: true,
      mensaje: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
