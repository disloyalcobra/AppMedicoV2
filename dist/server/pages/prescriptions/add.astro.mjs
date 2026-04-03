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
  const recentConsResult = await db.execute(`
    SELECT consultationId, appointmentId FROM Consultations 
    ORDER BY consultationDate DESC LIMIT 1
`);
  const consId = recentConsResult.rows.length > 0 ? recentConsResult.rows[0].consultationId : 1;
  const pRes = await db.execute({
    sql: `SELECT patientId FROM Appointments WHERE appointmentId = (SELECT appointmentId FROM Consultations WHERE consultationId = ?)`,
    args: [consId]
  });
  const patientReturnId = pRes.rows.length > 0 ? pRes.rows[0].patientId : 6;
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
    return Astro2.redirect(`/patients/${patientReturnId}`);
  }
  const medResult = await db.execute(`SELECT medicationId, brandName, activeIngredient, presentation, currentStock FROM Medications WHERE currentStock > 0`);
  const medications = medResult.rows;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Recetar Medicamento" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a${addAttribute(`/patients/${patientReturnId}`, "href")} class="hover:text-teal-600 transition-colors">Volver a Expediente</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Añadir a Receta</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Recetar Medicamento</h1> </div> <div class="max-w-2xl"> <form method="POST" class="glass-card rounded-2xl p-6 space-y-6"> <div> <label for="medicationId" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Buscar Medicamento en Inventario</label> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3.5 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <select name="medicationId" id="medicationId" class="w-full bg-white/50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none" required> <option value="">Buscar molécula o marca...</option> ${medications.map((m) => renderTemplate`<option${addAttribute(m.medicationId, "value")}>${m.brandName} (${m.activeIngredient}) - ${m.presentation} (Stock: ${m.currentStock})</option>`)} <option value="custom">-- Prescribir medicamento externo (sin control de inventario) --</option> </select> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> <div> <label for="dosage" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Dosis</label> <input type="text" name="dosage" id="dosage" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. 1 tableta, 5ml..." required> </div> <div> <label for="frequency" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Frecuencia</label> <input type="text" name="frequency" id="frequency" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. Cada 8 horas..." required> </div> </div> <div> <label for="duration" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Duración del tratamiento</label> <input type="text" name="duration" id="duration" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej. Por 7 días..." required> </div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-200/60"> <a${addAttribute(`/patients/${patientReturnId}`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">Añadir a Receta</button> </div> </form> </div> ` })}`;
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
