/* empty css                               */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  let query = `
  SELECT 
    p.patientId as id, 
    u.firstName, 
    u.lastName, 
    p.dateOfBirth, 
    p.isAthlete, 
    p.bloodType,
    p.gender,
    p.weight,
    p.height,
    p.allergies,
    p.schoolLevel
  FROM Patients p
  JOIN Users u ON p.patientId = u.userId
`;
  let queryArgs = [];
  if (user?.roleId === ROLES.ENTRENADOR) {
    query += ` JOIN Coach_Athlete ca ON p.patientId = ca.patientId WHERE ca.coachId = ?`;
    queryArgs.push(user.userId);
  }
  const result = await db.execute({ sql: query, args: queryArgs });
  const patients = result.rows.map((row) => {
    const dob = new Date(row.dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return {
      ...row,
      age
    };
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pacientes" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Directorio de Pacientes</h1> <p class="text-slate-500 mt-1">Busca y gestiona expedientes médicos</p> </div> ${(user?.roleId === ROLES.DOCTOR || user?.roleId === ROLES.ADMINISTRADOR || user?.roleId === ROLES.JEFE_MEDICO) && renderTemplate`<a href="/patients/add" class="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Nuevo Paciente
</a>`} </div> <div class="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4"> <div class="relative flex-1"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <input type="text" placeholder="Buscar paciente por nombre, expediente o deporte..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"> </div> <button class="px-4 py-2 border border-slate-200/60 rounded-xl bg-white/50 text-slate-600 hover:bg-slate-50/80 transition-colors flex items-center gap-2 text-sm font-medium"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
Filtros
</button> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${patients.length === 0 ? renderTemplate`<div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-slate-500">
No hay pacientes registrados en el sistema.
</div>` : patients.map((p) => renderTemplate`<a${addAttribute(`/patients/${p.id}`, "href")} class="block group"> <div class="glass-card rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl relative overflow-hidden border border-white/80"> ${p.isAthlete === 1 && renderTemplate`<div class="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200 uppercase tracking-widest flex items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path></svg>
Atleta
</div>`} <div class="flex items-center gap-4 mb-5"> <div${addAttribute(`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm border ${p.isAthlete === 1 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-teal-50 text-teal-700 border-teal-200"}`, "class")}> ${String(p.firstName)[0]}${String(p.lastName)[0]} </div> <div> <h3 class="text-xl font-bold text-slate-800">${p.firstName} ${p.lastName}</h3> <p class="text-sm text-slate-500 font-medium">${p.age} años • Exp. #${String(p.id).padStart(4, "0")}</p> </div> </div> <div class="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-4"> <div> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Sangre</p> <p class="font-medium text-slate-800 flex items-center gap-1.5"> <span class="w-2 h-2 rounded-full bg-rose-500"></span> ${p.bloodType || "N/A"} </p> </div> <div> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Perfil Físico</p> <p class="font-medium text-slate-800">${p.weight ? p.weight + "kg" : "-"} • ${p.height ? p.height + "cm" : "-"}</p> </div> <div class="col-span-2 mt-1 flex items-center justify-between"> <p class="text-xs text-slate-500"><span class="font-semibold text-slate-600">Género:</span> ${p.gender}</p> <p class="text-xs text-slate-500"><span class="font-semibold text-slate-600">Escolaridad:</span> ${p.schoolLevel || "N/A"}</p> </div> </div> <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between"> <span class="text-xs font-semibold text-teal-600 group-hover:underline underline-offset-4">Ver expediente completo &rarr;</span> </div> </div> </a>`)} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/patients/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/patients/index.astro";
const $$url = "/patients";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
