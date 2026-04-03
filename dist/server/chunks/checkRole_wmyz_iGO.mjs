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
  if (!user) return false;
  if (user.roleId === ROLES.ADMINISTRADOR) return true;
  return allowedRoles.includes(user.roleId);
}

export { ROLES as R, checkRole as c };
