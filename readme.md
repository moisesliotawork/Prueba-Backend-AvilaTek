# Prueba Backend AvilaTek - API REST (Node.js + Express + MongoDB)

## 1. API REST DOCUMENTADA

### Endpoints principales

#### Autenticación

- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión y obtención de token JWT

#### Productos

- `GET /api/products` - Listar productos (requiere token)
- `POST /api/products` - Crear producto (solo ADMIN)
- `PUT /api/products/:id` - Actualizar producto (solo ADMIN)
- `DELETE /api/products/:id` - Eliminar producto (solo ADMIN)

#### Pedidos (CUSTOMER)

- `POST /api/orders` - Crear pedido con items y cantidades
- `GET /api/orders` - Historial de pedidos del usuario autenticado

#### Pedidos (ADMIN)

- `GET /api/admin/orders` - Ver todos los pedidos del sistema
- `PUT /api/admin/orders/:id` - Cambiar estado del pedido a `pendiente`, `procesado`, `cancelado`

### Autenticación

- Se usa JWT
- Se requiere el header:

```
Authorization: Bearer <token>
```

### Formatos

- **Registro**:

```json
{
  "name": "Moises",
  "email": "moises@example.com",
  "password": "12345678"
}
```

- **Login**:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

- **Crear producto**:

```json
{
  "name": "Producto Ejemplo",
  "description": "Detalles...",
  "price": 99.9,
  "stock": 10
}
```

- **Crear pedido**:

```json
{
  "items": [
    { "product": "<productId>", "quantity": 2 }
  ]
}
```

---

## 2. CÓDIGO Y BUENAS PRÁCTICAS

- Separación por capas:

  - `/models`: Esquemas Mongoose
  - `/controllers`: Lógica de negocio
  - `/routes`: Rutas segmentadas por recurso
  - `/middlewares`: Autenticación y roles
  - `/database`: Factories y seeder

- Validaciones incluidas:

  - Stock, duplicados, cantidad válida, roles, token JWT

- Estructura clara, modular, mantenible

- Uso de `dotenv`, `bcrypt`, `jsonwebtoken`, `mongoose`, `@faker-js/faker`

---

## 3. DECISIONES DE DISEÑO

### a. Elecciones generales

- **Base de datos**: MongoDB Atlas

  - Elección por facilidad de integración con Mongoose, flexibilidad y disponibilidad gratuita en la nube

- **Framework**: Express.js

  - Obligatorio y ampliamente usado en entornos productivos

- **Autenticación**: JWT

  - Escalable, sin estado y compatible con APIs REST

- **Roles**: Se implementó distinción entre `ADMIN` y `CUSTOMER` para proteger funcionalidades según el perfil

- **Seeder + Faker**: Permite generar datos rápidamente para pruebas, a traves del comando `npm run dev`

### b. Arquitectura

- Modular y dividida por responsabilidad
- Controladores reutilizables
- Middlewares separados para autenticar y autorizar
- Uso de `.env` para configuraciones sensibles
