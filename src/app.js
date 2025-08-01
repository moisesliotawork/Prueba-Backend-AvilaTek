const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB Atlas
require("./config/mongo");

// Rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

// Placeholder para rutas futuras (productos, pedidos)
module.exports = app;
