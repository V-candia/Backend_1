const { sequelize } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD.');

    const adminEmail = 'admin@tienda.com';
    const admin = await User.findOne({ where: { email: adminEmail } });

    if (admin) {
      console.log('Usuario admin encontrado. Actualizando contraseña...');
      // Manually hash to ensure it works regardless of hooks
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      // IMPORTANT: Disable hooks to prevent double hashing by beforeUpdate
      await admin.save({ hooks: false });
      console.log('Contraseña de admin actualizada (hasheada) a: admin123');
    } else {
      console.log('Usuario admin no encontrado. Creándolo...');
      await User.create({
        nombre: 'Administrador',
        email: adminEmail,
        password: 'admin123', // Hook will handle this for create
        isAdmin: true,
        activo: true
      });
      console.log('Usuario admin creado: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdmin();
