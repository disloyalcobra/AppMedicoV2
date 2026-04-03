/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const userRes = await db.execute({
    sql: `SELECT u.userId, u.firstName, u.lastName, u.email, u.roleId, r.roleName
        FROM Users u JOIN Roles r ON u.roleId = r.roleId WHERE u.userId = ?`,
    args: [String(id)]
  });
  if (userRes.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const u = userRes.rows[0];
  const rolesRes = await db.execute(`SELECT roleId, roleName FROM Roles ORDER BY roleId`);
  const roles = rolesRes.rows;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const roleId = data.get("roleId");
    await db.execute({
      sql: `UPDATE Users SET firstName = ?, lastName = ?, email = ?, roleId = ? WHERE userId = ?`,
      args: [firstName, lastName, email, roleId, String(id)]
    });
    return Astro2.redirect("/users");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Usuario: ${u.firstName} ${u.lastName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/users" class="hover:text-teal-600 transition-colors">Directorio del Personal</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Editar Usuario</span> </div> <div class="flex items-center gap-4"> <div class="w-14 h-14 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xl shadow-sm"> ${String(u.firstName)[0]}${String(u.lastName)[0]} </div> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">${u.firstName} ${u.lastName}</h1> <p class="text-slate-500 text-sm mt-1">ID #${u.userId} — ${u.roleName}</p> </div> </div> </div> <form method="POST" class="max-w-2xl"> <div class="glass-card rounded-2xl p-8 space-y-6"> <h2 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-3">Información del Perfil</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nombre(s)</label> <input type="text" name="firstName"${addAttribute(String(u.firstName), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Apellidos</label> <input type="text" name="lastName"${addAttribute(String(u.lastName), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label> <input type="email" name="email"${addAttribute(String(u.email), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Rol en el Sistema</label> <select name="roleId" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> ${roles.map((r) => renderTemplate`<option${addAttribute(String(r.roleId), "value")}${addAttribute(r.roleId === u.roleId, "selected")}>${r.roleName}</option>`)} </select> <p class="text-xs text-amber-600 mt-1 ml-1 font-medium">⚠️ Cambiar el rol modifica los permisos de acceso de este usuario.</p> </div> </div> ${String(id) === String(user?.userId) && renderTemplate`<div class="bg-amber-50 border border-amber-200 rounded-xl p-4"> <p class="text-sm text-amber-800 font-medium">Estás editando tu propio perfil. El cambio de rol puede afectar tu acceso inmediatamente.</p> </div>`} </div> <div class="flex justify-end gap-4 mt-6"> <a href="/users" class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Cambios
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/users/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/users/[id].astro";
const $$url = "/users/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
