const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado correctamente'))
.catch((err) => {
  console.error('Error al conectar MongoDB:', err);
  process.exit(1);
});
