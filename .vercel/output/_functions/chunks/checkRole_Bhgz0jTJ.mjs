const ROLES = {
  ADMINISTRADOR: 1,
  JEFE_MEDICO: 2,
  DOCTOR: 3,
  NUTRIOLOGO: 4,
  ESTUDIANTE: 5,
  STAFF: 6,
  ENTRENADOR: 7
};
function checkRole(user, allowedRoles) {
  if (!user) {
    console.log("[Auth] Error: No user in session");
    return false;
  }
  const roleId = Number(user.roleId);
  console.log(`[Auth] Checking Access - User Role: ${roleId} (${typeof roleId}), Allowed: ${JSON.stringify(allowedRoles)}`);
  if (roleId === ROLES.ADMINISTRADOR) return true;
  const hasAccess = allowedRoles.includes(roleId);
  if (!hasAccess) {
    console.log(`[Auth] ACCESS DENIED for role ${roleId}`);
  }
  return hasAccess;
}

export { ROLES as R, checkRole as c };
