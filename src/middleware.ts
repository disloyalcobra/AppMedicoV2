import { defineMiddleware } from 'astro:middleware';
import { getSession } from './functions/getSession';
import { ROLES } from './functions/checkRole';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const path = url.pathname;

  // Rutas públicas permitidas sin sesión
  if (path === '/login' || path.startsWith('/api/auth') || path.startsWith('/_astro') || path.startsWith('/public')) {
    return next();
  }

  // Verificar sesión
  const user = getSession(cookies);
  if (!user) {
    return redirect('/login');
  }

  // Inyectar usuario
  context.locals.user = user;
  const roleId = Number(user.roleId);

  // Acceso Total para el Administrador
  if (roleId === ROLES.ADMINISTRADOR) {
    return next();
  }

  // --- MATRIZ DE ACCESO BASADA EN ROLES ---

  // 1. Usuarios e Inventario
  if (path.startsWith('/users')) {
    // Solo Jefe Médico (además del Admin ya validado)
    if (roleId !== ROLES.JEFE_MEDICO) return redirect('/?error=403');
  }

  if (path.startsWith('/medications')) {
    // Staff, Doctor, JefeMedico
    if (![ROLES.STAFF, ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(roleId)) return redirect('/?error=403');
  }

  // 2. Clínico (Pacientes, Citas, Consultas, Recetas, Lesiones)
  if (path.startsWith('/patients')) {
    // Doctor, JefeMedico, Nutriólogo, Entrenador, Estudiante (estudiante se valida en la página)
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE].includes(roleId)) {
      return redirect('/?error=403');
    }
  }

  if (path.startsWith('/appointments')) {
    // Doctor, JefeMedico, Nutriólogo, Estudiante
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  if (path.startsWith('/consultations')) {
    // Doctor, JefeMedico, Estudiante (estudiante se valida en la página)
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  if (path.startsWith('/prescriptions')) {
    // Doctor, JefeMedico, Estudiante
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  if (path.startsWith('/injuries')) {
    // Doctor, JefeMedico, Entrenador, Estudiante
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE].includes(roleId)) return redirect('/?error=403');
  }

  // 3. Nutrición
  if (path.startsWith('/nutrition')) {
    // Nutriólogo, Doctor, JefeMedico, Entrenador
    if (![ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR].includes(roleId)) return redirect('/?error=403');
  }

  // 4. Alertas y Notas
  if (path.startsWith('/notes')) {
    if (![ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.JEFE_MEDICO].includes(roleId)) {
      return redirect('/?error=403');
    }
  }

  return next();

  return next();
});
