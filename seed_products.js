const { sequelize } = require('./src/config/database');
const Product = require('./src/models/Product');
const { mangasData } = require('../src/data/mangas'); // Adjust path if needed, or hardcode data

// Hardcoded data if import fails or is complex
const products = [
  {
    nombre: 'One Piece Vol. 1',
    descripcion: 'El inicio de la gran aventura de Luffy.',
    precio: 9990,
    imagen: 'https://m.media-amazon.com/images/I/91d05GgWd+L._AC_UF1000,1000_QL80_.jpg',
    categoria: 'Shounen',
    stock: 50,
    autor: 'Eiichiro Oda',
    editorial: 'Panini'
  },
  {
    nombre: 'Naruto Vol. 1',
    descripcion: 'Naruto Uzumaki quiere ser Hokage.',
    precio: 8990,
    imagen: 'https://m.media-amazon.com/images/I/912xRzDB0JL._AC_UF1000,1000_QL80_.jpg',
    categoria: 'Shounen',
    stock: 30,
    autor: 'Masashi Kishimoto',
    editorial: 'Panini'
  },
  {
    nombre: 'Berserk Vol. 1',
    descripcion: 'La historia de Guts, el espadachín negro.',
    precio: 12990,
    imagen: 'https://m.media-amazon.com/images/I/91D07epNE9L._AC_UF1000,1000_QL80_.jpg',
    categoria: 'Seinen',
    stock: 20,
    autor: 'Kentaro Miura',
    editorial: 'Panini'
  }
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Sync models (force: false to keep existing tables if any, but we want to ensure table exists)
    await sequelize.sync();

    for (const p of products) {
      await Product.create(p);
    }

    console.log('✅ Products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
