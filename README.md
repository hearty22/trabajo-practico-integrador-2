# Blog API con Node.js y MongoDB

## Descripción:

API RESTful desarrollada con Node.js y Express que permite gestionar un sistema de blog completo con autenticación JWT, usuarios, artículos, comentarios y etiquetas. El sistema utiliza MongoDB como base de datos y implementa un diseño de base de datos normalizado con relaciones referenciadas para mantener la integridad y flexibilidad de los datos.

##  Diseño de la Base de Datos

### Relaciones Implementadas

#### 1. **Usuarios ↔ Artículos (Relación 1:N)**
**Tipo elegido:** Referenciada
**Implementación:** El modelo `User` contiene un array de referencias a artículos (`articles: [{ type: Schema.Types.ObjectId, ref: "articles" }]`), mientras que el modelo `Article` tiene una referencia simple al autor (`author: { type: Schema.Types.ObjectId, ref: "users" }`).

**Ventajas de esta decisión:**
- **Normalización de datos:** Evita la duplicación del usuario en cada artículo
- **Mantenimiento de consistencia:** Un cambio en los datos del usuario se refleja automáticamente en todos sus artículos
- **Eficiencia de consultas:** Uso de `populate()` para obtener datos completos cuando sea necesario
- **Flexibilidad:** Fácil expansión del perfil de usuario sin afectar los artículos

**Desventajas:**
- Requiere múltiples consultas para obtener datos completos (sin populate)
- Dependencia de la integridad referencial

#### 2. **Artículos ↔ Comentarios (Relación 1:N)**
**Tipo elegido:** Referenciada
**Implementación:** El modelo `Article` no contiene referencias directas a comentarios, mientras que el modelo `Comment` referencia al artículo (`article: { type: Schema.Types.ObjectId, ref: "articles" }`).

**Ventajas de esta decisión:**
- **Independencia de entidades:** Los comentarios pueden existir de forma autónoma
- **Flexibilidad de consultas:** Posibilidad de consultar comentarios por artículo o de forma global
- **Escalabilidad:** Los artículos no crecen indefinidamente con los comentarios
- **Mantenimiento:** Eliminación de comentarios no afecta directamente a los artículos

**Desventajas:**
- Consultas más complejas para obtener artículo con todos sus comentarios
- Necesidad de implementar lógica de eliminación en cascada manualmente

#### 3. **Artículos ↔ Etiquetas (Relación N:M)**
**Tipo elegido:** Referenciada con array
**Implementación:** El modelo `Article` contiene un array de strings que referencia a las etiquetas (`tags: [{ type: Schema.Types.String, ref: "tags" }]`), mientras que el modelo `Tag` tiene `_id` de tipo String y nombre único.

**Ventajas de esta decisión:**
- **Simplicidad de consultas:** Fácil obtener todas las etiquetas de un artículo
- **Rendimiento:** Una sola consulta puede obtener artículo con todas sus etiquetas
- **Flexibilidad:** Las etiquetas pueden ser reutilizadas en múltiples artículos
- **Escalabilidad:** El array crece de forma controlada

**Desventajas:**
- **Duplicación potencial:** Mismo problema que en relaciones embebidas
- **Límite de tamaño:** Arrays muy grandes pueden afectar el rendimiento

#### 4. **Usuarios ↔ Comentarios (Relación 1:N)**
**Tipo elegido:** Referenciada
**Implementación:** El modelo `Comment` referencia al usuario (`author: { type: Schema.Types.ObjectId, ref: "users" }`).

**Ventajas de esta decisión:**
- **Consistencia:** Un usuario puede tener múltiples comentarios
- **Flexibilidad:** Los comentarios mantienen su integridad independientemente del usuario
- **Seguridad:** Control de permisos basado en propiedad del comentario

### Comparativa: Referenciado vs Embebido

**Por qué se eligió mayoritariamente el modelo referenciado:**

1. **Normalización:** Evita duplicación de datos grandes (como contenido de artículos o perfiles de usuario)
2. **Mantenibilidad:** Cambios en entidades base no requieren actualizar múltiples documentos
3. **Flexibilidad:** Entidades pueden ser consultadas de forma independiente
4. **Rendimiento:** Consultas específicas no cargan datos innecesarios
5. **Escalabilidad:** Mejor manejo de crecimiento de datos

**Casos donde el embebido podría ser preferible:**
- Datos pequeños que siempre se consultan juntos
- Relaciones 1:1 donde la entidad hija depende completamente de la padre
- Consultas que requieren siempre todos los datos relacionados

## Endpoints

###  Autenticación

#### `POST /api/auth/register`
Registrar un nuevo usuario.
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "biography": "Desarrollador web",
    "birthDate": "1990-01-01"
  }
}
```

**Response:**
```json
{
  "ok": true,
  "msg": "user created successfully",
  "data": {
    "user": {
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "token": "jwt_token_here"
  }
}
```

#### `POST /api/auth/login`
Iniciar sesión.
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### `GET /api/auth/profile`
Obtener perfil del usuario autenticado.
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### `PUT /api/auth/profile`
Actualizar perfil del usuario.
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "profile": {
    "biography": "Desarrollador full-stack"
  }
}
```

#### `POST /api/auth/logout`
Cerrar sesión.
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

###  Usuarios (Solo Administradores)

#### `GET /api/users`
Listar todos los usuarios (requiere rol admin).
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### `GET /api/users/:id`
Obtener usuario por ID (requiere rol admin).
```http
GET /api/users/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin_token>
```

#### `PUT /api/users/:id`
Actualizar usuario (requiere rol admin).
```http
PUT /api/users/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### `DELETE /api/users/:id`
Eliminar usuario (requiere rol admin).
```http
DELETE /api/users/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin_token>
```

###  Artículos

#### `POST /api/articles`
Crear un nuevo artículo.
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introducción a Node.js",
  "content": "Node.js es un entorno de ejecución de JavaScript del lado del servidor...",
  "excerpt": "Una introducción completa a Node.js",
  "status": "published"
}
```

#### `GET /api/articles`
Listar artículos publicados.
```http
GET /api/articles
```

#### `GET /api/articles/:id`
Obtener artículo específico.
```http
GET /api/articles/60f7b3b3b3b3b3b3b3b3b3b3
```

#### `PUT /api/articles/:id`
Actualizar artículo (solo autor o admin).
```http
PUT /api/articles/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introducción a Node.js - Actualizado",
  "status": "archived"
}
```

#### `DELETE /api/articles/:id`
Eliminar artículo (solo autor o admin).
```http
DELETE /api/articles/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
```

#### `GET /api/articles/my`
Obtener artículos del usuario autenticado.
```http
GET /api/articles/my
Authorization: Bearer <token>
```

###  Comentarios

#### `POST /api/comments`
Crear comentario en un artículo.
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Excelente artículo sobre Node.js",
  "article": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

#### `GET /api/comments/article/:articleId`
Obtener comentarios de un artículo.
```http
GET /api/comments/article/60f7b3b3b3b3b3b3b3b3b3b3
```

#### `GET /api/comments/my`
Obtener comentarios del usuario autenticado.
```http
GET /api/comments/my
Authorization: Bearer <token>
```

#### `PUT /api/comments/:id`
Actualizar comentario (solo autor o admin).
```http
PUT /api/comments/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Comentario actualizado"
}
```

#### `DELETE /api/comments/:id`
Eliminar comentario (solo autor o admin).
```http
DELETE /api/comments/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
```

###  Etiquetas

#### `POST /api/articles/:articleId/tags/:tagId`
Crear y asociar etiqueta a artículo.
```http
POST /api/articles/60f7b3b3b3b3b3b3b3b3b3b3/tags/tecnologia
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "tecnología",
  "description": "Artículos relacionados con tecnología"
}
```

#### `DELETE /api/articles/:articleId/tags/:tagId`
Eliminar etiqueta de artículo.
```http
DELETE /api/articles/60f7b3b3b3b3b3b3b3b3b3b3/tags/tecnologia
Authorization: Bearer <token>
```

##  Instalación y Configuración

### 1. Clonación del Repositorio
```bash
git clone https://github.com/hearty22/trabajo-practico-integrador-2.git
cd trabajo-practico-integrador-2
```

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración del Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Puerto del servidor
PORT=3000

# Base de datos MongoDB
MONGODB_URL=mongodb://localhost:27017/blog

# JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura



### 4. Ejecución del Servidor
```bash
npm run dev

# O directamente con node
node app.js
```

### 5. Verificación de Funcionamiento
El servidor estará disponible en `http://localhost:3000`

## Validaciones Personalizadas Implementadas

### 1. **Autenticación y Autorización**
- **JWT Token requerido:** Todas las rutas protegidas verifican la presencia y validez del token JWT
- **Verificación de roles:** Middlewares específicos para rutas de administrador
- **Propiedad de recursos:** Solo autores o administradores pueden modificar/eliminar sus recursos

### 2. **Validaciones de Usuarios**
- **Email único:** Verificación de que no existe otro usuario con el mismo email
- **Username único:** Validación de unicidad del nombre de usuario
- **Contraseña segura:** Mínimo 8 caracteres (gestionado por bcrypt)
- **Email válido:** Formato de email correcto con regex
- **Campos requeridos:** Validación de presencia de campos obligatorios

### 3. **Validaciones de Artículos**
- **Título:** 3-200 caracteres, obligatorio, tipo string
- **Contenido:** Mínimo 50 caracteres, obligatorio, tipo string
- **Excerpt:** Máximo 500 caracteres, opcional, tipo string
- **Status:** Solo valores permitidos ('published', 'archived')
- **Existencia del artículo:** Validación de que el artículo existe antes de operaciones
- **Autoría:** Verificación de que el usuario es autor o admin para modificaciones

### 4. **Validaciones de Comentarios**
- **Contenido:** 5-500 caracteres, obligatorio, tipo string
- **Artículo publicado:** Solo se pueden comentar artículos con status 'published'
- **Existencia del artículo:** Verificación de que el artículo existe
- **Propiedad:** Solo autores o administradores pueden editar/eliminar comentarios

### 5. **Validaciones de Etiquetas**
- **Nombre:** 2-30 caracteres, obligatorio, único, tipo string, sin espacios en blanco
- **Descripción:** Máximo 200 caracteres, opcional, tipo string
- **Unicidad:** Verificación de que no existe otra etiqueta con el mismo nombre
- **Artículo publicado:** Solo se pueden etiquetar artículos publicados
- **Existencia de recursos:** Validación de existencia de artículo y etiqueta

### 6. **Validaciones de Parámetros**
- **ObjectId válido:** Verificación de formato correcto de IDs de MongoDB
- **Existencia de recursos:** Validación de que los recursos referenciados existen
- **Permisos de acceso:** Verificación de permisos antes de operaciones sensibles

## Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB, Mongoose ODM
- **Autenticación:** JWT (JSON Web Tokens)
- **Encriptación:** bcrypt
- **Validación:** Express Validator
- **Gestión de cookies:** Cookie Parser
- **CORS:** Cross-Origin Resource Sharing
- **Variables de entorno:** dotenv

## Estructura del Proyecto

```
src/
├── controllers/          # Lógica de negocio
│   ├── auth.controllers.js
│   ├── article.controllers.js
│   ├── comment.controllers.js
│   ├── tag.controllers.js
│   └── user.controllers.js
├── middlewares/         # Middlewares personalizados
│   ├── auth/
│   ├── admin/
│   ├── owner/
│   └── validators/
├── models/              # Modelos de Mongoose
│   ├── article.model.js
│   ├── comment.model.js
│   ├── tag.model.js
│   └── user.model.js
├── routes/              # Definición de rutas
│   ├── all.routes.js
│   ├── article.routes.js
│   ├── auth.routes.js
│   ├── comment.routes.js
│   ├── tag.routes.js
│   └── user.routes.js
└── helpers/             # Utilidades
```