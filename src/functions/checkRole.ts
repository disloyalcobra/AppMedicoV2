import type { SessionUser } from './getSession';

// Roles mapping as per architecture (1-7)
export const ROLES = {
  ADMINISTRADOR: 1,
  JEFE_MEDICO: 2,
  DOCTOR: 3,
  NUTRIOLOGO: 4,
  ESTUDIANTE: 5,
  STAFF: 6,
  ENTRENADOR: 7,
};

export function checkRole(user: SessionUser | null | undefined, allowedRoles: number[]): boolean {
  if (!user) {
    console.log('[Auth] Error: No user in session');
    return false;
  }
  
  const roleId = Number(user.roleId);
  console.log(`[Auth] Checking Access - User Role: ${roleId} (${typeof roleId}), Allowed: ${JSON.stringify(allowedRoles)}`);

  // Admin (1) has access to everything globally by default
  if (roleId === ROLES.ADMINISTRADOR) return true;
  
  const hasAccess = allowedRoles.includes(roleId);
  if (!hasAccess) {
    console.log(`[Auth] ACCESS DENIED for role ${roleId}`);
  }
  
  return hasAccess;
}
