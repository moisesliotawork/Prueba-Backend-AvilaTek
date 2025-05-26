import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes'; // Importa las rutas de autenticación
import { authenticate } from './middlewares/auth'; // Importa el middleware de autenticación

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('E-Commerce API is running');
});

// 1. Registrar rutas de autenticación
app.use('/api/auth', authRoutes);

// 2. Ejemplo de ruta protegida (usa el middleware de autenticación)
app.get('/api/protected-route', authenticate, (req, res) => {
  // El middleware authenticate añade el userId al request
  const userId = (req as any).userId;
  res.json({ 
    message: 'Acceso a ruta protegida concedido',
    userId 
  });
});

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔴 Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});