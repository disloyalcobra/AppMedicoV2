/* empty css                               */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$AuthLayout } from '../chunks/AuthLayout_CqIIRwXH.mjs';
import { d as db } from '../chunks/turso_YhtWwx2k.mjs';
import bcrypt from 'bcryptjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  let error = "";
  if (Astro2.request.method === "POST") {
    try {
      const data = await Astro2.request.formData();
      const email = data.get("email")?.toString();
      const password = data.get("password")?.toString();
      if (email && password) {
        const userRes = await db.execute({
          sql: `SELECT userId, roleId, firstName, lastName, password FROM Users WHERE email = ? LIMIT 1`,
          args: [email]
        });
        if (userRes.rows.length === 0) {
          error = "Correo o contrase\xF1a incorrectos.";
        } else {
          const u = userRes.rows[0];
          const storedPassword = u.password;
          let isValid = false;
          try {
            isValid = await bcrypt.compare(password, storedPassword);
          } catch (e) {
          }
          if (!isValid && password === storedPassword) {
            isValid = true;
          }
          if (isValid) {
            const sessionPayload = Buffer.from(JSON.stringify({
              userId: u.userId,
              roleId: u.roleId,
              firstName: u.firstName,
              lastName: u.lastName
            })).toString("base64");
            Astro2.cookies.set("session", sessionPayload, { path: "/" });
            return Astro2.redirect("/");
          } else {
            error = "Correo o contrase\xF1a incorrectos.";
          }
        }
      } else {
        error = "Por favor ingresa correo y contrase\xF1a.";
      }
    } catch (e) {
      if (e instanceof Error) {
        error = `Error: ${e.message}`;
        console.error(e);
      } else {
        error = "Ocurri\xF3 un error desconocido.";
      }
    }
  }
  if (Astro2.locals.user) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Iniciar Sesi\xF3n" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="glass-strong rounded-2xl p-8 shadow-2xl w-full max-w-md animate-scale-in"> <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> </div> <h1 class="text-2xl font-bold text-center text-slate-800 mb-2 tracking-tight">Bienvenido a MedApp</h1> <p class="text-center text-slate-500 mb-6 text-sm">Ingresa tus credenciales para acceder</p> ${error && renderTemplate`<div class="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm mb-6 animate-fade-in shadow-sm flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${error} </div>`} <form method="POST" class="space-y-4"> <div> <label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> <input type="email" id="email" name="email" required placeholder="tu@correo.com" class="w-full bg-white/80 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"> </div> </div> <div> <div class="flex items-center justify-between mb-1.5 ml-1"> <label for="password" class="block text-sm font-semibold text-slate-700">Contraseña</label> </div> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full bg-white/80 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"> </div> </div> <button type="submit" class="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
Ingresar al Sistema
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg> </button> </form> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/login.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
