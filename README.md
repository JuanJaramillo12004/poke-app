# Poke App - Prueba Tecnica

Monorepo con una aplicacion full-stack para gestionar Pokemon favoritos:
- Backend: NestJS + Prisma + SQLite + JWT
- Frontend: React + TypeScript + Vite
- Integracion externa: PokeAPI (`https://pokeapi.co/api/v2/pokemon`)

## 1. Descripcion General

Este proyecto implementa:
- Autenticacion de usuarios (registro/login) con JWT
- CRUD de Pokemon favoritos
- Integracion de catalogo de Pokemon desde PokeAPI
- Cache persistente de datos Pokemon para reducir llamadas externas
- Busqueda/filtros y paginacion (maximo 20 por pagina)

## 2. Estructura del Repositorio

```text
poke-app/
  backend/      # API NestJS
  frontend/     # Cliente React
  Prueba tecnica.md
```

## 3. Stack Tecnologico

### Backend
- NestJS
- Prisma ORM
- SQLite
- JWT (Passport)
- class-validator / class-transformer

### Frontend
- React + TypeScript
- React Router
- React Hook Form
- Axios
- Sonner (notificaciones/mensajes emergentes)

## 4. Prerrequisitos

- Node.js 20+ (recomendado)
- npm 10+

## 5. Variables de Entorno

Crea `backend/.env` con:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="reemplaza_por_un_secreto_seguro"
JWT_EXPIRES_IN_SECONDS=3600
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Crea `frontend/.env` con:

```env
VITE_API_URL="http://localhost:3000"
```

## 6. Instalacion

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Frontend

```bash
cd frontend
npm install
```

## 7. Ejecucion del Proyecto

Abre dos terminales.

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Base URL de la API: `http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

URL de la aplicacion: `http://localhost:5173`

## 8. Scripts Disponibles

### Backend (`backend/package.json`)

```bash
npm run start
npm run start:dev
npm run start:prod
npm run build
npm run lint
```

### Frontend (`frontend/package.json`)

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 9. Endpoints de la API

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Favoritos
- `GET /pokemon` (lista paginada de favoritos)
- `GET /pokemon/:id` (detalle de favorito)
- `POST /pokemon` (agregar favorito)
- `PUT /pokemon/:id` (actualizar comentarios)
- `DELETE /pokemon/:id` (eliminar favorito)

### Catalogo
- `GET /pokemon/catalog` (catalogo paginado desde cache/PokeAPI)

> Nota: las rutas de Pokemon estan protegidas con JWT.

## 10. Colecciones de Postman
