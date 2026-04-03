/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const consultationIdParam = Astro2.url.searchParams.get("consultationId");
  const patientIdParam = Astro2.url.searchParams.get("patientId");
  if (!consultationIdParam && !patientIdParam) {
    return Astro2.redirect("/patients?error=missing_context_for_prescription");
  }
  let consId;
  let finalPatientId;
  if (consultationIdParam) {
    consId = Number(consultationIdParam);
    if (!patientIdParam) {
      const pRes = await db.execute({
        sql: `SELECT a.patientId FROM Consultations c JOIN Appointments a ON c.appointmentId = a.appointmentId WHERE c.consultationId = ?`,
        args: [consId]
      });
      if (pRes.rows.length === 0) return Astro2.redirect("/patients?error=consultation_not_found");
      finalPatientId = pRes.rows[0].patientId;
    } else {
      finalPatientId = patientIdParam;
    }
  } else {
    const recentConsResult = await db.execute({
      sql: `SELECT c.consultationId FROM Consultations c 
          JOIN Appointments a ON c.appointmentId = a.appointmentId 
          WHERE a.patientId = ? 
          ORDER BY c.consultationDate DESC LIMIT 1`,
      args: [patientIdParam]
    });
    if (recentConsResult.rows.length === 0) {
      return Astro2.redirect(`/patients/${patientIdParam}?error=no_consultation_found`);
    }
    consId = recentConsResult.rows[0].consultationId;
    finalPatientId = patientIdParam;
  }
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    let medicationId = data.get("medicationId");
    const dosage = data.get("dosage");
    const frequency = data.get("frequency");
    const duration = data.get("duration");
    if (medicationId === "custom" || !medicationId) {
      medicationId = "1";
    }
    await db.execute({
      sql: `INSERT INTO Prescriptions (consultationId, medicationId, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)`,
      args: [consId, Number(medicationId), dosage, frequency, duration]
    });
    if (consultationIdParam) {
      return Astro2.redirect(`/consultations/${consultationIdParam}`);
    }
    return Astro2.redirect(`/patients/${finalPatientId}`);
  }
  const medResult = await db.execute(`SELECT medicationId, brandName, activeIngredient, presentation, currentStock FROM Medications WHERE currentStock > 0`);
  const medications = medResult.rows;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Recetar Medicamento" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> ${consultationIdParam ? renderTemplate`<a${addAttribute(`/consultations/${consultationIdParam}`, "href")} class="hover:text-teal-600 transition-colors">Volver a Consulta</a>` : renderTemplate`<a${addAttribute(`/patients/${finalPatientId}`, "href")} class="hover:text-teal-600 transition-colors">Volver a Expediente</a>`} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-indigo-700">Añadir Receta</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Recetar Medicamento</h1> </div> <div class="max-w-2xl"> <form method="POST" class="glass-card rounded-2xl p-6 space-y-6"> <div> <label for="medicationId" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Buscar Medicamento en Inventario</label> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3.5 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <select name="medicationId" id="medicationId" class="w-full bg-white/50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none" required> <option value="">Buscar molécula o marca...</option> ${medications.map((m) => renderTemplate`<option${addAttribute(String(m.medicationId), "value")}>${m.brandName} (${m.activeIngredient}) - ${m.presentation} (Stock: ${m.currentStock})</option>`)} <option value="custom">-- Prescribir medicamento externo (sin control de inventario) --</option> </select> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> <div> <label for="dosage" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Dosis</label> <input type="text" name="dosage" id="dosage" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. 1 tableta, 5ml..." required> </div> <div> <label for="frequency" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Frecuencia</label> <input type="text" name="frequency" id="frequency" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. Cada 8 horas..." required> </div> </div> <div> <label for="duration" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Duración del tratamiento</label> <input type="text" name="duration" id="duration" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. Por 7 días..." required> </div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-200/60"> ${consultationIdParam ? renderTemplate`<a${addAttribute(`/consultations/${consultationIdParam}`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>` : renderTemplate`<a${addAttribute(`/patients/${finalPatientId}`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>`} <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">Añadir Receta</button> </div> </form> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/prescriptions/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/prescriptions/add.astro";
const $$url = "/prescriptions/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
