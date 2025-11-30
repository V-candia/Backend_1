require('dotenv').config();
const { connectDB, sequelize } = require('../config/database');
const Product = require('../models/Product');

/**
 * Datos iniciales de mangas para la tienda
 */
const mangasSeed = [
  {
    nombre: 'One Piece Vol. 1',
    descripcion: 'Comienza la aventura de Monkey D. Luffy en busca del legendario tesoro One Piece.',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/300x400?text=One+Piece+Vol.1',
    stock: 50,
    categoria: 'Shounen',
    autor: 'Eiichiro Oda',
    editorial: 'Shueisha',
    calificacion: 5
  },
  {
    nombre: 'Naruto Vol. 1',
    descripcion: 'Sigue la historia de Naruto Uzumaki, un joven ninja con grandes sueños.',
    precio: 14.99,
    imagen: 'https://via.placeholder.com/300x400?text=Naruto+Vol.1',
    stock: 45,
    categoria: 'Shounen',
    autor: 'Masashi Kishimoto',
    editorial: 'Shueisha',
    calificacion: 4.8
  },
  {
    nombre: 'Demon Slayer Vol. 1',
    descripcion: 'Un joven se convierte en cazador de demonios para vengar a su familia.',
    precio: 16.99,
    imagen: 'https://via.placeholder.com/300x400?text=Demon+Slayer+Vol.1',
    stock: 60,
    categoria: 'Shounen',
    autor: 'Koyoharu Gotouge',
    editorial: 'Shueisha',
    calificacion: 4.9
  },
  {
    nombre: 'Attack on Titan Vol. 1',
    descripcion: 'Gigantes humanoides atacan a la humanidad encerrada en muros.¿Cuál es la verdad?',
    precio: 17.99,
    imagen: 'https://via.placeholder.com/300x400?text=Attack+on+Titan+Vol.1',
    stock: 55,
    categoria: 'Shounen',
    autor: 'Hajime Isayama',
    editorial: 'Kodansha',
    calificacion: 4.7
  },
  {
    nombre: 'My Hero Academia Vol. 1',
    descripcion: 'En un mundo donde todos tienen poderes, un chico quiere ser héroe sin ellos.',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/300x400?text=My+Hero+Academia+Vol.1',
    stock: 50,
    categoria: 'Shounen',
    autor: 'Kohei Horikoshi',
    editorial: 'Shueisha',
    calificacion: 4.8
  },
  {
    nombre: 'Fruits Basket Vol. 1',
    descripcion: 'Una chica descubre que la familia del hombre que la ayuda tiene un secreto mágico.',
    precio: 14.99,
    imagen: 'https://via.placeholder.com/300x400?text=Fruits+Basket+Vol.1',
    stock: 40,
    categoria: 'Shoujo',
    autor: 'Natsuki Takaya',
    editorial: 'Hakusensha',
    calificacion: 4.6
  },
  {
    nombre: 'Sailor Moon Vol. 1',
    descripcion: 'Marineros del siglo XX se despiertan para salvar al mundo de fuerzas oscuras.',
    precio: 13.99,
    imagen: 'https://via.placeholder.com/300x400?text=Sailor+Moon+Vol.1',
    stock: 35,
    categoria: 'Shoujo',
    autor: 'Naoko Takeuchi',
    editorial: 'Kodansha',
    calificacion: 4.5
  },
  {
    nombre: 'Kaguya-sama Love is War Vol. 1',
    descripcion: 'Dos genios se enfrentan en una batalla psicológica por quien se enamora primero.',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/300x400?text=Kaguya-sama+Love+is+War+Vol.1',
    stock: 48,
    categoria: 'Shoujo',
    autor: 'Aka Akasaka',
    editorial: 'Shueisha',
    calificacion: 4.7
  },
  {
    nombre: 'Berserk Vol. 1',
    descripcion: 'Un guerrero en busca de venganza contra aquellos que destruyeron su vida.',
    precio: 18.99,
    imagen: 'https://via.placeholder.com/300x400?text=Berserk+Vol.1',
    stock: 30,
    categoria: 'Seinen',
    autor: 'Kentaro Miura',
    editorial: 'Young Animal',
    calificacion: 4.9
  },
  {
    nombre: 'Vinland Saga Vol. 1',
    descripcion: 'La historia épica de vikingos en busca de la tierra legendaria Vinland.',
    precio: 17.99,
    imagen: 'https://via.placeholder.com/300x400?text=Vinland+Saga+Vol.1',
    stock: 42,
    categoria: 'Seinen',
    autor: 'Makoto Yukimura',
    editorial: 'Wit Studio',
    calificacion: 4.8
  },
  {
    nombre: 'Jujutsu Kaisen Vol. 1',
    descripcion: 'Un estudiante se une a una escuela de hechiceros para combatir maldiciones.',
    precio: 16.99,
    imagen: 'https://via.placeholder.com/300x400?text=Jujutsu+Kaisen+Vol.1',
    stock: 55,
    categoria: 'Shounen',
    autor: 'Gege Akutami',
    editorial: 'Shueisha',
    calificacion: 4.9
  },
  {
    nombre: 'Chainsaw Man Vol. 1',
    descripcion: 'Un joven con el poder de una motosierra lucha contra demonios en la oscuridad.',
    precio: 16.99,
    imagen: 'https://via.placeholder.com/300x400?text=Chainsaw+Man+Vol.1',
    stock: 50,
    categoria: 'Shounen',
    autor: 'Tatsuki Fujimoto',
    editorial: 'Shueisha',
    calificacion: 4.8
  },
  {
    nombre: 'Death Note Vol. 1',
    descripcion: 'Un estudiante encuentra un cuaderno que puede matar a cualquiera cuyo nombre escriba.',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/300x400?text=Death+Note+Vol.1',
    stock: 45,
    categoria: 'Shounen',
    autor: 'Tsugumi Ohba',
    editorial: 'Shueisha',
    calificacion: 4.9
  },
  {
    nombre: 'Bleach Vol. 1',
    descripcion: 'Un joven adquiere el poder de un guardiancita del Soul Society.',
    precio: 14.99,
    imagen: 'https://via.placeholder.com/300x400?text=Bleach+Vol.1',
    stock: 40,
    categoria: 'Shounen',
    autor: 'Tite Kubo',
    editorial: 'Shueisha',
    calificacion: 4.7
  },
  {
    nombre: 'Fullmetal Alchemist Vol. 1',
    descripcion: 'Dos hermanos buscan la piedra filosofal para restaurar sus cuerpos.',
    precio: 15.99,
    imagen: 'https://via.placeholder.com/300x400?text=Fullmetal+Alchemist+Vol.1',
    stock: 35,
    categoria: 'Shounen',
    autor: 'Hiromu Arakawa',
    editorial: 'Square Enix',
    calificacion: 4.9
  }
];

/**
 * Función para hacer seed de productos
 */
const seedDB = async () => {
  try {
    // Conectar a base de datos
    await connectDB();

    // Limpiar tabla anterior
    await Product.destroy({ where: {} });
    console.log('OK Tabla de productos limpiada');

    // Insertar nuevos productos
    const productosCreados = await Product.bulkCreate(mangasSeed);
    console.log(`OK ${productosCreados.length} productos insertados exitosamente`);

    // Mostrar productos creados
    console.log('\nProductos en la base de datos:');
    productosCreados.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.nombre} - $${prod.precio}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error durante el seed:', error.message);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
