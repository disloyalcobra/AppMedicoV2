/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute, F as Fragment } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.ESTUDIANTE])) {
    return Astro2.redirect("/403");
  }
  const url = Astro2.url;
  let patientIdParam = url.searchParams.get("patientId");
  if (user?.roleId === ROLES.ESTUDIANTE) {
    patientIdParam = String(user.userId);
  }
  const allPatientsRes = await db.execute(`SELECT p.patientId, u.firstName, u.lastName, p.isAthlete FROM Patients p JOIN Users u ON p.patientId = u.userId`);
  const allPatients = allPatientsRes.rows;
  let patientData = null;
  if (patientIdParam) {
    patientData = allPatients.find((p) => p.patientId.toString() === patientIdParam);
  }
  let success = false;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const finalPatientId = patientIdParam || data.get("patientId");
    patientData = allPatients.find((p) => p.patientId.toString() === finalPatientId);
    const notifyCoach = data.get("notifyCoach") === "on";
    const type = data.get("type");
    const zone = data.get("zone");
    const severity = data.get("severity");
    const campus = data.get("campus");
    const notes = data.get("notes");
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const consId = 1;
    await db.execute({
      sql: `INSERT INTO Injuries (patientId, consultationId, campusLocation, sport, injuryType, bodyZone, severity, injuryDate, observations, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Activa')`,
      args: [finalPatientId, consId, campus, patientData?.sport || "Ninguno", type, zone, severity, date, notes]
    });
    if (notifyCoach && patientData.isAthlete === 1) {
      console.log("[AlertSystem] Notificando entrenadores...");
      const coachesResult = await db.execute({
        sql: `SELECT coachId FROM Coach_Athlete WHERE patientId = ?`,
        args: [finalPatientId]
      });
      for (const coach of coachesResult.rows) {
        await db.execute({
          sql: `INSERT INTO CollaborativeNotes (patientId, authorId, noteContent, isAlert, alertTags)
               VALUES (?, ?, ?, 1, 'lesión')`,
          args: [finalPatientId, user?.userId || 1, `ALERTA LESIÓN: ${patientData.firstName} ${patientData.lastName} presentó ${type} en ${zone} (Severidad: ${severity}).`]
        });
      }
    }
    success = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reportar Lesión" }, { "default": async ($$result2) => renderTemplate`${success && renderTemplate`${maybeRenderHead()}<div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold flex justify-between items-center animate-in fade-in slide-in-from-top-4"> <span>✅ Lesión reportada correctamente.</span> <a${addAttribute(patientIdParam ? `/patients/${patientIdParam}` : "/injuries", "href")} class="underline text-emerald-900">Volver</a> </div>`}<div class="mb-6 flex justify-between items-end"> <div>  ${patientIdParam ? renderTemplate`<a${addAttribute(`/patients/${patientIdParam}`, "href")} class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a Expediente
</a>` : renderTemplate`<a href="/injuries" class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a Lesiones
</a>`} <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Reportar Nueva Lesión</h1> <p class="text-slate-500 mt-1">Registra los detalles del diagnóstico y alerta al entrenador si aplica.</p> </div> </div> <form method="POST" class="glass-card rounded-2xl p-8 max-w-3xl"> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Paciente</label>  ${patientIdParam ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-semibold shadow-sm cursor-not-allowed text-sm flex items-center gap-2"> ${patientData?.firstName} ${patientData?.lastName} (Exp: ${String(patientIdParam).padStart(4, "0")})
${patientData?.isAthlete === 1 && renderTemplate`<span class="bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">
Atleta: ${patientData.sport} </span>`} </div> <input type="hidden" name="patientId"${addAttribute(patientIdParam, "value")}> ` })}` : renderTemplate`<select name="patientId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">Selecciona paciente de la lista...</option> ${allPatients.map((p) => renderTemplate`<option${addAttribute(String(p.patientId), "value")}>${p.firstName} ${p.lastName}</option>`)} </select>`} </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tipo de Lesión</label> <select name="type" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">Seleccionar...</option> <option value="Esguince">Esguince</option> <option value="Fractura">Fractura</option> <option value="Desgarro">Desgarre</option> <option value="Contusión">Contusión</option> <option value="Luxación">Luxación</option> <option value="Otro">Otro</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Zona Afectada</label> <input type="text" name="zone" required placeholder="Ej: Tobillo Derecho" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Severidad</label> <select name="severity" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Leve">Leve</option> <option value="Moderada">Moderada</option> <option value="Grave">Grave</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Campus</label> <select name="campus" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Cancha de Futbol">Cancha de Futbol</option> <option value="Gimnasio">Gimnasio</option> <option value="Alberca">Alberca</option> <option value="Laboratorio">Laboratorio</option> <option value="Otro">Otro</option> </select> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Diagnóstico / Observaciones</label> <textarea name="notes" rows="4" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="Detalle médico de la lesión..."></textarea> </div>  ${patientData?.isAthlete === 1 && renderTemplate`<div class="md:col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-200 mt-2"> <label class="flex items-start gap-3 cursor-pointer"> <div class="relative flex items-center pt-1"> <input type="checkbox" name="notifyCoach" class="w-5 h-5 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 focus:ring-2" checked> </div> <div> <p class="font-bold text-amber-900">Notificar al Entrenador Asignado</p> <p class="text-sm text-amber-800 mt-0.5">El paciente es atleta de ${patientData.sport}. Esto generará una alerta en el dashboard del Coach.</p> </div> </label> </div>`} </div> <div class="mt-8 flex justify-end gap-3"> <a${addAttribute(patientIdParam ? `/patients/${patientIdParam}` : "/injuries", "href")} class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar y Reportar Lesión
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/injuries/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/injuries/add.astro";
const $$url = "/injuries/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
