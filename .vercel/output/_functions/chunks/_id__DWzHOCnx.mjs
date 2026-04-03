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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.ENTRENADOR, ROLES.STAFF, ROLES.ESTUDIANTE])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const isDoctorOrAdmin = user?.roleId === ROLES.DOCTOR || user?.roleId === ROLES.ADMINISTRADOR || user?.roleId === ROLES.JEFE_MEDICO;
  const injRes = await db.execute({
    sql: `SELECT i.*, p.patientId, p.isAthlete, u.firstName, u.lastName
          FROM Injuries i
          JOIN Patients p ON i.patientId = p.patientId
          JOIN Users u ON p.patientId = u.userId
          WHERE i.injuryId = ?`,
    args: [String(id)]
  });
  if (injRes.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const injury = injRes.rows[0];
  if (user?.roleId === ROLES.ESTUDIANTE && Number(user.userId) !== Number(injury.patientId)) {
    return Astro2.redirect("/403");
  }
  if (Astro2.request.method === "POST" && (isDoctorOrAdmin || user?.roleId === ROLES.ENTRENADOR)) {
    const data = await Astro2.request.formData();
    const newStatus = data.get("status");
    const newSeverity = data.get("severity");
    await db.execute({
      sql: `UPDATE Injuries SET status = ?, severity = ? WHERE injuryId = ?`,
      args: [newStatus, newSeverity, String(id)]
    });
    return Astro2.redirect(`/injuries/${id}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Detalle de Lesión: ${injury.injuryType}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/injuries" class="hover:text-teal-600 transition-colors">Registro Global</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Detalles del Incidente</span> </div> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Incidente #${String(injury.injuryId).padStart(4, "0")}</h1> <div class="flex gap-2"> ${user?.roleId !== ROLES.ENTRENADOR && renderTemplate`<a${addAttribute(`/injuries/${injury.injuryId}/edit`, "href")} class="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
Editar Lesión
</a>`} <span${addAttribute(`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border ${injury.status === "Activa" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`, "class")}> ${injury.status} </span> </div> </div> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2 space-y-6"> <div class="glass-card rounded-2xl p-6"> <h3 class="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 text-lg tracking-tight">Análisis del Diagnóstico</h3> <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"> <div class="bg-rose-50 border border-rose-100 p-4 rounded-xl shadow-sm relative overflow-hidden"> <div class="absolute inset-0 bg-rose-500/5"></div> <span class="text-xs text-rose-400 font-bold uppercase tracking-widest block mb-1">Tipo Médico</span> <p class="text-rose-900 font-bold text-lg leading-tight">${injury.injuryType}</p> </div> <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm"> <span class="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Zona Afectada</span> <p class="text-slate-800 font-semibold leading-tight">${injury.bodyZone}</p> </div> <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm"> <span class="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Fecha / Campus</span> <p class="text-slate-800 font-semibold leading-tight">${String(injury.injuryDate).split(" ")[0]}</p> <p class="text-xs text-slate-500">${injury.campusLocation}</p> </div> </div> <div> <span class="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Comentarios Clínicos / Resumen Médico</span> <div class="bg-white/80 p-5 rounded-xl border border-slate-100 text-slate-600 italic shadow-inner"> ${injury.observations || "Sin observaciones detalladas documentadas."} </div> </div> </div> <div class="glass-card rounded-2xl p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-100/50"> <h3 class="font-bold text-slate-800 border-b border-amber-100 pb-3 mb-6 text-lg">Paciente Afectado</h3> <div class="flex items-center gap-4 mb-4"> <div class="w-14 h-14 bg-white text-slate-700 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm border border-slate-200"> ${String(injury.firstName)[0]}${String(injury.lastName)[0]} </div> <div> <h4 class="font-bold text-slate-800 text-xl">${injury.firstName} ${injury.lastName}</h4> <p class="text-slate-500 text-sm">Expediente #${String(injury.patientId).padStart(4, "0")}</p> </div> </div> <a${addAttribute(`/patients/${injury.patientId}?tab=lesiones`, "href")} class="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-white hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
Ver Expediente Clínico Completo
</a> </div> </div> <div class="lg:col-span-1 space-y-6"> <div class="glass-strong rounded-2xl p-6 border border-slate-200/60 sticky top-24"> <h3 class="font-bold text-slate-800 border-b border-slate-200 pb-3 mb-6">Gestión del Caso</h3> ${isDoctorOrAdmin ? renderTemplate`<form method="POST" class="space-y-4"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Evolución de Gravedad</label> <select name="severity" class="w-full bg-white border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Leve"${addAttribute(injury.severity === "Leve", "selected")}>Leve (Cuidado ambulatorio)</option> <option value="Moderada"${addAttribute(injury.severity === "Moderada", "selected")}>Moderada (Pausa Deportiva)</option> <option value="Grave"${addAttribute(injury.severity === "Grave", "selected")}>Grave (Atención Intensa)</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Alta Médica (Estado)</label> <select name="status" class="w-full bg-white border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Activa"${addAttribute(injury.status === "Activa", "selected")}>Lesión Activa / En Cuidados</option> <option value="Recuperado"${addAttribute(injury.status === "Recuperado", "selected")}>Paciente Recuperado (Alta)</option> </select> </div> <div class="pt-4 border-t border-slate-200"> <button type="submit" class="w-full px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white shadow-md font-bold rounded-xl transition-all active:scale-[0.98]">
Guardar Actualizaciones
</button> </div> </form>` : renderTemplate`<div class="bg-amber-50 border border-amber-200 p-4 rounded-xl"> <p class="text-xs text-amber-800 font-medium">Como entrenador, solo tienes acceso de lectura para monitorear esta lesión. Contacta al cuerpo médico para modificar el dictamen de Alta o Severidad.</p> </div>`} </div> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/injuries/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/injuries/[id].astro";
const $$url = "/injuries/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
