const mongoose = require('mongoose');

/**
 * Conecta a MongoDB usando Mongoose
 * @returns {Promise} Promesa de la conexión
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB conectado exitosamente');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
