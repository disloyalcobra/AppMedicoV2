/* empty css                                  */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../../chunks/turso_YhtWwx2k.mjs';
import bcrypt from 'bcryptjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO])) {
    return Astro2.redirect("/403");
  }
  if (Astro2.request.method === "POST") {
    try {
      const data = await Astro2.request.formData();
      const firstName = data.get("firstName");
      const lastName = data.get("lastName");
      const email = data.get("email");
      const plainPassword = data.get("password");
      const roleId = Number(data.get("roleId"));
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(plainPassword, salt);
      await db.execute({
        sql: `INSERT INTO Users (firstName, lastName, email, password, roleId)
              VALUES (?, ?, ?, ?, ?)`,
        args: [firstName, lastName, email, passwordHash, roleId]
      });
      return Astro2.redirect("/users");
    } catch (error) {
      console.error(error);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nuevo Usuario" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/users" class="hover:text-teal-600 transition-colors">Directorio Personal</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Creación</span> </div> <div class="flex items-center justify-between"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registro de Empleado/Usuario</h1> </div> </div> <form method="POST" class="max-w-3xl space-y-6"> <div class="glass-card rounded-2xl p-6 mb-6 border-t-4 border-t-teal-500"> <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nombre(s)</label> <input type="text" name="firstName" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="Ej. Ana"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Apellidos</label> <input type="text" name="lastName" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="Ej. Silva Sánchez"> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Correo Electrónico (Para Login)</label> <input type="email" name="email" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="ejemplo@clinica.com"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Contraseña Inicial</label> <input type="password" name="password" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="*********"> </div> </div> <div class="mb-5"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Asignación de Rol de Seguridad</label> <select name="roleId" required class="w-full bg-teal-50/50 border border-teal-200/60 font-bold rounded-xl px-4 py-3 text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="3">Doctor / Médico Especialista (3)</option> <option value="4">Nutriólogo(a) (4)</option> <option value="7">Entrenador Deportivo (7)</option> <option value="6">Personal Médico (Staff/Farmacia) (6)</option> <option value="2">Jefe Médico (Solo Lectura Global) (2)</option> <option value="1">Administrador de Sistemas (1)</option> <option value="5" disabled>Estudiante/Deportista (Crear desde Pacientes) (5)</option> </select> </div> </div> <div class="flex justify-end gap-3 pt-4"> <a href="/users" class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>
Crear Cuenta de Usuario
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/users/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/users/add.astro";
const $$url = "/users/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
