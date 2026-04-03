/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { r as renderScript } from './script_e2ctIiTj.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.STAFF])) {
    return Astro2.redirect("/403");
  }
  [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR].includes(user?.roleId);
  const consRes = await db.execute(`
  SELECT 
    c.consultationId,
    c.consultationDate,
    c.diagnosis,
    c.symptoms,
    u.firstName || ' ' || u.lastName AS patient,
    a.patientId,
    ud.firstName || ' ' || ud.lastName AS doctor,
    a.status AS aptStatus,
    (SELECT COUNT(*) FROM Prescriptions pr WHERE pr.consultationId = c.consultationId) AS rxCount
  FROM Consultations c
  JOIN Appointments a ON c.appointmentId = a.appointmentId
  JOIN Patients p ON a.patientId = p.patientId
  JOIN Users u ON p.patientId = u.userId
  JOIN Users ud ON a.doctorId = ud.userId
  ORDER BY c.consultationDate DESC
`);
  const consultations = consRes.rows;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Consultas Médicas" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Consultas Médicas</h1> <p class="text-slate-500 mt-1">Historial global de consultas, diagnósticos y recetas por paciente</p> </div> </div>  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"> <div class="glass-card rounded-2xl p-5 border border-white/60"> <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Total Consultas</p> <p class="text-3xl font-bold text-slate-800">${consultations.length}</p> </div> <div class="glass-card rounded-2xl p-5 border border-white/60"> <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Con Recetas</p> <p class="text-3xl font-bold text-indigo-700">${consultations.filter((c) => c.rxCount > 0).length}</p> </div> <div class="glass-card rounded-2xl p-5 border border-white/60 col-span-2 md:col-span-1"> <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Sin Recetas</p> <p class="text-3xl font-bold text-slate-400">${consultations.filter((c) => c.rxCount === 0).length}</p> </div> </div>  <div class="glass-card rounded-2xl overflow-hidden border border-white/60"> <div class="p-4 border-b border-slate-200/60 bg-white/30 flex items-center gap-4"> <div class="relative flex-1 max-w-md"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-2.5 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <input type="text" id="searchInput" placeholder="Buscar por paciente o diagnóstico..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"> </div> </div> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50/50 border-b border-slate-200/60"> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Paciente</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Fecha</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold hidden md:table-cell">Diagnóstico</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold hidden lg:table-cell">Doctor</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center">Recetas</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-right">Acciones</th> </tr> </thead> <tbody class="divide-y divide-slate-100/60" id="consultationTable"> ${consultations.length === 0 ? renderTemplate`<tr> <td colspan="6" class="text-center py-12 text-slate-500">No hay consultas registradas en el sistema.</td> </tr>` : consultations.map((c) => renderTemplate`<tr class="hover:bg-white/40 transition-colors consultation-row"> <td class="p-4"> <div class="flex items-center gap-3"> <div class="w-9 h-9 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm shrink-0"> ${String(c.patient).split(" ").map((n) => n[0]).slice(0, 2).join("")} </div> <div> <p class="font-bold text-slate-800 patient-name">${c.patient}</p> <a${addAttribute(`/patients/${c.patientId}`, "href")} class="text-[10px] text-teal-600 hover:underline font-semibold">Exp. #${String(c.patientId).padStart(4, "0")}</a> </div> </div> </td> <td class="p-4"> <span class="text-sm font-semibold text-slate-700 font-mono">${String(c.consultationDate).split("T")[0]}</span> </td> <td class="p-4 hidden md:table-cell max-w-xs"> <p class="text-sm text-slate-600 truncate diagnosis-text">${c.diagnosis || "Sin diagnóstico"}</p> </td> <td class="p-4 hidden lg:table-cell"> <p class="text-sm text-slate-600">Dr. ${c.doctor}</p> </td> <td class="p-4 text-center"> <span${addAttribute(`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${Number(c.rxCount) > 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-400 border-slate-200"}`, "class")}> ${c.rxCount} </span> </td> <td class="p-4 text-right"> <a${addAttribute(`/consultations/${c.consultationId}`, "href")} class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors text-xs font-semibold shadow-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
Ver Detalle
</a> </td> </tr>`)} </tbody> </table> </div> </div> ` })} ${renderScript($$result, "C:/claude-projects/AppMedicoV2/src/pages/consultations/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/consultations/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/consultations/index.astro";
const $$url = "/consultations";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
