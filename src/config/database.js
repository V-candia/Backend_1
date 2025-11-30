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
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  }
);

/**
 * Conecta a la base de datos
 * @returns {Promise} Promesa de la conexión
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('OK MySQL conectado exitosamente');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: false });
    console.log('OK Modelos sincronizados');
    
    return sequelize;
  } catch (error) {
    console.error('Error al conectar MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
