import { d as defineMiddleware, s as sequence } from './chunks/index_B1e-lphl.mjs';
import { R as ROLES } from './chunks/checkRole_wmyz_iGO.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_Bd3Qguag.mjs';
import 'piccolore';
import './chunks/astro/server_DBbqSsVa.mjs';
import 'clsx';

function getSession(cookies) {
  const sessionCookie = cookies.get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse session cookie", error);
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
  if (user.roleId === ROLES.ADMINISTRADOR) {
    return next();
  }
  if (path.startsWith("/users")) {
    if (user.roleId !== ROLES.JEFE_MEDICO) return redirect("/?error=403");
  }
  if (path.startsWith("/medications")) {
    if (![ROLES.STAFF, ROLES.DOCTOR].includes(user.roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/patients")) {
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR].includes(user.roleId)) {
      return redirect("/?error=403");
    }
  }
  if (path.startsWith("/appointments")) {
    if (![ROLES.DOCTOR, ROLES.STAFF, ROLES.JEFE_MEDICO].includes(user.roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/consultations")) {
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(user.roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/prescriptions")) {
    if (user.roleId !== ROLES.DOCTOR) return redirect("/?error=403");
  }
  if (path.startsWith("/injuries")) {
    if (![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ENTRENADOR].includes(user.roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/nutrition")) {
    if (![ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(user.roleId)) return redirect("/?error=403");
  }
  if (path.startsWith("/notes")) {
    if (![ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.JEFE_MEDICO].includes(user.roleId)) {
      return redirect("/?error=403");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
