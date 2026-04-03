/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Edit;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const injRes = await db.execute({
    sql: `SELECT i.*, p.patientId, u.firstName, u.lastName, p.isAthlete
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
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const injuryType = data.get("injuryType");
    const bodyZone = data.get("bodyZone");
    const severity = data.get("severity");
    const campusLocation = data.get("campusLocation");
    const status = data.get("status");
    const estimatedRecovery = data.get("estimatedRecovery");
    const treatment = data.get("treatment");
    const observations = data.get("observations");
    await db.execute({
      sql: `UPDATE Injuries
          SET injuryType = ?, bodyZone = ?, severity = ?, campusLocation = ?,
              status = ?, estimatedRecovery = ?, treatment = ?, observations = ?
          WHERE injuryId = ?`,
      args: [
        injuryType,
        bodyZone,
        severity,
        campusLocation,
        status,
        estimatedRecovery || null,
        treatment,
        observations,
        String(id)
      ]
    });
    return Astro2.redirect(`/injuries/${id}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Lesión: ${injury.injuryType}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/injuries" class="hover:text-teal-600 transition-colors">Registro Global</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <a${addAttribute(`/injuries/${id}`, "href")} class="hover:text-teal-600 transition-colors">Detalles del Incidente</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Editar</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Editar Lesión #${String(id).padStart(4, "0")}</h1> <p class="text-slate-500 mt-1">Paciente: ${injury.firstName} ${injury.lastName}</p> </div> <form method="POST" class="max-w-3xl space-y-8"> <div class="glass-card rounded-2xl p-6"> <h2 class="text-lg font-bold text-slate-800 mb-5 border-b border-white/60 pb-3">Datos del Diagnóstico</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tipo de Lesión</label> <select name="injuryType" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> ${["Esguince", "Fractura", "Desgarro", "Contusión", "Luxación", "Otro"].map((t) => renderTemplate`<option${addAttribute(t, "value")}${addAttribute(injury.injuryType === t, "selected")}>${t}</option>`)} </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Zona Afectada</label> <input type="text" name="bodyZone"${addAttribute(String(injury.bodyZone), "value")} required placeholder="Ej: Tobillo Derecho" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Severidad</label> <select name="severity" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Leve"${addAttribute(injury.severity === "Leve", "selected")}>Leve</option> <option value="Moderada"${addAttribute(injury.severity === "Moderada", "selected")}>Moderada</option> <option value="Grave"${addAttribute(injury.severity === "Grave", "selected")}>Grave</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Campus / Ubicación</label> <select name="campusLocation" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> ${["Cancha de Futbol", "Gimnasio", "Alberca", "Pista de Atletismo", "Laboratorio", "Aula", "Área común", "Fuera del campus", "Otro"].map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(injury.campusLocation === c, "selected")}>${c}</option>`)} </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Estado Clínico</label> <select name="status" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="Activa"${addAttribute(injury.status === "Activa", "selected")}>Activa</option> <option value="En recuperación"${addAttribute(injury.status === "En recuperación", "selected")}>En Recuperación</option> <option value="Recuperada"${addAttribute(injury.status === "Recuperada", "selected")}>Recuperada (Alta)</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Recuperación Estimada</label> <input type="date" name="estimatedRecovery"${addAttribute(String(injury.estimatedRecovery || "").split("T")[0], "value")} class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tratamiento Indicado</label> <textarea name="treatment" rows="3" placeholder="Describe el tratamiento, fisioterapia, reposo, etc." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm">${injury.treatment}</textarea> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Observaciones Médicas</label> <textarea name="observations" rows="3" placeholder="Notas clínicas adicionales..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm">${injury.observations}</textarea> </div> </div> </div> <div class="flex justify-end gap-4"> <a${addAttribute(`/injuries/${id}`, "href")} class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Cambios
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/injuries/[id]/edit.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/injuries/[id]/edit.astro";
const $$url = "/injuries/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
