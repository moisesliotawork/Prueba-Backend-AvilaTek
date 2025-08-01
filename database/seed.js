require("dotenv").config();
const mongoose = require("mongoose");
const { userFactory } = require("./factories/user.factory");
const { productFactory } = require("./factories/product.factory");

const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const bcrypt = require("bcrypt");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");

    // Limpiar las colecciones
    await User.deleteMany();
    await Product.deleteMany();

    // Crear usuario ADMIN manual
    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "123456",
      role: "ADMIN",
    });
    await admin.save();

    // Crear usuarios CUSTOMER con factory
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await userFactory();
      await user.save();
      users.push(user);
    }

    // Crear productos
    for (let i = 0; i < 10; i++) {
      const product = productFactory();
      await product.save();
    }

    console.log("Datos cargados con éxito");
    process.exit();
  } catch (err) {
    console.error("Error al cargar seeds la base de datos:", err);
    process.exit(1);
  }
})();
