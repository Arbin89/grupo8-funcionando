# SIGER — Sistema de Gestión de Restaurante

SIGER es una aplicación web full-stack para la gestión integral de un restaurante. Permite administrar usuarios, reservaciones, inventario, menú, cocina y reportes desde un panel de administración con autenticación por roles. Incluye un módulo de **Asistente IA** integrado con OpenRouter.

## 📁 Estructura del Proyecto

```
grupo8-funcionando/
├── backend/                    # Servidor Node.js + Express
│   ├── routes/                 # Rutas API (usuarios, reservas, ia, etc.)
│   ├── sql/                    # Esquemas de base de datos
│   └── .env                    # Variables de entorno
│
├── src/                        # Frontend React + TypeScript (Vite)
│   ├── pages/                  # Vistas principales y panel admin
│   └── services/               # Conexión con el backend (API)
│
├── docker-compose.yml          # Base de datos PostgreSQL en Docker
└── package.json                # Dependencias del frontend
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
Crea un archivo llamado `.env` dentro de la carpeta `backend/` con lo siguiente:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=grupo8
JWT_SECRET=secreto_jwt
GROQ_API_KEY=tu_api_key_de_groq
```
> ⚠️ **Obligatorio para la IA:** Debes reemplazar `tu_api_key_de_groq` con una clave válida generada en la consola de Groq.

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

