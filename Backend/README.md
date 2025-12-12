# 🐾 PetAdopt - Sistema de Adopción de Mascotas

Sistema completo de gestión de adopciones de mascotas con panel administrativo y portal público.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Credenciales](#credenciales)

## ✨ Características

### Portal Público
- 🏠 **Listado de mascotas disponibles** - Vista de tarjetas con fotos
- 🔍 **Detalles de mascota** - Galería de fotos y descripción completa
- 📝 **Formulario de solicitud** - Proceso de adopción simplificado
- 📱 **Diseño responsivo** - Adaptado a móviles y tablets

### Panel Administrativo
- 🔐 **Autenticación JWT** - Login seguro con tokens
- 🐕 **Gestión de mascotas** - CRUD completo (crear, leer, actualizar, eliminar)
- 📋 **Gestión de solicitudes** - Aprobar/rechazar solicitudes de adopción
- 📊 **Panel de adopciones** - Seguimiento post-adopción
- 📝 **Sistema de seguimientos** - Notas y observaciones de cada adopción

## 🛠 Tecnologías

### Frontend
- **React 18** - Biblioteca UI
- **React Router DOM** - Navegación
- **Vite** - Build tool y dev server
- **CSS Variables** - Sistema de diseño

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Prisma** - ORM
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **CORS** - Manejo de cross-origin

## 📁 Estructura del Proyecto

```
examenFinal/
├── Backend/
│   ├── client/              # Frontend React
│   │   ├── src/
│   │   │   ├── pages/       # Componentes de páginas
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── PetDetail.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminPanel.jsx
│   │   │   ├── App.jsx      # Componente principal
│   │   │   ├── api.js       # Cliente API
│   │   │   ├── main.jsx     # Entry point
│   │   │   └── styles.css   # Estilos globales
│   │   └── package.json
│   │
│   └── server/              # Backend Node.js
│       ├── prisma/
│       │   └── schema.prisma
│       ├── index.js         # Servidor Express
│       ├── package.json
│       └── .env             # Variables de entorno
│
└── README.md
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd examenFinal
```

### 2. Instalar dependencias del backend

```bash
cd Backend/server
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../client
npm install
```

### 4. Configurar base de datos

```bash
cd ../server
npx prisma generate
npx prisma db push
```

## ⚙️ Configuración

### Archivo `.env` (Backend)

Crear archivo `Backend/server/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_secreto_super_seguro_aqui"
ADMIN_EMAIL="admin@org.com"
ADMIN_PASSWORD="admin123"
PORT=4000
```

## 🎮 Uso

### Desarrollo

**Terminal 1 - Backend:**
```bash
cd Backend/server
npm run dev
```
Servidor en: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd Backend/client
npm run dev
```
Aplicación en: `http://localhost:5173`

### Producción

**Backend:**
```bash
cd Backend/server
npm start
```

**Frontend:**
```bash
cd Backend/client
npm run build
```

## 🔌 API Endpoints

### Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pets?status=AVAILABLE` | Listar mascotas disponibles |
| GET | `/api/pets/:id` | Obtener detalle de mascota |
| POST | `/api/pets/:id/reserve` | Crear solicitud de adopción |

### Administrador (requiere JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/admin/login` | Login administrador |
| GET | `/api/admin/pets` | Listar todas las mascotas |
| POST | `/api/admin/pets` | Crear mascota |
| PATCH | `/api/admin/pets/:id` | Actualizar estado de mascota |
| DELETE | `/api/admin/pets/:id` | Eliminar mascota |
| GET | `/api/admin/requests` | Listar solicitudes |
| POST | `/api/admin/requests/:id/approve` | Aprobar solicitud |
| POST | `/api/admin/requests/:id/reject` | Rechazar solicitud |
| GET | `/api/admin/adoptions` | Listar adopciones |
| GET | `/api/admin/adoptions/:id/followups` | Listar seguimientos |
| POST | `/api/admin/adoptions/:id/followups` | Crear seguimiento |

## 🔑 Credenciales

### Panel Administrativo

**URL:** `http://localhost:5173/portal-admin-9xK72`

**Credenciales por defecto:**
- Email: `admin@org.com`
- Password: `admin123`

> ⚠️ **Importante:** Cambia estas credenciales en el archivo `.env` antes de desplegar a producción.

## 🎨 Sistema de Diseño

### Principios UX/UI aplicados:

1. **Jerarquía Visual** - Contraste y espaciado claro
2. **Ley de Proximidad (Gestalt)** - Elementos relacionados agrupados
3. **Ley de Fitts** - Botones accesibles y bien dimensionados
4. **Feedback Visual** - Transiciones y estados hover
5. **Consistencia** - Variables CSS para colores y espaciados
6. **Accesibilidad** - Contraste WCAG AA, focus states
7. **Mobile First** - Diseño responsivo desde móvil

### Paleta de Colores

```css
--primary-500: #3b82f6;      /* Azul principal */
--bg-base: #0f172a;          /* Fondo oscuro */
--text-primary: #f1f5f9;     /* Texto claro */
--success: #10b981;          /* Verde éxito */
--danger: #ef4444;           /* Rojo peligro */
```

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev     # Modo desarrollo con nodemon
npm start       # Modo producción
```

### Frontend
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build para producción
npm run preview # Preview del build
```

## 🗄️ Modelo de Base de Datos

### Pet (Mascota)
```prisma
- id: String (UUID)
- name: String
- description: String
- photos: String[] (URLs)
- status: Enum (AVAILABLE, RESERVED, ADOPTED)
- createdAt: DateTime
```

### AdoptionRequest (Solicitud)
```prisma
- id: String (UUID)
- petId: String
- email: String
- fullName: String
- phone: String
- homeType: String
- hasYard: Boolean
- notes: String?
- status: Enum (PENDING, APPROVED, REJECTED)
```

### Adoption (Adopción)
```prisma
- id: String (UUID)
- petId: String
- requestId: String
- adoptedAt: DateTime
```

### Followup (Seguimiento)
```prisma
- id: String (UUID)
- adoptionId: String
- notes: String
- createdAt: DateTime
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de uso educativo.

## 👤 Autor

**Franco**
- Proyecto: Examen Final
- Fecha: Diciembre 2025

## 🙏 Agradecimientos

- Diseño inspirado en sistemas modernos de adopción
- UI/UX basado en principios de Nielsen y Gestalt
- Paleta de colores adaptada de Tailwind CSS

---

⭐️ Si este proyecto te fue útil, considera darle una estrella!