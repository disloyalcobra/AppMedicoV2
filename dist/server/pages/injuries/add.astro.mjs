/* empty css                                  */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const url = Astro2.url;
  const patientIdParam = url.searchParams.get("patientId");
  const pId = patientIdParam || "6";
  let success = false;
  let notifyCoach = false;
  const patientResult = await db.execute({
    sql: `SELECT p.patientId, u.firstName, u.lastName, p.isAthlete, p.sport 
        FROM Patients p JOIN Users u ON p.patientId = u.userId 
        WHERE p.patientId = ?`,
    args: [pId]
  });
  const patientData = patientResult.rows[0];
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    notifyCoach = data.get("notifyCoach") === "on";
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
      args: [pId, consId, campus, patientData?.sport || "Ninguno", type, zone, severity, date, notes]
    });
    if (notifyCoach && patientData.isAthlete === 1) {
      console.log("NOTIFICANDO AL ENTRENADOR (Alerta generada)");
      const coachesResult = await db.execute({
        sql: `SELECT coachId FROM Coach_Athlete WHERE patientId = ?`,
        args: [pId]
      });
      for (const coach of coachesResult.rows) {
        await db.execute({
          sql: `INSERT INTO CollaborativeNotes (patientId, authorId, noteContent, isAlert, alertTags)
               VALUES (?, ?, ?, 1, 'lesi\xF3n')`,
          args: [pId, user?.userId || 1, `ALERTA LESI\xD3N: ${patientData.firstName} ${patientData.lastName} present\xF3 ${type} en ${zone} (Severidad: ${severity}).`]
        });
      }
    }
    success = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reportar Lesi\xF3n" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6 flex justify-between items-end"> <div> <a${addAttribute(`/patients/${pId}`, "href")} class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a Expediente
</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Reportar Nueva Lesión</h1> <p class="text-slate-500 mt-1">Registra los detalles del diagnóstico y alerta al entrenador si aplica.</p> </div> </div> ${success && renderTemplate`<div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between"> <div class="flex items-center gap-2 font-medium"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
Lesión reportada exitosamente. ${notifyCoach ? "Alerta enviada al entrenador asignado." : ""} </div> <a${addAttribute(`/patients/${pId}`, "href")} class="text-emerald-800 underline font-bold">Ver Expediente</a> </div>`}<form method="POST" class="glass-card rounded-2xl p-8 max-w-3xl"> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Paciente (Seleccionado)</label> <div class="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-semibold shadow-sm cursor-not-allowed text-sm flex items-center gap-2"> ${patientData?.firstName} ${patientData?.lastName} (Exp: ${String(pId).padStart(4, "0")})
${patientData?.isAthlete === 1 && renderTemplate`<span class="bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">
Atleta: ${patientData.sport} </span>`} </div> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tipo de Lesión</label> <select name="type" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">Seleccionar...</option> <option value="Esguince">Esguince</option> <option value="Fractura">Fractura</option> <option value="Desgarro">Desgarre</option> <option value="Contusión">Contusión</option> <option value="Luxación">Luxación</option> <option value="Otro">Otro</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Zona Afectada</label> <input type="text" name="zone" required placeholder="Ej: Tobillo Derecho" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Severidad</label> <select name="severity" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Leve">Leve</option> <option value="Moderada">Moderada</option> <option value="Grave">Grave</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Campus</label> <select name="campus" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Cancha de Futbol">Cancha de Futbol</option> <option value="Gimnasio">Gimnasio</option> <option value="Alberca">Alberca</option> <option value="Laboratorio">Laboratorio</option> <option value="Otro">Otro</option> </select> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Diagnóstico / Observaciones</label> <textarea name="notes" rows="4" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" placeholder="Detalle médico de la lesión..."></textarea> </div> ${patientData?.isAthlete === 1 && renderTemplate`<div class="md:col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-200 mt-2"> <label class="flex items-start gap-3 cursor-pointer"> <div class="relative flex items-center pt-1"> <input type="checkbox" name="notifyCoach" class="w-5 h-5 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 focus:ring-2" checked> </div> <div> <p class="font-bold text-amber-900">Notificar al Entrenador Asignado</p> <p class="text-sm text-amber-800 mt-0.5">El paciente es atleta de ${patientData.sport}. Esto generará una alerta en el dashboard del Coach.</p> </div> </label> </div>`} </div> <div class="mt-8 flex justify-end gap-3"> <a${addAttribute(`/patients/${pId}`, "href")} class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
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
