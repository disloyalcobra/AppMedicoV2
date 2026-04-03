/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.ENTRENADOR])) {
    return Astro2.redirect("/403");
  }
  const canEdit = [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR].includes(user?.roleId);
  const injRes = await db.execute(`
  SELECT i.injuryId as id, i.injuryType as type, i.bodyZone as zone, 
         i.injuryDate as dateStr, i.status, i.severity, i.campusLocation,
         p.patientId, p.isAthlete, i.sport,
         u.firstName || ' ' || u.lastName as patient
  FROM Injuries i
  JOIN Patients p ON i.patientId = p.patientId
  JOIN Users u ON p.patientId = u.userId
  ORDER BY i.injuryDate DESC
`);
  const injuries = injRes.rows.map((r) => {
    const d = new Date(r.dateStr);
    return {
      id: Number(r.id),
      type: String(r.type),
      zone: String(r.zone),
      date: d.toLocaleDateString(),
      dateStr: String(r.dateStr),
      status: String(r.status),
      severity: String(r.severity),
      campusLocation: String(r.campusLocation),
      patientId: Number(r.patientId),
      isAthlete: r.isAthlete === 1,
      sport: String(r.sport),
      patient: String(r.patient)
    };
  });
  const severityStyles = {
    "Leve": "bg-sky-50 text-sky-700 border-sky-200",
    "Moderada": "bg-amber-50 text-amber-700 border-amber-200",
    "Grave": "bg-rose-50 text-rose-700 border-rose-200"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro Global de Lesiones" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registro de Lesiones</h1> <p class="text-slate-500 mt-1">Monitoreo epidemiológico y atención de incidentes dentro de campus.</p> </div> ${canEdit && renderTemplate`<a href="/injuries/add" class="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Reportar Lesión
</a>`} </div> <div class="glass-card rounded-2xl overflow-hidden border border-white/60"> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50/50 border-b border-slate-200/60"> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center w-16">ID</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Paciente</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Lesión</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Fecha</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center">Estado</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center">Gravedad</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-right">Acciones</th> </tr> </thead> <tbody class="divide-y divide-slate-100/60"> ${injuries.map((injury) => renderTemplate`<tr class="hover:bg-white/40 transition-colors"> <td class="p-4 text-center"> <span class="text-slate-400 font-bold text-sm">#${injury.id.toString().padStart(4, "0")}</span> </td> <td class="p-4"> <div class="flex items-center gap-3"> <div> <a${addAttribute(`/patients/${injury.patientId}?tab=lesiones`, "href")} class="font-bold text-slate-800 hover:text-teal-700 transition-colors">${injury.patient}</a> ${injury.isAthlete && renderTemplate`<p class="text-xs text-amber-700 font-medium flex items-center gap-1 mt-0.5"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path></svg> ${injury.sport} </p>`} </div> </div> </td> <td class="p-4"> <p class="font-bold text-slate-700">${injury.type}</p> <p class="text-sm text-slate-500">${injury.zone}</p> </td> <td class="p-4"> <span class="text-slate-600 font-medium">${injury.date}</span> </td> <td class="p-4 text-center"> <span class="px-3 py-1 bg-white/60 border border-slate-200 text-slate-600 rounded-full text-xs font-bold inline-block w-32 shadow-sm"> ${injury.status} </span> </td> <td class="p-4 text-center"> <span${addAttribute(`px-3 py-1 border rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${severityStyles[injury.severity]}`, "class")}> ${injury.severity} </span> </td> <td class="p-4 text-right"> <div class="flex items-center justify-end gap-2"> ${canEdit && renderTemplate`<a${addAttribute(`/injuries/${injury.id}/edit`, "href")} class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-300 transition-colors shadow-sm" title="Editar"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg> </a>`} <a${addAttribute(`/injuries/${injury.id}`, "href")} class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm" title="Ver Detalles"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m12 16 4-4-4-4"></path><path d="M8 12h8"></path></svg> </a> </div> </td> </tr>`)} </tbody> </table> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/injuries/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/injuries/index.astro";
const $$url = "/injuries";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
