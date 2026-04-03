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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const consultationIdParam = Astro2.url.searchParams.get("consultationId");
  const presRes = await db.execute({
    sql: `SELECT pr.*, m.brandName, m.activeIngredient, m.presentation,
               c.consultationId, a.patientId
        FROM Prescriptions pr
        JOIN Medications m ON pr.medicationId = m.medicationId
        JOIN Consultations c ON pr.consultationId = c.consultationId
        JOIN Appointments a ON c.appointmentId = a.appointmentId
        WHERE pr.prescriptionId = ?`,
    args: [String(id)]
  });
  if (presRes.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const pres = presRes.rows[0];
  const returnConsId = consultationIdParam || pres.consultationId;
  const medsRes = await db.execute(`SELECT medicationId, brandName, activeIngredient, presentation, currentStock FROM Medications ORDER BY brandName`);
  const medications = medsRes.rows;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const action = data.get("_action");
    if (action === "update") {
      const medicationId = data.get("medicationId");
      const dosage = data.get("dosage");
      const frequency = data.get("frequency");
      const duration = data.get("duration");
      await db.execute({
        sql: `UPDATE Prescriptions SET medicationId = ?, dosage = ?, frequency = ?, duration = ? WHERE prescriptionId = ?`,
        args: [medicationId, dosage, frequency, duration, String(id)]
      });
      return Astro2.redirect(`/consultations/${returnConsId}`);
    }
    if (action === "delete") {
      await db.execute({
        sql: `DELETE FROM Prescriptions WHERE prescriptionId = ?`,
        args: [String(id)]
      });
      return Astro2.redirect(`/consultations/${returnConsId}`);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Receta: ${pres.brandName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a${addAttribute(`/consultations/${returnConsId}`, "href")} class="hover:text-teal-600 transition-colors">Consulta #${String(returnConsId).padStart(4, "0")}</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Editar Receta</span> </div> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">${pres.brandName}</h1> <p class="text-slate-500 text-sm mt-1">${pres.activeIngredient} · ${pres.presentation} · Receta #${String(id).padStart(4, "0")}</p> </div> <!-- Botón de eliminar --> <form method="POST" onsubmit="return confirm('¿Estás seguro de eliminar esta receta? Esta acción no se puede deshacer.')"> <input type="hidden" name="_action" value="delete"> <button type="submit" class="px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
Eliminar Receta
</button> </form> </div> </div> <div class="max-w-2xl"> <form method="POST" class="glass-card rounded-2xl p-8 space-y-6"> <input type="hidden" name="_action" value="update"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Medicamento del Inventario</label> <select name="medicationId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"> ${medications.map((m) => renderTemplate`<option${addAttribute(m.medicationId, "value")}${addAttribute(m.medicationId === pres.medicationId, "selected")}> ${m.brandName} (${m.activeIngredient}) — ${m.presentation} (Stock: ${m.currentStock})
</option>`)} </select> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Dosis</label> <input type="text" name="dosage"${addAttribute(String(pres.dosage), "value")} required placeholder="Ej: 1 tableta, 5ml..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Frecuencia</label> <input type="text" name="frequency"${addAttribute(String(pres.frequency), "value")} required placeholder="Ej: Cada 8 horas..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"> </div> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Duración del Tratamiento</label> <input type="text" name="duration"${addAttribute(String(pres.duration), "value")} required placeholder="Ej: Por 7 días..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"> </div> <div class="flex justify-end gap-4 pt-4 border-t border-slate-200/60"> <a${addAttribute(`/consultations/${returnConsId}`, "href")} class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
Cancelar
</a> <button type="submit" class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Cambios
</button> </div> </form> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/prescriptions/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/prescriptions/[id].astro";
const $$url = "/prescriptions/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
