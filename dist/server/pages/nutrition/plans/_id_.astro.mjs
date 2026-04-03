/* empty css                                     */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../../../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../../../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ESTUDIANTE])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const res = await db.execute({
    sql: `SELECT pl.*, u.firstName, u.lastName, p.patientId, p.isAthlete 
          FROM NutritionalPlans pl
          JOIN Patients p ON pl.patientId = p.patientId
          JOIN Users u ON p.patientId = u.userId
          WHERE pl.planId = ?`,
    args: [id]
  });
  if (res.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const plan = res.rows[0];
  if (user.role === ROLES.ESTUDIANTE && user.userId !== plan.patientId) {
    return Astro2.redirect("/403");
  }
  const followupsRes = await db.execute({
    sql: `SELECT followUpId, currentWeight, currentBmi, adherencePercent, followUpDate, notes 
          FROM NutritionalFollowUps 
          WHERE planId = ? ORDER BY followUpDate DESC`,
    args: [id]
  });
  const followups = followupsRes.rows;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Plan Nutricional: ${plan.firstName} ${plan.lastName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6 flex justify-between items-end"> <div> <a${addAttribute(`/nutrition/profiles/${plan.patientId}`, "href")} class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a la Evaluación Inicial
</a> <div class="flex items-center gap-4"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Plan Nutricional Activo</h1> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${plan.patientAccepted === 1 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}> ${plan.patientAccepted === 1 ? "Aceptado por Paciente" : "Pendiente de Aceptaci\xF3n"} </span> </div> <p class="text-slate-500 mt-1">Dictamen calórico y macronutrientes asignados al paciente ${plan.firstName} ${plan.lastName}</p> </div> <div class="flex gap-3"> ${user.role !== ROLES.ESTUDIANTE && renderTemplate`<a${addAttribute(`/nutrition/followups/add?planId=${plan.planId}`, "href")} class="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
Registrar Seguimiento
</a>`} </div> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2 space-y-6"> <div class="glass-card rounded-2xl p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-100/50"> <h3 class="text-xl font-bold text-slate-800 border-b border-amber-100 pb-3 mb-6 flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-amber-500" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="M2.5 12h2"></path><path d="M19.5 12h2"></path><path d="M12 20v2"></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path d="m17.7 4.9-1.4 1.4"></path><path d="m6.3 17.7-1.4 1.4"></path><path d="M12 22a9 9 0 0 0 9-9c0-4.97-4-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z"></path></svg>
Prescripción Dietética
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center"> <div class="bg-white rounded-xl p-4 border border-amber-100 shadow-sm relative overflow-hidden"> <div class="absolute inset-0 bg-amber-500/5"></div> <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Calorías Totales</p> <p class="font-bold text-amber-600 text-3xl">${plan.dailyCalories}</p> <p class="text-xs text-slate-400 mt-1 font-semibold">kcal / día</p> </div> <div class="bg-white rounded-xl p-4 border border-sky-100 shadow-sm"> <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Carbohidratos ${plan.carbohydratesPercent}%</p> <p class="font-bold text-sky-600 text-xl">${(plan.dailyCalories * plan.carbohydratesPercent / 100 / 4).toFixed(0)}g</p> </div> <div class="bg-white rounded-xl p-4 border border-rose-100 shadow-sm"> <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Proteínas ${plan.proteinsPercent}%</p> <p class="font-bold text-rose-600 text-xl">${(plan.dailyCalories * plan.proteinsPercent / 100 / 4).toFixed(0)}g</p> </div> <div class="bg-white rounded-xl p-4 border border-purple-100 shadow-sm"> <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Grasas ${plan.fatsPercent}%</p> <p class="font-bold text-purple-600 text-xl">${(plan.dailyCalories * plan.fatsPercent / 100 / 9).toFixed(0)}g</p> </div> </div> <h4 class="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Estructura del Menú (Equivalentes/Distribución)</h4> <div class="bg-white/80 p-5 rounded-xl border border-amber-100 mb-6 font-mono text-sm whitespace-pre-wrap text-slate-700 leading-relaxed shadow-inner"> ${plan.weeklyMenuJson} </div> <h4 class="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wider">Recomendaciones Especiales y Suplementación</h4> <div class="bg-white/80 p-4 rounded-xl border border-amber-100 text-slate-700 italic"> ${plan.recommendations || "Sin recomendaciones adicionales."} </div> </div> </div> <!-- Right Sidebar - History and Actions --> <div class="lg:col-span-1 space-y-6"> <div class="glass-strong rounded-2xl p-6 border border-slate-200/60 sticky top-24"> <h3 class="font-bold text-slate-800 text-lg border-b border-slate-200 pb-3 mb-5 flex items-center justify-between"> <span>Historial de Seguimientos</span> <span class="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">${followups.length} Vistas</span> </h3> <div class="space-y-4"> ${followups.length === 0 ? renderTemplate`<div class="text-center py-6 text-slate-500 text-sm">
Paciente sin consultas de seguimiento para este plan aún.
</div>` : followups.map((f) => renderTemplate`<div class="bg-white/60 border border-slate-100 rounded-xl p-4 hover:bg-white transition-colors shadow-sm"> <div class="flex justify-between items-start mb-2"> <span class="text-xs font-bold text-slate-400 font-mono">${String(f.followUpDate).split(" ")[0]}</span> <span${addAttribute(`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${f.adherencePercent >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : f.adherencePercent >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`, "class")}> ${f.adherencePercent}% Cumplimiento
</span> </div> <div class="grid grid-cols-2 gap-2 text-sm mb-3"> <div><span class="text-slate-400 text-xs block">Peso</span> <span class="font-semibold text-slate-700">${f.currentWeight}kg</span></div> <div><span class="text-slate-400 text-xs block">IMC</span> <span class="font-semibold text-slate-700">${f.currentBmi}</span></div> </div> <p class="text-xs text-slate-600 line-clamp-2 italic">${f.notes}</p> </div>`)} </div> ${user.role !== ROLES.ESTUDIANTE && renderTemplate`<div class="mt-8 pt-6 border-t border-slate-200"> <a${addAttribute(`/nutrition/discharges/add?planId=${plan.planId}`, "href")} class="w-full px-4 py-3 bg-white border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold rounded-xl transition-all flex justify-center items-center gap-2 group"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-emerald-500 transition-colors"><path d="M14 9l-5 5-2-2"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
Dar de Alta al Paciente
</a> <p class="text-xs text-center text-slate-400 mt-2">Cierra el ciclo nutricional actual o marca como abandono.</p> </div>`} </div> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/nutrition/plans/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/nutrition/plans/[id].astro";
const $$url = "/nutrition/plans/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
