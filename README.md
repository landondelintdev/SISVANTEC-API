# 🚀 SISVANTEC API

API REST para la gestión de formularios dinámicos y trámites gubernamentales.

**Proyecto de Residencia Profesional**  
**Autor:** Landon Donovan Delint Alvidrez  
**Institución:** Tecnológico de Estudios Superiores de Coacalco (TESCo)  
**Empresa:** SISVANTEC

---

## 📋 Descripción

Sistema de gestión de formularios y trámites que permite a diferentes municipios del Estado de México crear, administrar y dar seguimiento a solicitudes ciudadanas.

### Características principales:

- ✅ Creación dinámica de formularios por municipio
- ✅ Gestión de respuestas (trámites) de usuarios finales
- ✅ Sistema de roles: Super Admin, Admin Municipal, Usuario Final
- ✅ Filtros por municipio, estado y usuario
- ✅ Estadísticas en tiempo real
- ✅ API RESTful documentada

---

## 🛠️ Tecnologías utilizadas

- **Backend:** Node.js v20.x
- **Framework:** Express.js
- **Base de datos:** Firebase Firestore (NoSQL)
- **Autenticación:** Firebase Authentication (próximamente)
- **Validaciones:** express-validator
- **Seguridad:** Helmet, CORS
- **Sintaxis:** ESModule (import/export)

---

## 📁 Estructura del proyecto

```
sisvantec-api/
├── src/
│   ├── config/
│   │   └── firebase.js           # Configuración de Firebase
│   ├── controllers/
│   │   ├── formularioController.js
│   │   └── tramiteController.js
│   ├── services/
│   │   ├── formularioService.js
│   │   └── tramiteService.js
│   ├── routes/
│   │   ├── formularioRoutes.js
│   │   └── tramiteRoutes.js
│   ├── middlewares/
│   │   └── validarResultados.js
│   ├── validators/
│   │   ├── formularioValidator.js
│   │   └── tramiteValidator.js
│   ├── utils/
│   │   └── testFirestore.js
│   └── server.js                 # Punto de entrada
├── docs/
│   └── SISVANTEC-API.postman_collection.json
├── .env                          # Variables de entorno
├── .gitignore
├── package.json
├── firebase-service-account.json # Credenciales
└── README.md
```

---

## 🚀 Instalación y configuración

### Prerrequisitos:

- Node.js v18 o superior
- npm v9 o superior
- Cuenta de Firebase
- Proyecto de Firebase con Firestore habilitado

### Pasos de instalación:

1. **Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/sisvantec-api.git
cd sisvantec-api
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env` en la raíz:

```env
PORT=3000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
JWT_SECRET=tu_clave_secreta_cambiar_en_produccion
JWT_EXPIRES_IN=24h
ALLOWED_ORIGINS=http://localhost:3000
```

4. **Configurar Firebase:**

- Descargar las credenciales desde Firebase Console
- Guardar como `firebase-service-account.json` en la raíz
- Habilitar Firestore en Firebase Console

5. **Crear índices de Firestore:**

Los índices se crean automáticamente cuando el sistema los necesita. Firebase te proporcionará enlaces directos para crearlos.

6. **Iniciar el servidor:**

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📡 Endpoints de la API

### Formularios

| Método | Endpoint                          | Descripción                   |
| ------ | --------------------------------- | ----------------------------- |
| POST   | `/api/formularios`                | Crear nuevo formulario        |
| GET    | `/api/formularios`                | Obtener todos los formularios |
| GET    | `/api/formularios/:id`            | Obtener formulario por ID     |
| PUT    | `/api/formularios/:id`            | Actualizar formulario         |
| DELETE | `/api/formularios/:id`            | Eliminar formulario (lógico)  |
| DELETE | `/api/formularios/:id/permanente` | Eliminar permanentemente      |

#### Filtros disponibles (Query Params):

- `?municipio=Coacalco` - Filtrar por municipio
- `?activo=true` - Solo formularios activos
- `?creadoPor=admin_001` - Por creador

### Trámites

| Método | Endpoint                     | Descripción                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/tramites`              | Crear nuevo trámite        |
| GET    | `/api/tramites`              | Obtener todos los trámites |
| GET    | `/api/tramites/:id`          | Obtener trámite por ID     |
| PUT    | `/api/tramites/:id`          | Actualizar trámite         |
| DELETE | `/api/tramites/:id`          | Eliminar trámite           |
| GET    | `/api/tramites/estadisticas` | Obtener estadísticas       |

#### Filtros disponibles (Query Params):

- `?municipio=Coacalco` - Filtrar por municipio
- `?estado=pendiente` - Por estado del trámite
- `?usuarioId=user_123` - Por usuario
- `?formularioId=abc123` - Por formulario

---

## 📝 Ejemplos de uso

### Crear un formulario:

```bash
POST http://localhost:3000/api/formularios
Content-Type: application/json

{
  "titulo": "Solicitud de Licencia de Construcción",
  "descripcion": "Formulario para tramitar licencias",
  "municipio": "Coacalco",
  "creadoPor": "admin_coacalco",
  "activo": true,
  "campos": [
    {
      "nombre": "nombreCompleto",
      "tipo": "text",
      "etiqueta": "Nombre completo",
      "requerido": true
    }
  ]
}
```

### Responder un formulario (crear trámite):

```bash
POST http://localhost:3000/api/tramites
Content-Type: application/json

{
  "formularioId": "KP78ZgUZO3DtCZMRIM0z",
  "usuarioId": "user_123",
  "usuarioNombre": "Juan Pérez",
  "respuestas": {
    "nombreCompleto": "Juan Pérez López"
  }
}
```

---

## 🔐 Sistema de roles (Próximamente)

El sistema implementará tres niveles de acceso:

| Rol                 | Nivel | Permisos                            |
| ------------------- | ----- | ----------------------------------- |
| **Super Admin**     | 3     | Acceso total a todos los municipios |
| **Admin Municipal** | 2     | Gestión de su municipio únicamente  |
| **Usuario Final**   | 1     | Solo responder formularios          |

---

## 🧪 Testing

### Probar conexión con Firestore:

```bash
npm run test:firestore
```

### Health check:

```bash
curl http://localhost:3000/health
```

---

## 📦 Dependencias principales

```json
{
  "express": "^4.18.2",
  "firebase-admin": "^12.0.0",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

---

## 🔒 Seguridad

- ✅ Headers de seguridad con Helmet
- ✅ CORS configurado
- ✅ Validación de datos con express-validator
- ✅ Variables de entorno para credenciales
- ✅ .gitignore configurado para archivos sensibles
- 🔄 Autenticación JWT (en desarrollo)

---

## 📈 Próximas características

- [ ] Sistema de autenticación completo
- [ ] Roles y permisos
- [ ] Notificaciones por email
- [ ] Dashboard de administración
- [ ] Reportes en PDF
- [ ] Deploy en AWS

---

## 🤝 Contribución

Este es un proyecto de residencia profesional. Para sugerencias o mejoras, contactar al autor.

---

## 📄 Licencia

Este proyecto es parte de una residencia profesional académica.

---

## 👨‍💻 Autor

**Landon Donovan Delint Alvidrez**  
Ingeniería en Sistemas Computacionales  
Tecnológico de Estudios Superiores de Coacalco (TESCo)  
Residencia Profesional en SISVANTEC

---

## 📞 Contacto

Para más información sobre este proyecto, contactar a SISVANTEC.

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025

```

---

## 📍 Paso 3: Crear archivo .gitignore (si no existe o actualizarlo)

Asegúrate de que tu `.gitignore` esté completo:
```

# Dependencias

node_modules/

# Variables de entorno

.env
.env.local
.env.production

# Credenciales de Firebase

firebase-service-account.json
_-firebase-adminsdk-_.json

# Logs

logs/
_.log
npm-debug.log_

# Sistema operativo

.DS_Store
Thumbs.db

# IDEs

.vscode/
.idea/
_.swp
_.swo

# Build

dist/
build/

# Temporal

.temp/
tmp/
