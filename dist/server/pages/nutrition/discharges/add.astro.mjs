/* empty css                                     */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../../../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../../../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
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
      sql: `SELECT pl.planId, u.firstName, u.lastName, p.patientId, pl.dailyCalories 
              FROM NutritionalPlans pl
              JOIN Patients p ON pl.patientId = p.patientId
              JOIN Users u ON p.patientId = u.userId
              WHERE pl.planId = ? AND pl.planId NOT IN (SELECT planId FROM NutritionalDischarges)`,
      args: [planId]
    });
    if (pRes.rows.length === 0) {
      return Astro2.redirect("/nutrition/profiles");
    }
    targetPlan = pRes.rows[0];
  } else {
    const pRes = await db.execute(`
        SELECT pl.planId, u.firstName, u.lastName, pl.creationDate
        FROM NutritionalPlans pl
        JOIN Patients p ON pl.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        WHERE pl.planId NOT IN (SELECT planId FROM NutritionalDischarges)
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
    const goalAchieved = data.get("goalAchieved") === "on" ? 1 : 0;
    await db.execute({
      sql: `INSERT INTO NutritionalDischarges (
            planId, dischargeDate, reason, targetWeightAchieved, finalWeight, maintenanceRecommendations, goalAchieved
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        finalPlanId,
        date,
        data.get("reason"),
        data.get("targetWeightAchieved"),
        data.get("finalWeight"),
        data.get("maintenanceRecommendations"),
        goalAchieved
      ]
    });
    return Astro2.redirect(`/nutrition/profiles`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Alta Nutricional" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> ${targetPlan ? renderTemplate`<a${addAttribute(`/nutrition/plans/${targetPlan.planId}`, "href")} class="hover:text-emerald-600 transition-colors">Volver al Plan</a>` : renderTemplate`<a href="/nutrition/profiles" class="hover:text-emerald-600 transition-colors">Volver a Perfiles</a>`} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-emerald-700">Cierre de Tratamiento</span> </div> <div class="flex items-center justify-between"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Alta Médica Nutricional</h1> </div> </div> <form method="POST" class="max-w-3xl space-y-6"> <div class="glass-card rounded-2xl p-6 mb-6"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-2 mb-6">Cierre para el Paciente</h3> ${targetPlan ? renderTemplate`<div class="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-semibold shadow-sm text-sm flex items-center gap-2"> ${targetPlan.firstName} ${targetPlan.lastName} - Finalizando Plan Actual
</div>` : renderTemplate`<select name="planId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"> <option value="">Seleccione el plan a dar de alta...</option> ${activePlans.map((p) => renderTemplate`<option${addAttribute(p.planId, "value")}>${p.firstName} ${p.lastName} (Plan del ${String(p.creationDate).split(" ")[0]})</option>`)} </select>`} </div> <div class="glass-card rounded-2xl p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-100/50"> <h3 class="text-lg font-bold text-slate-800 border-b border-emerald-100 pb-2 mb-6">Resultados Finales</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Peso Final Alcanzado (Kg)</label> <input type="number" step="0.1" name="finalWeight" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Ej. 68.5"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Peso Meta Propuesto (Kg)</label> <input type="number" step="0.1" name="targetWeightAchieved" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Ej. 68.0"> </div> </div> <div class="mb-5"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Motivo del Alta</label> <select name="reason" required class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"> <option value="Metas Alcanzadas">Metas Completamente Alcanzadas</option> <option value="Abandono">Abandono de Tratamiento</option> <option value="Traslado médico">Traslado a otro especialista / Médico</option> <option value="Alta voluntaria">Alta Voluntaria del Paciente</option> </select> </div> <div class="mb-5 bg-white/60 border border-emerald-200 p-4 rounded-xl"> <label class="flex items-start gap-3 cursor-pointer"> <div class="relative flex items-center pt-1"> <input type="checkbox" name="goalAchieved" class="w-5 h-5 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500 focus:ring-2" checked> </div> <div> <p class="font-bold text-emerald-900">¿El objetivo nutricional fue alcanzado de manera clínica?</p> <p class="text-sm text-emerald-800 mt-0.5">Marcar esta casilla validará el tratamiento como "Exitoso" en las estadísticas globales.</p> </div> </label> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Recomendaciones de Mantenimiento</label> <textarea name="maintenanceRecommendations" required rows="3" class="w-full bg-white/80 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Instrucciones para que el paciente mantenga sus resultados de forma autónoma..."></textarea> </div> </div> <div class="flex justify-end gap-3 pt-4"> ${targetPlan ? renderTemplate`<a${addAttribute(`/nutrition/plans/${targetPlan.planId}`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>` : renderTemplate`<a${addAttribute(`/nutrition/profiles`, "href")} class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a>`} <button type="submit" class="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9l-5 5-2-2"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
Cerrar Tratamiento y Dar de Alta
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/nutrition/discharges/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/nutrition/discharges/add.astro";
const $$url = "/nutrition/discharges/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
