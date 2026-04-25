import type { SessionUser } from "./getSession";

/**
 * Constantes de Roles del Sistema.
 * Estos IDs deben coincidir exactamente con los de la tabla 'Roles' en la base de datos.
 */
export const ROLES = {
  ADMINISTRADOR: 1,
  JEFE_MEDICO: 2,
  DOCTOR: 3,
  NUTRIOLOGO: 4,
  ESTUDIANTE: 5,
  STAFF: 6,
  ENTRENADOR: 7,
  FISIOTERAPEUTA: 8
};

/**
 * Función utilitaria para verificar si el usuario tiene un rol permitido.
 * Se utiliza tanto en el middleware como en los componentes de página.
 * 
 * @param user - Objeto de usuario obtenido de la sesión.
 * @param allowedRoles - Array de números con los IDs de roles permitidos.
 * @returns boolean - true si tiene acceso, false de lo contrario.
 */
export function checkRole(user: SessionUser | null | undefined, allowedRoles: number[]): boolean {
  // Si no hay usuario en sesión, el acceso es denegado
  if (!user) {
    console.log('[Auth] Error: No user in session');
    return false;
  }
  
  // Conversión explícita a número para evitar errores de tipo string vs number en la comparación
  const roleId = Number(user.roleId);
  
  // Log de depuración para auditar accesos en la terminal del servidor
  console.log(`[Auth] Checking Access - User Role: ${roleId} (${typeof roleId}), Allowed: ${JSON.stringify(allowedRoles)}`);

  // Admin (1) tiene acceso a todo globalmente por defecto
  if (roleId === ROLES.ADMINISTRADOR) return true;
  
  // Verificamos si el rol del usuario se encuentra en la lista de permitidos
  const hasAccess = allowedRoles.includes(roleId);
  if (!hasAccess) {
    console.log(`[Auth] ACCESS DENIED for role ${roleId}`);
  }
  
  return hasAccess;
}
