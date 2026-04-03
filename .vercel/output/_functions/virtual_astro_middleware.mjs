import { a7 as defineMiddleware, ag as sequence } from './chunks/sequence_D80S23pC.mjs';
import 'piccolore';
import 'clsx';
import { R as ROLES } from './chunks/checkRole_Bhgz0jTJ.mjs';

function getSession(cookies) {
  const sessionCookie = cookies.get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const user = JSON.parse(decoded);
    if (user && user.roleId) {
      user.roleId = Number(user.roleId);
    }
    return user;
  } catch (error) {
    console.error("Error al parsear la cookie de sesión:", error);
    return null;
  }
}

const onRequest$1 = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const path = url.pathname;
  if (path === "/login" || path.startsWith("/api/auth") || path.startsWith("/_astro") || path.startsWith("/public")) {
    return next();
  }
  const user = getSession(cookies);
  if (!user) {
    return redirect("/login");
  }
  context.locals.user = user;
  const roleId = Number(user.roleId);
  if (roleId === ROLES.ADMINISTRADOR) {
    return next();
  }
  if (path.startsWith("/users")) {
    if (roleId !== ROLES.JEFE_MEDICO) return redirect("/?error=403");
  }
  if (path.startsWith("/medications")) {
    if (![ROLES.STAFF, ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/patients")) {
    const allowed = [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE];
    if (!allowed.includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/appointments")) {
    const allowed = [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ESTUDIANTE];
    if (!allowed.includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/consultations") || path.startsWith("/prescriptions")) {
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ESTUDIANTE].includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/injuries")) {
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR, ROLES.ESTUDIANTE].includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/nutrition")) {
    if (![ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR].includes(roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/notes")) {
    if (![ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.JEFE_MEDICO].includes(roleId)) {
      return redirect("/?error=403");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
