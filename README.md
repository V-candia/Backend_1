# 🛒 Backend Tienda de Manga - Documentación API

Backend Node.js/Express completo para una tienda online de manga con autenticación JWT, gestión de productos y órdenes.

## 📋 Características

 **Autenticación y Usuarios**
- Registro y login de usuarios
- Contraseñas hasheadas con bcrypt
- JWT tokens para autenticación
- Perfiles de usuario y roles (admin)

 **Gestión de Productos**
- CRUD completo de productos
- Filtrado por categoría
- Búsqueda por texto
- Paginación

 **Sistema de Órdenes**
- Creación de órdenes desde carrito
- Gestión de estado de órdenes
- Control de stock automático
- Seguimiento de pedidos

 **Seguridad**
- CORS configurado
- Rate limiting
- Validación de datos
- Manejo centralizado de errores

---

##  Inicio Rápido

### 1. Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env (copiar desde .env.example)
cp .env.example .env

# Editar .env con tus credenciales de MongoDB
```

### 2. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster
4. Obtén la conexión URI
5. Pega la URI en el archivo `.env`

```
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/manga-store?retryWrites=true&w=majority
```

### 3. Cargar datos iniciales (seed)

```bash
# Llenar la base de datos con productos de manga
npm run seed
```

### 4. Ejecutar en desarrollo

```bash
# Con nodemon (recarga automática)
npm run dev

# O sin nodemon
npm start
```

El servidor estará disponible en `http://localhost:5000`

---

##  Endpoints de la API

###  AUTENTICACIÓN

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan Pérez"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "...",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}
```

---

#### Obtener perfil (requiere autenticación)
```http
GET /api/auth/perfil
Authorization: Bearer <token>
```

---

#### Actualizar perfil
```http
PUT /api/auth/perfil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "email": "newemail@example.com"
}
```

---

#### Cambiar contraseña
```http
POST /api/auth/cambiar-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "passwordActual": "password123",
  "passwordNueva": "newpassword456",
  "passwordNuevaConfirm": "newpassword456"
}
```

---

###  PRODUCTOS

#### Listar todos los productos
```http
GET /api/products?pagina=1&limite=10&categoria=Shounen
```

**Query parameters:**
- `pagina` (default: 1) - Número de página
- `limite` (default: 10) - Productos por página
- `categoria` - Filtrar por categoría
- `buscar` - Búsqueda por texto

**Respuesta:**
```json
{
  "success": true,
  "total": 15,
  "pagina": 1,
  "paginas": 2,
  "productos": [
    {
      "_id": "...",
      "nombre": "One Piece Vol. 1",
      "descripcion": "...",
      "precio": 15.99,
      "imagen": "...",
      "stock": 50,
      "categoria": "Shounen",
      "autor": "Eiichiro Oda",
      "calificacion": 5,
      "createdAt": "..."
    }
  ]
}
```

---

#### Obtener un producto
```http
GET /api/products/:id
```

---

#### Obtener por categoría
```http
GET /api/products/categoria/Shounen?pagina=1&limite=10
```

---

#### Crear producto (solo admin)
```http
POST /api/products
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "nombre": "Manga Title",
  "descripcion": "Descripción del manga",
  "precio": 15.99,
  "imagen": "https://...",
  "stock": 50,
  "categoria": "Shounen",
  "autor": "Autor",
  "editorial": "Editorial"
}
```

**Categorías válidas:**
- `Shounen` - Para público adolescente masculino
- `Shoujo` - Para público adolescente femenino
- `Seinen` - Para adultos hombres
- `Josei` - Para adultas mujeres
- `Horror`
- `Romance`
- `Aventura`
- `Comedia`
- `Otro`

---

#### Actualizar producto (solo admin)
```http
PUT /api/products/:id
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "precio": 18.99,
  ...
}
```

---

#### Eliminar producto (solo admin)
```http
DELETE /api/products/:id
Authorization: Bearer <token_admin>
```

---

#### Actualizar stock
```http
PATCH /api/products/:id/stock
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "cantidad": 75
}
```

---

###  ÓRDENES

#### Crear orden
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productoId": "...",
      "cantidad": 2
    },
    {
      "productoId": "...",
      "cantidad": 1
    }
  ],
  "direccion": {
    "calle": "Calle Principal 123",
    "ciudad": "Madrid",
    "codigoPostal": "28001",
    "pais": "España"
  },
  "notas": "Entregar después de las 5 PM"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "mensaje": "Orden creada exitosamente",
  "orden": {
    "_id": "...",
    "usuarioId": "...",
    "items": [...],
    "total": 47.97,
    "estado": "pendiente",
    "direccion": {...},
    "createdAt": "..."
  }
}
```

---

#### Obtener mis órdenes
```http
GET /api/orders/mis-ordenes?pagina=1&limite=10
Authorization: Bearer <token>
```

---

#### Obtener una orden específica
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

---

#### Cancelar orden
```http
PUT /api/orders/:id/cancelar
Authorization: Bearer <token>
```

---

#### Obtener todas las órdenes (solo admin)
```http
GET /api/orders?pagina=1&limite=10&estado=pendiente
Authorization: Bearer <token_admin>
```

**Query parameters:**
- `estado` - Filtrar por estado (pendiente, procesando, enviado, entregado, cancelado)

---

#### Actualizar estado de orden (solo admin)
```http
PUT /api/orders/:id/estado
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "estado": "enviado",
  "numeroSeguimiento": "TRACK123456"
}
```

**Estados válidos:**
- `pendiente` - Orden creada, esperando confirmación
- `procesando` - Preparando el envío
- `enviado` - Enviado al cliente
- `entregado` - Entregado al cliente
- `cancelado` - Cancelado

---

#### Obtener estadísticas (solo admin)
```http
GET /api/orders/stats/dashboard
Authorization: Bearer <token_admin>
```

---

##  Autenticación

### Usar el JWT Token

Todos los endpoints protegidos requieren el token en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Crear usuario admin

Para crear un usuario admin, debes modificar la BD directamente:

```javascript
// En MongoDB/Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

---

##  Estructura del Proyecto

```
Backend_1/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── productController.js # Lógica de productos
│   │   └── orderController.js   # Lógica de órdenes
│   ├── middleware/
│   │   ├── auth.js              # JWT y verificación de roles
│   │   └── errorHandler.js      # Manejo centralizado de errores
│   ├── models/
│   │   ├── User.js              # Esquema de usuario
│   │   ├── Product.js           # Esquema de producto
│   │   └── Order.js             # Esquema de orden
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   ├── products.js          # Rutas de productos
│   │   └── orders.js            # Rutas de órdenes
│   └── utils/
│       ├── validacion.js        # Validación de datos
│       └── seed.js              # Datos iniciales
├── server.js                    # Punto de entrada
├── package.json                 # Dependencias
├── .env                         # Variables de entorno
├── .env.example                 # Template
└── README.md                    # Esta documentación
```

---

##  Dependencias

```json
{
  "express": "^4.18.2",           // Framework web
  "mongoose": "^7.5.0",           // ODM para MongoDB
  "bcryptjs": "^2.4.3",           // Hasheo de contraseñas
  "jsonwebtoken": "^9.0.2",       // JWT tokens
  "dotenv": "^16.3.1",            // Variables de entorno
  "cors": "^2.8.5",               // CORS support
  "express-validator": "^7.0.0",  // Validación
  "joi": "^17.10.2",              // Validación alternativa
  "express-rate-limit": "^6.10.0",// Rate limiting
  "morgan": "^1.10.0"             // HTTP logging
}
```

---

##  Deploy (Railway o Render)

### Railway.app

1. Crea cuenta en [Railway.app](https://railway.app)
2. Conecta tu repositorio Git
3. Agrega las variables de entorno:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy automático

### Render.com

1. Crea cuenta en [Render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Agrega variables de entorno

---

##  Variables de Entorno (.env)

```env
# Base de datos
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/manga-store

# JWT
JWT_SECRET=secreto_muy_seguro_aqui

# Servidor
PORT=5000
NODE_ENV=development

# (Opcional)
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

---

##  Ejemplos de Uso

### Con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "nombre": "Usuario"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Obtener productos
curl http://localhost:5000/api/products?categoria=Shounen
```

### Con Fetch (JavaScript)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Usar token en peticiones futuras
const ordersResponse = await fetch('http://localhost:5000/api/orders/mis-ordenes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

##  Troubleshooting

### "MONGO_URI no está definida"
- Verificar que el archivo `.env` existe
- Verificar que `MONGO_URI` está definida correctamente
- Asegurarse de que MongoDB Atlas acepta conexiones desde tu IP

### "Token inválido"
- Verificar que el JWT_SECRET es el mismo en .env
- Verificar que el token no ha expirado (válido por 30 días)
- Enviar el token en el header con formato `Bearer <token>`

### "Puerto ya en uso"
```bash
# Cambiar puerto en .env
PORT=5001
```

---

## 📝 Notas de Seguridad

 Contraseñas hasheadas con bcrypt (10 salts)
 JWT tokens con expiración de 30 días
 Rate limiting en login (5 intentos en 15 min)
 CORS configurado solo para dominio permitido
 Validación de datos con Joi
 Variables sensibles en .env (nunca en código)
 Roles de usuario (admin vs usuario normal)

---

##  Soporte

Para problemas o preguntas:
1. Revisa la documentación arriba
2. Verifica los logs de la consola
3. Comprueba que MongoDB está en línea

