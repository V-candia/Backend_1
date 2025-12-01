const { sequelize } = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    nombre: 'One Piece Vol. 100',
    descripcion: 'El volumen 100 de la legendaria serie de piratas.',
    precio: 15000,
    imagen: 'https://m.media-amazon.com/images/I/81K1gq4C7hL._AC_UF1000,1000_QL80_.jpg',
    stock: 50,
    categoria: 'Shounen',
    autor: 'Eiichiro Oda',
    editorial: 'Shueisha'
  },
  {
    nombre: 'Naruto Vol. 1',
    descripcion: 'El comienzo de la historia del ninja rubio.',
    precio: 12000,
    imagen: 'https://m.media-amazon.com/images/I/912xRMMra4L._AC_UF1000,1000_QL80_.jpg',
    stock: 30,
    categoria: 'Shounen',
    autor: 'Masashi Kishimoto',
    editorial: 'Shueisha'
  },
  {
    nombre: 'Berserk Vol. 1',
    descripcion: 'La oscura historia de Guts, el espadachín negro.',
    precio: 18000,
    imagen: 'https://m.media-amazon.com/images/I/81M4b+6jOtL._AC_UF1000,1000_QL80_.jpg',
    stock: 20,
    categoria: 'Seinen',
    autor: 'Kentaro Miura',
    editorial: 'Hakusensha'
  },
  {
    nombre: 'Sailor Moon Vol. 1',
    descripcion: 'La guardiana que lucha por el amor y la justicia.',
    precio: 13000,
    imagen: 'https://m.media-amazon.com/images/I/81XzF+I+JdL._AC_UF1000,1000_QL80_.jpg',
    stock: 40,
    categoria: 'Shoujo',
    autor: 'Naoko Takeuchi',
    editorial: 'Kodansha'
  },
  {
    nombre: 'Uzumaki',
    descripcion: 'Una historia de terror sobre espirales.',
    precio: 25000,
    imagen: 'https://m.media-amazon.com/images/I/91Ar+rW8MSL._AC_UF1000,1000_QL80_.jpg',
    stock: 15,
    categoria: 'Horror',
    autor: 'Junji Ito',
    editorial: 'Shogakukan'
  }
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida para seeding.');

    // Sincronizar forzando la creación de tablas (solo para seed inicial)
    // await sequelize.sync({ force: true });
    // Mejor usamos alter para no borrar si ya existe, o force si queremos reiniciar
    // Para el seed, asumimos que queremos datos limpios o agregar si faltan.

    // Crear productos
    for (const product of products) {
      await Product.findOrCreate({
        where: { nombre: product.nombre },
        defaults: product
      });
    }
    console.log('Productos insertados.');

    // Crear usuario admin
    const adminEmail = 'admin@tienda.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      await User.create({
        nombre: 'Administrador',
        email: adminEmail,
        password: 'admin123', // El modelo debería hashear esto
        isAdmin: true,
        activo: true
      });
      console.log('Usuario Admin creado: admin@tienda.com / admin123');
    } else {
      console.log('Usuario Admin ya existe.');
    }

    // Crear usuario cliente
    const clientEmail = 'cliente@tienda.com';
    const clientExists = await User.findOne({ where: { email: clientEmail } });

    if (!clientExists) {
      await User.create({
        nombre: 'Cliente Prueba',
        email: clientEmail,
        password: 'cliente123',
        isAdmin: false,
        activo: true
      });
      console.log('Usuario Cliente creado: cliente@tienda.com / cliente123');
    } else {
      console.log('Usuario Cliente ya existe.');
    }

    console.log('Seeding completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error en seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
