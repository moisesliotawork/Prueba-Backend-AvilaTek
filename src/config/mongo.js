const mongoose = require("mongoose");

console.log("Conectando a MongoDB Atlas...");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("Error al conectar MongoDB:", err.message);
    process.exit(1);
  });
