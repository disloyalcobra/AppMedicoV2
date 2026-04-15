# Medinote (MedApp)

> Sistema integral de gestión médica para la Universidad Madero, diseñado para médicos, entrenadores, nutriólogos, fisioterapeutas y estudiantes.

![Astro](https://img.shields.io/badge/Astro-5.0.0-BC52EE?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.0-06B6D4?logo=tailwindcss)
![Turso](https://img.shields.io/badge/Turso-DB-4F46E5?logo=database)

## Overview

Medinote es una plataforma web médica completa que facilita la gestión de pacientes, citas médicas, historiales clínicos, nutrición, lesiones deportivas y control de inventario de medicamentos. El sistema implementa un modelo de control de acceso basado en roles (RBAC) que permite a diferentes tipos de usuarios acceder únicamente a las funcionalidades relevantes para su labor.

Desarrollado con Astro para el frontend y backend, utiliza Turso (SQLite en la nube) como base de datos, ofreciendo un rendimiento óptimo y despliegue serverless en Vercel.

## Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| Astro | Framework full-stack | 5.0.0 |
| TypeScript | Lenguaje de tipado estático | 5.9.3 |
| Tailwind CSS | Framework de estilos | 3.4.0 |
| Turso | Base de datos SQLite cloud | — |
| Drizzle ORM | ORM para base de datos | 0.45.1 |
| bcryptjs | Hash de contraseñas | 3.0.3 |
| Vercel | Hosting y despliegue | — |

## Prerequisites

- Node.js 18.0 o superior
- Cuenta en Turso (base de datos)
- Cuenta en Vercel (para despliegue)

## Installation

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/app-medico-v2.git
cd app-medico-v2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp docs/entrega/.env.example .env
# Edita .env con tus credenciales de Turso

# 4. Ejecutar migraciones de base de datos
npm run db:push

# 5. Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:4321`

## Environment Variables

| Variable | Description | Who Provides It | Required |
|----------|-------------|-----------------|----------|
| `TURSO_DATABASE_URL` | URL de conexión a Turso DB | Service (Turso) | Yes |
| `TURSO_AUTH_TOKEN` | Token de autenticación de Turso | Service (Turso) | Yes |
| `SESSION_SECRET` | Clave secreta para sesiones | Developer | Yes |

**Important:** Variables marcadas como "Service" provienen de la plataforma Turso. El token de autenticación nunca debe compartirse.

## Project Structure

```
app-medico-v2/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Dashboard/       # Vistas de dashboard por rol
│   │   ├── Patient/         # Componentes de pacientes
│   │   ├── ui/              # Componentes de UI (sidebar, etc.)
│   │   └── ...
│   ├── functions/           # Utilidades y helpers
│   │   ├── checkRole.ts     # Sistema RBAC
│   │   └── getSession.ts    # Gestión de sesiones
│   ├── layouts/             # Layouts de página
│   ├── pages/               # Rutas de la aplicación
│   │   ├── api/             # Endpoints de API
│   │   ├── patients/        # Gestión de pacientes
│   │   ├── appointments/    # Agenda de citas
│   │   ├── consultations/   # Consultas médicas
│   │   ├── nutrition/       # Módulo de nutrición
│   │   ├── injuries/        # Registro de lesiones
│   │   ├── medications/     # Inventario de medicamentos
│   │   └── ...
│   ├── turso.ts             # Configuración de base de datos
│   └── middleware.ts        # Middleware de autenticación
├── docs/
│   └── entrega/             # Documentación de entrega
├── package.json
└── README.md
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/pages/api/` | Endpoints de API REST para operaciones CRUD |
| `src/components/Dashboard/` | Componentes específicos por rol de usuario |
| `src/functions/` | Lógica de autorización y sesiones |
| `src/pages/patients/` | Gestión completa de pacientes |
| `src/pages/nutrition/` | Perfiles nutricionales y planes alimenticios |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en localhost:4321 |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa de build de producción |
| `npm run db:push` | Ejecuta migraciones de base de datos |
| `npm run db:studio` | Abre Drizzle Studio para gestión de DB |

## Deployment

El proyecto está configurado para desplegarse automáticamente en **Vercel** mediante Git integration.

- **Plataforma:** Vercel
- **Branch de producción:** main
- **URL de producción:** https://app-medico-v2.vercel.app

Variables de entorno deben configurarse en el dashboard de Vercel: Project Settings → Environment Variables.

## Roles del Sistema

| ID | Rol | Acceso Principal |
|----|-----|------------------|
| 1 | Administrador | Panel global, estadísticas, gestión de usuarios |
| 2 | Jefe Médico | Panel global, reportes, gestión de usuarios |
| 3 | Doctor | Pacientes, citas, consultas, lesiones |
| 4 | Nutriólogo | Planes nutricionales, perfiles de nutrición |
| 5 | Estudiante | Mi Expediente (vista personal) |
| 6 | Staff | Inventario de medicamentos |
| 7 | Entrenador | Pacientes, lesiones, nutrición |

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/logout` | Cierra sesión del usuario | Yes |
| POST | `/api/accept-plan` | Acepta plan nutricional | Yes |
| POST | `/api/toggle-user-status` | Activa/desactiva usuario | Yes |

**Nota:** La mayoría de las operaciones CRUD se manejan mediante formularios server-side con Astro Actions.

## Database Schema

Las tablas principales incluyen:
- **Users**: Usuarios del sistema con roles
- **Patients**: Información de pacientes
- **Appointments**: Agenda de citas médicas
- **Consultations**: Registro de consultas
- **Injuries**: Lesiones deportivas y su seguimiento
- **Medications**: Inventario de medicamentos
- **NutritionProfiles**: Perfiles nutricionales de pacientes
- **NutritionPlans**: Planes alimenticios personalizados
- **CollaborativeNotes**: Notas y alertas entre profesionales

## Known Considerations

- El sistema utiliza autenticación basada en sesiones con cookies (no JWT persistente)
- Las contraseñas se almacenan con bcrypt, pero el sistema soporta fallback a texto plano para datos de prueba
- Algunos dashboards redirigen automáticamente (Staff → Inventario, Estudiante → Mi Perfil)
- Turso requiere conexión a internet; no hay modo offline
- El límite gratuito de Turso tiene cuotas de lectura/escritura

## License & Ownership

Este proyecto fue desarrollado por **José Pablo Mateos Gamboa** (Estudiante UMAD) para el **Doctor de la Universidad Madero**.
El cliente posee todos los derechos sobre el código fuente y activos.

---

**Developed by** José Pablo Mateos Gamboa — josepablomateosgamboa@gmail.com
**Delivery date:** 4 de abril, 2026
