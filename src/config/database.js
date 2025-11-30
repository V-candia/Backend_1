const { Sequelize } = require('sequelize');

/**
 * Conecta a MySQL usando Sequelize
 * Variables de entorno requeridas:
 * - DB_HOST: Host del servidor (localhost)
 * - DB_PORT: Puerto (3306)
 * - DB_NAME: Nombre de la base de datos
 * - DB_USER: Usuario MySQL
 * - DB_PASSWORD: Contraseña MySQL
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'manga_store',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

/**
 * Conecta a la base de datos
 * @returns {Promise} Promesa de la conexión
 */
const connectDB = async () => {
  try {
    // Primero deshabilitar restricciones de claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await sequelize.authenticate();
    console.log('OK MySQL conectado exitosamente');
    
    // Sincronizar modelos - eliminar y recrear tablas
    await sequelize.sync({ force: true });
    console.log('OK Modelos sincronizados');
    
    // Re-habilitar restricciones de claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    return sequelize;
  } catch (error) {
    console.error('Error al conectar MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
