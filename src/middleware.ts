import { defineMiddleware } from 'astro:middleware';
import { getSession } from './functions/getSession';
import { ROLES } from './functions/checkRole';

/**
 * MIDDLEWARE DE SEGURIDAD (RBAC)
 * Este archivo se ejecuta en cada petición al servidor y actúa como el primer
 * muro de seguridad para proteger las rutas privadas.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const path = url.pathname;

  // 1. RUTAS PÚBLICAS: Permitidas sin necesidad de sesión
  if (path === '/login' ||
      path === '/register' ||
      path === '/register-student' ||
      path.startsWith('/api/auth') ||
      path.startsWith('/_astro') ||
      path.startsWith('/public')) {
    return next();
  }

  // 2. VERIFICACIÓN DE SESIÓN: Obtenemos el usuario de la cookie firmada
  const user = getSession(cookies);
  if (!user) {
    // Si no hay sesión y la ruta es privada, redirigimos al login
    return redirect('/login');
  }

  // 3. INYECCIÓN DE CONTEXTO: Pasamos el usuario a Astro.locals para usarlo en las páginas
  context.locals.user = user;
  const roleId = Number(user.roleId);

  // 4. ACCESO TOTAL: El Administrador no tiene restricciones de ruta
  if (roleId === ROLES.ADMINISTRADOR) {
    return next();
  }

  // --- MATRIZ DE ACCESO BASADA EN ROLES (RBAC) ---

  // Gestión de Usuarios y Configuración
  if (path.startsWith('/users')) {
    // Solo el Jefe Médico tiene acceso administrativo a usuarios (además del Admin)
    if (roleId !== ROLES.JEFE_MEDICO) return redirect('/?error=403');
  }

  // Inventario de Medicamentos
  if (path.startsWith('/medications')) {
    // Staff (operativo), Doctor (consulta) y Jefe Médico (supervisión)
    if (![ROLES.STAFF, ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(roleId)) return redirect('/?error=403');
  }

  // Módulo de Pacientes (Expediente General)
  if (path.startsWith('/patients')) {
    // Nota: Aunque el Estudiante puede entrar aquí, su acceso se restringe a su propio ID en la página
    const allowed = [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE];
    if (!allowed.includes(roleId)) return redirect('/?error=403');
  }

  // Agenda de Citas
  if (path.startsWith('/appointments')) {
    // El Staff NO tiene acceso a la agenda según los últimos requerimientos aplicados
    const allowed = [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ESTUDIANTE];
    if (!allowed.includes(roleId)) return redirect('/?error=403');
  }

  // Consultas Médicas y Recetas
  if (path.startsWith('/consultations') || path.startsWith('/prescriptions')) {
    // Solo personal médico y el estudiante (para ver su propio historial)
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  // Módulo de Lesiones
  if (path.startsWith('/injuries')) {
    // Personal médico, entrenadores (vía Coach_Athlete) y estudiantes (propias)
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  // Módulo de Nutrición especializado
  if (path.startsWith('/nutrition')) {
    // Nutriólogos, personal médico de apoyo y entrenadores (solo lectura)
    if (![ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR].includes(roleId)) return redirect('/?error=403');
  }

  // Notas Colaborativas y Alertas
  if (path.startsWith('/notes')) {
    if (![ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.JEFE_MEDICO].includes(roleId)) {
      return redirect('/?error=403');
    }
  }

  // Si pasa todas las validaciones, permitimos que continúe a la página solicitada
  return next();
});
