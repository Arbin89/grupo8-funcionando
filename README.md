# SIGER — Sistema de Gestión de Restaurante

SIGER es una aplicación web full-stack para la gestión integral de un restaurante. Permite administrar usuarios, reservaciones, inventario, menú, cocina y reportes desde un panel de administración con autenticación por roles.

---

## 📁 Estructura del Proyecto

```
grupo8-funcionando/
├── backend/                    # Servidor Node.js + Express
│   ├── config/
│   │   └── db.js               # Conexión a PostgreSQL (pool)
│   ├── middlewares/
│   │   ├── authMiddleware.js   # Verificación de JWT
│   │   └── roleMiddleware.js   # Control de acceso por rol
│   ├── routes/
│   │   ├── authRoutes.js       # Login / autenticación
│   │   ├── userRoutes.js       # CRUD de usuarios
│   │   ├── reservationRoutes.js# CRUD de reservaciones
│   │   ├── inventoryRoutes.js  # CRUD de inventario y categorías
│   │   ├── menuRoutes.js       # CRUD de platos del menú
│   │   └── reportRoutes.js     # CRUD de reportes
│   ├── sql/
│   │   └── schema.sql          # Definición de tablas PostgreSQL
│   ├── seed.js                 # Script para poblar la base de datos
│   ├── index.js                # Punto de entrada del servidor
│   └── .env                    # Variables de entorno (ver paso 3)
│
├── src/                        # Frontend React + TypeScript (Vite)
│   ├── components/             # Componentes reutilizables (Navbar, Sidebar, UI)
│   ├── pages/
│   │   ├── Index.tsx           # Página de inicio pública
│   │   ├── LoginPage.tsx       # Inicio de sesión
│   │   ├── MenuPage.tsx        # Menú público del restaurante
│   │   ├── CocinaPage.tsx      # Vista de stock para cocina
│   │   ├── ReportesPage.tsx    # Formulario público de reportes
│   │   └── admin/              # Panel de administración (protegido)
│   │       ├── DashboardPage.tsx
│   │       ├── UsersPage.tsx
│   │       ├── ReservationsPage.tsx
│   │       ├── InventoryPage.tsx
│   │       ├── MenuAdminPage.tsx
│   │       └── ReportesAdminPage.tsx
│   └── services/               # Llamadas a la API del backend
│       ├── api.ts
│       ├── authService.ts
│       ├── userService.ts
│       ├── reservationService.ts
│       ├── inventoryService.ts
│       ├── menuService.ts
│       └── reportService.ts
│
├── docker-compose.yml          # Base de datos PostgreSQL en Docker
└── package.json                # Dependencias del frontend
```

---

## 🚀 Pasos para Levantar el Proyecto

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **en ejecución**

---

### 1. Instalar dependencias del frontend

Desde la raíz del proyecto:

```bash
npm install
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

### 3. Configurar variables de entorno del backend

Crear el archivo `backend/.env` con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=grupo8
JWT_SECRET=secreto_super_seguro_123
```

### 4. Levantar la base de datos con Docker

```bash
docker-compose up -d
```

### 5. Crear las tablas en la base de datos

```bash
docker exec -i postgres psql -U postgres -d grupo8 < backend/sql/schema.sql
```

### 6. Poblar la base de datos con datos de ejemplo *(opcional)*

```bash
node backend/seed.js
```

Esto crea usuarios de prueba, inventario, reservaciones, menú y reportes de ejemplo.

> **Usuarios de prueba creados:**
> | Usuario   | Contraseña   | Rol           |
> |-----------|--------------|---------------|
> | admin     | admin123     | Administrador |
> | mesero1   | mesero123    | Mesero        |
> | cocina1   | cocina123    | Cocina        |

### 7. Iniciar el proyecto completo *(un solo comando)*

Desde la raíz del proyecto:

```bash
npm start
```

Esto levanta automáticamente:
- 🐳 **Base de datos** (Docker)
- ⚙️ **Backend** en `http://localhost:3000`
- 🌐 **Frontend** en `http://localhost:8080`

> También puedes iniciarlos por separado si lo prefieres:
> ```bash
> npm run db        # Solo la base de datos
> npm run backend   # Solo el backend
> npm run dev       # Solo el frontend
> ```

---

## 🛠️ Tecnologías Utilizadas

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend    | Node.js, Express, JWT               |
| Base de datos | PostgreSQL (Docker)              |
| Estilos    | Tailwind CSS + CSS Variables        |
