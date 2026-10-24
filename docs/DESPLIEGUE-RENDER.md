# Despliegue en Render (plan Free) — Nómina Unidad 3 (React)

Guía paso a paso para publicar este monorepo en [Render](https://render.com) usando el **plan gratuito**:

- **Web Service** → API Node.js (`backend/`)
- **Static Site** → SPA React + Vite (`frontend/`)

Replica en la nube lo que haces en local con `npm run dev:backend` y `npm run dev:frontend`, con **dos URLs distintas**, **CORS** y la variable **`VITE_API_URL`** en el build del frontend.

---

## Tabla de contenidos

1. [Qué vas a obtener](#1-qué-vas-a-obtener)
2. [Requisitos previos](#2-requisitos-previos)
3. [Limitaciones del plan Free (léelas antes)](#3-limitaciones-del-plan-free-léelas-antes)
4. [Arquitectura en Render](#4-arquitectura-en-render)
5. [Preparar el código](#5-preparar-el-código)
6. [Subir el proyecto a GitHub](#6-subir-el-proyecto-a-github)
7. [Crear cuenta y conectar GitHub en Render](#7-crear-cuenta-y-conectar-github-en-render)
8. [Desplegar la API (Web Service)](#8-desplegar-la-api-web-service)
9. [Comprobar que la API funciona](#9-comprobar-que-la-api-funciona)
10. [Probar la API en JSON (login y token)](#10-probar-la-api-en-json-login-y-token)
11. [Datos de demostración (opcional)](#11-datos-de-demostración-opcional)
12. [Desplegar el frontend (Static Site)](#12-desplegar-el-frontend-static-site)
13. [Ajustar CORS con la URL final del frontend](#13-ajustar-cors-con-la-url-final-del-frontend)
14. [Prueba final de la aplicación](#14-prueba-final-de-la-aplicación)
15. [Variables de entorno (referencia)](#15-variables-de-entorno-referencia)
16. [Solución de problemas](#16-solución-de-problemas)
17. [Mantenimiento y redespliegues](#17-mantenimiento-y-redespliegues)

---

## 1. Qué vas a obtener

| Servicio en Render | Carpeta del repo | URL ejemplo |
|--------------------|------------------|-------------|
| Web Service (API) | `backend/` | `https://nomina-api-xxxx.onrender.com` |
| Static Site (SPA) | `frontend/` | `https://nomina-web-xxxx.onrender.com` |

El navegador carga la SPA desde el Static Site. Las peticiones van a la API en el Web Service (`https://nomina-api-xxxx.onrender.com/api/v1/...`). Casi todos los endpoints requieren **JWT** tras `POST /auth/login`.

---

## 2. Requisitos previos

- Cuenta en **GitHub** con el repositorio actualizado (rama `main` con `backend/` y `frontend/`).
- Cuenta en **Render** (registro con GitHub es lo más cómodo).
- En tu PC (para probar antes de subir):
  - **Node.js ≥ 22.18** (igual que `backend/package.json` → `engines.node`).
  - Haber ejecutado al menos una vez:

    ```bash
    npm run install:all
    npm run dev:backend
    npm run dev:frontend
    ```

    y confirmar que la app funciona en `http://localhost:5173` (login incluido).

**No subas a GitHub:**

- `node_modules/`
- `backend/data/nomina.db` y archivos `*.db-wal` / `*.db-shm`
- `.env` con secretos (sí puedes subir `backend/.env.example` y `frontend/.env.example`)

Eso ya está cubierto por el `.gitignore` del repositorio.

---

## 3. Limitaciones del plan Free (léelas antes)

| Tema | Comportamiento |
|------|----------------|
| **Inactividad** | El Web Service se **apaga** tras ~15 minutos sin tráfico. La primera visita después puede tardar **30–90 segundos** (cold start). |
| **SQLite** | La base `data/nomina.db` vive en el **disco del contenedor**. En el plan Free, al **redesplegar** o en algunos reinicios **puedes perder los datos**. Usa datos de prueba, `npm run seed` o vuelve a cargar desde la UI. |
| **Dos dominios** | Frontend y API no comparten origen; configura **CORS** en el backend y **`VITE_API_URL`** en el build del Static Site. |
| **HTTPS** | Render provee HTTPS; usa `https://` en CORS y en `VITE_API_URL`. |
| **Autenticación** | La API exige `Authorization: Bearer <token>` en rutas protegidas. El token lo devuelve el login; la SPA lo guarda en `sessionStorage`. |

Para un proyecto de curso y demo, estas limitaciones suelen ser aceptables.

---

## 4. Arquitectura en Render

```text
Usuario
   │
   ▼
┌─────────────────────────────────────┐
│  Static Site (Vite build → dist/)    │  https://nomina-web-xxxx.onrender.com
│  React 19 + React Router             │
└─────────────────────────────────────┘
   │  fetch → https://nomina-api-xxxx.onrender.com/api/v1/...
   │  (Bearer token tras login)
   ▼
┌─────────────────────────────────────┐
│  Web Service (Node + Express 5)      │  https://nomina-api-xxxx.onrender.com
│  SQLite: backend/data/nomina.db      │
└─────────────────────────────────────┘
```

En **desarrollo local**, Vite hace proxy de `/api` al puerto 3000 (`frontend/vite.config.ts`) y `apiUrl` es `/api/v1` (`frontend/src/config/environment.ts`). En **Render no hay proxy**: el build del Static Site debe recibir la URL absoluta de la API con **`VITE_API_URL`**.

---

## 5. Preparar el código

El frontend lee la URL de la API así:

```typescript
// frontend/src/config/environment.ts
apiUrl: import.meta.env.VITE_API_URL ?? '/api/v1',
```

- **Local:** no hace falta `VITE_API_URL` (proxy de Vite).
- **Render:** defines `VITE_API_URL` en el dashboard del Static Site (sección 12), **no** en un `.env` commiteado con secretos.

### 5.1 Verificar el build en local

```bash
cd frontend
npm install
npm run build
```

Salida esperada de Vite:

```text
frontend/dist/
  index.html
  assets/
```

Opcional: probar el build apuntando a tu API de Render antes de crear el Static Site:

```bash
# PowerShell
$env:VITE_API_URL="https://TU-API.onrender.com/api/v1"
npm run build
npm run preview
```

---

## 6. Subir el proyecto a GitHub

1. Crea el repositorio en GitHub (vacío o con README).
2. En la raíz del monorepo:

   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

Render leerá `backend/` y `frontend/` desde la rama conectada (normalmente `main`).

---

## 7. Crear cuenta y conectar GitHub en Render

1. Entra en [https://dashboard.render.com](https://dashboard.render.com).
2. Regístrate o inicia sesión (botón **Get Started** / **Sign In**).
3. Conecta tu cuenta de **GitHub** cuando Render lo pida.
4. Autoriza a Render para acceder al repositorio de este proyecto (puedes limitar solo a ese repo).

---

## 8. Desplegar la API (Web Service)

### 8.1 Crear el servicio

1. En el dashboard: **New +** → **Web Service**.
2. Selecciona tu repositorio.
3. Rama: **`main`**.

### 8.2 Configuración del formulario

| Campo | Valor |
|--------|--------|
| **Name** | `nomina-api` (define el subdominio `.onrender.com`) |
| **Region** | Cercano a Perú: **Oregon (US West)** |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 8.3 Variables de entorno (primera pasada)

En **Environment** → **Add Environment Variable**:

| Key | Value (ejemplo) | Notas |
|-----|-----------------|--------|
| `NODE_ENV` | `production` | Logs de acceso en la API |
| `NODE_VERSION` | `22.18.0` | Alineado con `engines` del backend |
| `CORS_ORIGINS` | `http://localhost:5173` | **Temporal**; actualiza en la sección 13 |
| `DATABASE_FILE` | `data/nomina.db` | Ruta relativa dentro de `backend/` |
| `AUTH_SECRET` | *(string aleatorio ≥ 16 caracteres)* | **Obligatorio en producción**; no uses el valor de desarrollo |
| `AUTH_TOKEN_TTL_HOURS` | `12` | Opcional |
| `RATE_LIMIT_MAX` | `300` | Opcional |

**No definas `PORT`:** Render la inyecta; la API la lee en `backend/src/shared/config/env.ts`.

Al arrancar, si no existe el usuario admin inicial, se crea uno (ver `backend/src/modules/auth/infrastructure/seed-usuarios.ts`). Usa credenciales propias en producción o crea usuarios desde la UI con rol adecuado.

### 8.4 Health check (recomendado)

**Health Check Path:**

```text
/api/v1/health
```

### 8.5 Crear el servicio

**Create Web Service**. Render compila TypeScript (`dist/`) y arranca `node dist/main.js`. Espera estado **Live**.

### 8.6 Copiar la URL de la API

Ejemplo:

```text
https://nomina-api-xxxx.onrender.com
```

La necesitas para `VITE_API_URL` y para CORS.

---

## 9. Comprobar que la API funciona

Abre en el navegador (no requiere token):

```text
https://TU-SERVICIO-API.onrender.com/api/v1/health
```

Respuesta esperada:

```json
{
  "data": {
    "estado": "ok",
    "hora": "2026-..."
  }
}
```

Si falla: revisa **Logs**, **Root Directory** = `backend`, **Start Command** = `npm start`.

---

## 10. Probar la API en JSON (login y token)

La API **no** muestra empleados en la raíz del dominio. Para ver JSON:

1. **Login** (público):

   ```http
   POST https://TU-SERVICIO-API.onrender.com/api/v1/auth/login
   Content-Type: application/json

   {"usuario":"tu_usuario","password":"tu_clave"}
   ```

   Respuesta: `data.token`, `data.id`, `data.usuario`, `data.rol`.

2. **Listar empleados** (protegido):

   ```http
   GET https://TU-SERVICIO-API.onrender.com/api/v1/empleados
   Authorization: Bearer <data.token>
   ```

**PowerShell:**

```powershell
$base = "https://TU-SERVICIO-API.onrender.com/api/v1"
$login = Invoke-RestMethod -Method Post -Uri "$base/auth/login" `
  -ContentType "application/json" -Body '{"usuario":"TU_USUARIO","password":"TU_CLAVE"}'
Invoke-RestMethod -Uri "$base/empleados" -Headers @{ Authorization = "Bearer $($login.data.token)" }
```

Desde el **frontend desplegado**, tras iniciar sesión, el token está en `sessionStorage` (`nomina_auth_token`); la app añade el header `Authorization` automáticamente (`frontend/src/shared/infrastructure/http/apiClient.ts`).

CORS no aplica a curl/Postman/PowerShell; solo al navegador.

---

## 11. Datos de demostración (opcional)

`backend/scripts/seed.ts` crea empleados de ejemplo.

En el Web Service → **Shell** (si está disponible):

```bash
npm run seed
```

También puedes dar de alta datos desde la UI una vez desplegado el frontend.

Tras un redeploy, la base SQLite puede quedar vacía otra vez.

---

## 12. Desplegar el frontend (Static Site)

### 12.1 Variable de entorno del build

Necesitas la URL de la API del paso 8.6. En el Static Site, **antes o al crear**:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://nomina-api-xxxx.onrender.com/api/v1` |

Sin barra final después de `v1`. Debe incluir el prefijo `/api/v1`.

### 12.2 Crear el Static Site

1. **New +** → **Static Site**.
2. Mismo repositorio y rama **`main`**.

| Campo | Valor |
|--------|--------|
| **Name** | `nomina-web` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 12.3 Rewrite para React Router (SPA)

Sin esto, al refrescar `/empleados` verás **404**.

**Redirects/Rewrites** → **Add Rule**:

| Tipo | Source | Destination |
|------|--------|-------------|
| **Rewrite** | `/*` | `/index.html` |

Status **200** (rewrite, no redirect).

### 12.4 Desplegar

**Create Static Site**. URL pública ejemplo:

```text
https://nomina-web-xxxx.onrender.com
```

---

## 13. Ajustar CORS con la URL final del frontend

La API solo acepta orígenes en `CORS_ORIGINS` (`backend/src/app.ts`, `env.ts`).

1. Web Service **nomina-api** → **Environment**.
2. Edita `CORS_ORIGINS` (sin barra final):

```text
https://nomina-web-xxxx.onrender.com
```

3. Para seguir probando en local:

```text
http://localhost:5173,https://nomina-web-xxxx.onrender.com
```

4. Guarda → Render redespliega la API.

---

## 14. Prueba final de la aplicación

1. Abre `https://nomina-web-xxxx.onrender.com`.
2. Si la API estaba dormida, espera y recarga.
3. **Inicia sesión** (sin login no hay token ni datos).
4. DevTools → **Network**: peticiones a `https://nomina-api-xxxx.onrender.com/api/v1/...` con status **200** / **201**.
5. Flujos clave: empleados, procesar pago, boletas, dashboard, configuración.

| Síntoma | Causa probable |
|---------|----------------|
| Error CORS | `CORS_ORIGINS` no coincide exactamente con la URL del Static Site |
| Peticiones a `tu-web.onrender.com/api/...` | Falta o está mal `VITE_API_URL`; redeploy del Static Site |
| **401** en la API | Sin login o token expirado (`AUTH_TOKEN_TTL_HOURS`) |
| API lenta tras inactividad | Cold start del plan Free |
| Lista vacía tras redeploy | SQLite efímero; seed o altas manuales |

---

## 15. Variables de entorno (referencia)

### Backend (`backend/.env.example` → Zod en `env.ts`)

| Variable | Obligatoria en Render | Descripción |
|----------|------------------------|-------------|
| `NODE_ENV` | Recomendada | `production` |
| `PORT` | No (Render la define) | Puerto de escucha |
| `CORS_ORIGINS` | **Sí** | Orígenes del frontend, separados por coma |
| `DATABASE_FILE` | Recomendada | Ruta del archivo SQLite |
| `AUTH_SECRET` | **Sí** | Firma de tokens JWT |
| `AUTH_TOKEN_TTL_HOURS` | Opcional | Caducidad del token (default 12) |
| `RATE_LIMIT_MAX` | Opcional | Límite por IP / 15 min |
| `NODE_VERSION` | Recomendada | `22.18.0` o compatible |

### Frontend (Static Site en Render)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | **Sí** | URL base de la API, ej. `https://nomina-api-xxxx.onrender.com/api/v1` |

Se compila en el bundle en el momento del build; si cambias la URL de la API, **redespliega el Static Site**.

---

## 16. Solución de problemas

### Build del backend falla

- Local: `cd backend && npm run build`.
- Node: `NODE_VERSION=22.18.0`.
- Si falta `@types/node` en el build: el backend lleva TypeScript en `dependencies`; prueba **Build Command** `npm install --include=dev && npm run build`.

### Build del frontend falla

- Local: `cd frontend && npm run build`.
- Revisa que `tsc --noEmit` y Vite terminen sin errores.

### `Publish directory does not exist`

- **Publish Directory** debe ser `dist` (no rutas de Angular).
- Tras `npm run build` en local, confirma `frontend/dist/index.html`.

### La API responde pero el front no carga datos

1. `/api/v1/health` en el navegador.
2. CORS en consola.
3. `VITE_API_URL` correcta y **nuevo deploy** del Static Site tras cambiarla.
4. Sesión iniciada (token en `sessionStorage`).

### Desplegar solo backend o solo frontend

Cada push a `main` redeploya el servicio conectado, o **Manual Deploy** → **Deploy latest commit**.

### Colección Postman

`docs/nomina-api.postman_collection.json`: cambia `baseUrl` a `https://TU-API.onrender.com/api/v1`. Añade primero `POST /auth/login` y usa `Bearer {{token}}` en el resto (la colección puede no incluir auth; el flujo de la sección 10 es la referencia).

---

## 17. Mantenimiento y redespliegues

| Acción | Qué hacer |
|--------|-----------|
| Cambio solo en API | Push → redeploy Web Service |
| Cambio solo en React | Push → redeploy Static Site |
| Cambiar URL de API | Actualizar `VITE_API_URL` + redeploy frontend |
| Cambiar dominio del front | Actualizar `CORS_ORIGINS` + redeploy API |
| Rotar `AUTH_SECRET` | Todos los tokens vigentes invalidan; usuarios deben volver a iniciar sesión |

---

## Resumen rápido (checklist)

- [ ] Código en GitHub (`main`), sin `.env` ni `*.db`
- [ ] Web Service `backend/` con `AUTH_SECRET` y `CORS_ORIGINS`
- [ ] `/api/v1/health` responde OK
- [ ] Static Site `frontend/`, publish `dist`, `VITE_API_URL` con `/api/v1`
- [ ] Rewrite SPA `/*` → `/index.html`
- [ ] `CORS_ORIGINS` incluye la URL del Static Site (`https://...`)
- [ ] Login en la web y flujo completo probado

---

**Autor del proyecto:** Jesús Pantoja — curso JavaScript Avanzado (UTP).

Render también soporta **Blueprints** (`render.yaml` en la raíz); esta guía usa el dashboard visual, más claro la primera vez.
