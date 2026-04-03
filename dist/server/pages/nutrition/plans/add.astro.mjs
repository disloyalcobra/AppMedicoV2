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
  const patientId = url.searchParams.get("patientId");
  let patientsWithProfiles = [];
  let targetPatient = null;
  if (patientId) {
    const pRes = await db.execute({
      sql: `SELECT p.patientId, u.firstName, u.lastName, np.profileId, np.nutritionalObjective 
              FROM Patients p 
              JOIN Users u ON p.patientId = u.userId 
              JOIN NutritionalProfiles np ON p.patientId = np.patientId
              WHERE p.patientId = ?`,
      args: [patientId]
    });
    targetPatient = pRes.rows[0];
  } else {
    const pRes = await db.execute(`
        SELECT p.patientId, u.firstName, u.lastName 
        FROM Patients p 
        JOIN Users u ON p.patientId = u.userId 
        JOIN NutritionalProfiles np ON p.patientId = np.patientId
        -- In a strict flow, we might filter those who already have a plan:
        -- WHERE p.patientId NOT IN (SELECT patientId FROM NutritionalPlans WHERE patientAccepted = 0 OR ...)
    `);
    patientsWithProfiles = pRes.rows;
    if (patientsWithProfiles.length === 0) {
      return Astro2.redirect("/nutrition/profiles");
    }
  }
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const finalPatientId = patientId || data.get("patientId");
    const nutritionistId = user?.userId || 1;
    await db.execute({
      sql: `INSERT INTO NutritionalPlans (
            patientId, nutritionistId, dailyCalories, carbohydratesPercent, 
            proteinsPercent, fatsPercent, weeklyMenuJson, recommendations, patientAccepted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      args: [
        finalPatientId,
        nutritionistId,
        data.get("dailyCalories"),
        data.get("carbohydratesPercent"),
        data.get("proteinsPercent"),
        data.get("fatsPercent"),
        data.get("weeklyMenuJson"),
        data.get("recommendations")
      ]
    });
    const newPlanRes = await db.execute({
      sql: `SELECT planId FROM NutritionalPlans WHERE patientId = ? ORDER BY creationDate DESC LIMIT 1`,
      args: [finalPatientId]
    });
    return Astro2.redirect(`/nutrition/plans/${newPlanRes.rows[0].planId}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dise\xF1ar Plan Nutricional" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/nutrition/profiles" class="hover:text-teal-600 transition-colors">Volver a Perfiles</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Diseño de Plan</span> </div> <div class="flex items-center justify-between"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Nuevo Plan Nutricional</h1> </div> </div> <form method="POST" class="max-w-4xl space-y-6"> <div class="glass-card rounded-2xl p-6 mb-6"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-2 mb-6">Paciente Objetivo</h3> ${targetPatient ? renderTemplate`<div class="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-semibold shadow-sm text-sm flex items-center justify-between"> <div> ${targetPatient.firstName} ${targetPatient.lastName} </div> <div class="text-slate-500 text-xs font-normal">
Meta: <span class="font-bold text-teal-700">${targetPatient.nutritionalObjective}</span> </div> </div>` : renderTemplate`<select name="patientId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">Seleccione un paciente con evaluación previa...</option> ${patientsWithProfiles.map((p) => renderTemplate`<option${addAttribute(p.patientId, "value")}>${p.firstName} ${p.lastName}</option>`)} </select>`} </div> <div class="glass-card rounded-2xl p-6"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-2 mb-6">Cálculo Calórico y Macronutrientes</h3> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Calorías Diarias (kcal)</label> <input type="number" name="dailyCalories" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej. 2500"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">% Carbohidratos</label> <input type="number" name="carbohydratesPercent" required class="w-full bg-amber-50/50 border border-amber-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej. 50"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">% Proteínas</label> <input type="number" name="proteinsPercent" required class="w-full bg-rose-50/50 border border-rose-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Ej. 30"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">% Grasas</label> <input type="number" name="fatsPercent" required class="w-full bg-sky-50/50 border border-sky-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Ej. 20"> </div> </div> <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-3 text-right">La suma de los % debe ser 100</p> </div> <div class="glass-card rounded-2xl p-6 bg-gradient-to-br from-amber-50/30 to-orange-50/30 border border-amber-100"> <h3 class="text-lg font-bold text-slate-800 border-b border-amber-100 pb-2 mb-6">Menú Semanal (Sistema de Equivalencias / JSON)</h3> <div class="space-y-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Estructura del Menú</label> <textarea name="weeklyMenuJson" rows="8" class="w-full bg-white/70 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs" placeholder="{&quot;lunes&quot;: {&quot;desayuno&quot;: &quot;2 huevos, 1 pan integral...&quot;, &quot;comida&quot;: &quot;...&quot;}}">${`{
  "desayuno": "Equivalentes a cubrir: 2 cereales, 2 origen animal, 1 grasa",
  "colacion_1": "1 fruta, 1 oleaginosa",
  "comida": "3 origen animal, 2 cereales, 1 verdura libre",
  "colacion_2": "Libre de calor\xEDas",
  "cena": "2 origen animal magro, 1 verdura"
}`}</textarea> <p class="text-xs text-slate-500 mt-2 ml-1">Para el MVP, puedes poner estructura JSON u raciones detalladas en texto plano.</p> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Recomendaciones Especiales y Alergias Cuidables</label> <textarea name="recommendations" rows="3" class="w-full bg-white/70 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej. Evitar lácteos enteros, consumir 3L de agua obligatorios en día de entreno..."></textarea> </div> </div> </div> <div class="flex justify-end gap-3 pt-4"> <a href="/nutrition/profiles" class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Generar y Enviar Plan al Paciente
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/nutrition/plans/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/nutrition/plans/add.astro";
const $$url = "/nutrition/plans/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
