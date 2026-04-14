# SIGER — Sistema de Gestión de Restaurante

SIGER es una aplicación web full-stack para la gestión integral de un restaurante. Permite administrar usuarios, reservaciones, inventario, menú, cocina y reportes desde un panel de administración con autenticación por roles. Incluye un módulo de **Asistente IA** integrado con OpenRouter.

## 📁 Estructura del Proyecto

```
grupo8-funcionando/
├── backend/                    # Servidor Node.js + Express
│   ├── config/                 # Configuración de base de datos y otros
│   ├── middlewares/            # Middlewares de la aplicación
│   ├── routes/                 # Rutas API (usuarios, reservas, ia, etc.)
│   ├── sql/                    # Esquemas de base de datos SQL
│   ├── .env                    # Variables de entorno (a crear por el usuario)
│   ├── .env.example            # Ejemplo y plantilla de variables de entorno
│   ├── index.js                # Punto de entrada del servidor
│   └── seed.js                 # Script para generar usuarios y datos de prueba
│
├── src/                        # Frontend React + TypeScript (Vite)
│   ├── components/             # Componentes de UI reutilizables
│   ├── hooks/                  # Custom hooks de React
│   ├── lib/                    # Librerías y utilidades
│   ├── pages/                  # Vistas principales y panel admin
│   ├── services/               # Conexión con el backend (API)
│   ├── test/                   # Pruebas automatizadas
│   ├── App.tsx                 # Componente principal de la aplicación
│   └── main.tsx                # Punto de entrada de React
│
├── docker-compose.yml          # Base de datos PostgreSQL en Docker
├── package.json                # Dependencias del frontend
├── tailwind.config.ts          # Configuración de Tailwind CSS
└── vite.config.ts              # Configuración de Vite
```

---

## 🚀 Pasos para Levantar el Proyecto

Para levantar el proyecto correctamente con la IA integrada, ejecuta los siguientes pasos en orden.

### 1. Requisitos
- **Node.js** v18+
- **Docker Desktop** (debe estar abierto y ejecutándose)

### 2. Instalar dependencias
Abre tu terminal en la raíz del proyecto y ejecuta:
```bash
npm install
cd backend
npm install
cd ..
```

### 3. Configurar variables de entorno (IA incluida)
Para que el proyecto funcione correctamente, es necesario configurar las claves de API de los servicios de IA y la base de datos.
Entra en la carpeta `backend/` y crea una copia del archivo `.env.example` llamándola `.env` (o crea el archivo `backend/.env` manualmente):

Contenido del archivo `.env` que debes crear:
```env
GROQ_API_KEY=pon_tu_api_key_aqui
OPENROUTER_API_KEY=pon_tu_api_key_aqui
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=grupo8
JWT_SECRET=pon_un_secret_aqui
```

> ⚠️ **Obligatorio para la autenticación y la IA:** Debes reemplazar lo siguiente con tus valores correctos:
> - **GROQ_API_KEY**: Genera tu API key en la consola de Groq (https://console.groq.com/keys).
> - **OPENROUTER_API_KEY**: Genera tu API key en OpenRouter (https://openrouter.ai/keys).
> - **JWT_SECRET**: Inventa una frase o cadena segura que se encargará de firmar los tokens de los usuarios de forma segura (ej. `mi_secreto_seguro_2024`).

### 4. Levantar base de datos y cargar esquema
En la raíz del proyecto, ejecuta:
```bash
docker-compose up -d
docker exec -i postgres psql -U postgres -d grupo8 < backend/sql/schema.sql
node backend/seed.js
```

### 5. Iniciar la aplicación
Ejecuta el siguiente comando para levantar tanto el frontend como el backend simultáneamente:
```bash
npm start
```

### 6. Acceder
Abre tu navegador en: **http://localhost:8080**

- El módulo de IA estará disponible en el panel de administrador.

### 👥 Usuarios de Prueba
Al ejecutar `node backend/seed.js` se crean automáticamente los siguientes usuarios para ingresar al sistema:

| Usuario | Contraseña  | Rol           |
|---------|-------------|---------------|
| admin   | admin123    | Administrador |
| mesero  | mesero123   | Mesero        |
| cocina  | cocina123   | Cocina        |

### 7. Apagar el Proyecto
Para detener todo de forma segura cuando termines de probar:

1. **Detén el servidor**: Ve a tu terminal donde ejecutaste `npm start` y presiona **`Ctrl + C`**. Cuando te pregunte si quieres terminar el trabajo por lotes, ingresa **`S`** y presiona Enter.
2. **Apaga la base de datos**: En la misma terminal ejecuta el siguiente comando:
```bash
docker-compose down
```

