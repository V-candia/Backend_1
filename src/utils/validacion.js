const Joi = require('joi');

/**
 * Validación de registro de usuario
 */
const validarRegistro = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email inválido',
        'any.required': 'Email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'Contraseña es requerida'
      }),
    nombre: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'any.required': 'Nombre es requerido'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validación de login
 */
const validarLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email inválido',
        'any.required': 'Email es requerido'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Contraseña es requerida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validación de producto
 */
const validarProducto = (data) => {
  const schema = Joi.object({
    nombre: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'any.required': 'Nombre es requerido'
      }),
    descripcion: Joi.string()
      .required()
      .messages({
        'any.required': 'Descripción es requerida'
      }),
    precio: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'El precio no puede ser negativo',
        'any.required': 'Precio es requerido'
      }),
    imagen: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'Imagen debe ser una URL válida',
        'any.required': 'Imagen es requerida'
      }),
    stock: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'Stock no puede ser negativo',
        'any.required': 'Stock es requerido'
      }),
    categoria: Joi.string()
      .valid('Shounen', 'Shoujo', 'Seinen', 'Josei', 'Horror', 'Romance', 'Aventura', 'Comedia', 'Otro')
      .required()
      .messages({
        'any.only': 'Categoría no válida',
        'any.required': 'Categoría es requerida'
      }),
    autor: Joi.string().optional(),
    editorial: Joi.string().optional()
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validación de orden
 */
const validarOrden = (data) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productoId: Joi.string().required(),
          cantidad: Joi.number().min(1).required()
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Debe haber al menos un item',
        'any.required': 'Items son requeridos'
      }),
    direccion: Joi.object({
      calle: Joi.string().required(),
      ciudad: Joi.string().required(),
      codigoPostal: Joi.string().required(),
      pais: Joi.string().required()
    })
      .required()
      .messages({
        'any.required': 'Dirección es requerida'
      }),
    notas: Joi.string().optional()
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validarRegistro,
  validarLogin,
  validarProducto,
  validarOrden
};
