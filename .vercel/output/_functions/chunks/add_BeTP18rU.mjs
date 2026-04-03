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
  if (!checkRole(user, [ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO])) {
    return Astro2.redirect("/403");
  }
  const url = Astro2.url;
  const planId = url.searchParams.get("planId");
  let activePlans = [];
  let targetPlan = null;
  if (planId) {
    const pRes = await db.execute({
      sql: `SELECT pl.planId, u.firstName, u.lastName, p.patientId, pl.caloricRequirement 
              FROM NutritionalPlans pl
              JOIN Patients p ON pl.patientId = p.patientId
              JOIN Users u ON p.patientId = u.userId
              WHERE pl.planId = ?`,
      args: [planId]
    });
    targetPlan = pRes.rows[0];
  } else {
    const pRes = await db.execute(`
        SELECT pl.planId, u.firstName, u.lastName, pl.creationDate
        FROM NutritionalPlans pl
        JOIN Patients p ON pl.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        ORDER BY pl.creationDate DESC
    `);
    activePlans = pRes.rows;
    if (activePlans.length === 0) {
      return Astro2.redirect("/nutrition/profiles");
    }
  }
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const finalPlanId = planId || data.get("planId");
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await db.execute({
      sql: `INSERT INTO NutritionalFollowUps (
            planId, consultationId, followUpDate, currentWeight, currentBmi, compliancePercentage, adjustmentsMade, bodyMeasurements, newGoals
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        String(finalPlanId),
        1,
        // Fallback safe ID for consultation context
        date,
        data.get("currentWeight"),
        data.get("currentBmi"),
        data.get("compliancePercentage"),
        data.get("adjustmentsMade"),
        "{}",
        ""
      ]
    });
    return Astro2.redirect(`/nutrition/plans/${finalPlanId}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registrar Seguimiento Nutricional" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> ${targetPlan ? renderTemplate`<a${addAttribute(`/nutrition/plans/${targetPlan.planId}`, "href")} class="hover:text-teal-600 transition-colors">Volver al Plan</a>` : renderTemplate`<a href="/nutrition/profiles" class="hover:text-teal-600 transition-colors">Volver a Perfiles</a>`} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Consulta de Control</span> </div> <div class="flex items-center justify-between"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registrar Seguimiento (Follow-Up)</h1> </div> </div> <form method="POST" class="max-w-3xl space-y-6"> <div class="glass-card rounded-2xl p-6 mb-6"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-2 mb-6">Información del Paciente</h3> ${targetPlan ? renderTemplate`<div class="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-semibold shadow-sm text-sm flex items-center gap-2"> ${targetPlan.firstName} ${targetPlan.lastName} - Plan Activo: ${targetPlan.caloricRequirement} kcal
</div>` : renderTemplate`<select name="planId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">Seleccione a quién asignar esta consulta...</option> ${activePlans.map((p) => renderTemplate`<option${addAttribute(p.planId, "value")}>${p.firstName} ${p.lastName} (Plan del ${String(p.creationDate).split(" ")[0]})</option>`)} </select>`} </div> <div class="glass-card rounded-2xl p-6 bg-gradient-to-br from-sky-50/50 to-indigo-50/50 border border-sky-100/50"> <h3 class="text-lg font-bold text-slate-800 border-b border-sky-100 pb-2 mb-6">Métricas de Control</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Peso Actual (Kg)</label> <input type="number" step="0.1" name="currentWeight" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" placeholder="Ej. 72.5"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">IMC Actual</label> <input type="number" step="0.1" name="currentBmi" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" placeholder="Ej. 24.2"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">% Apego al Plan (0-100)</label> <input type="number" min="0" max="100" name="compliancePercentage" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" placeholder="Ej. 85"> </div> </div> <div class="mt-6"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Evolución, Síntomas y Ajustes de Menú</label> <textarea name="adjustmentsMade" required rows="4" class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" placeholder="Detalla cómo se sintió el paciente, si tuvo ansiedad, qué comidas hay que rotar..."></textarea> </div> </div> <div class="flex justify-end gap-3 pt-4"> ${targetPlan ? renderTemplate`<a${addAttribute(`/nutrition/plans/${targetPlan.planId}`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>` : renderTemplate`<a${addAttribute(`/nutrition/profiles`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>`} <button type="submit" class="px-8 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Control Clínico
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/nutrition/followups/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/nutrition/followups/add.astro";
const $$url = "/nutrition/followups/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
