/* empty css                                  */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../../chunks/checkRole_wmyz_iGO.mjs';
import { d as db } from '../../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO])) {
    return Astro2.redirect("/403");
  }
  const profilesRes = await db.execute(`
  SELECT 
    p.patientId, 
    u.firstName, 
    u.lastName, 
    p.isAthlete,
    p.sport,
    np.profileId, 
    np.nutritionalDiagnosis,
    np.metabolicRisk,
    np.bodyFatPercentage,
    np.createdAt as date,
    (SELECT currentBmi FROM NutritionalFollowUps WHERE planId = (SELECT planId from NutritionalPlans WHERE patientId = p.patientId ORDER BY creationDate DESC LIMIT 1) ORDER BY followUpDate DESC LIMIT 1) as latestBmi,
    (SELECT planId FROM NutritionalPlans WHERE patientId = p.patientId ORDER BY creationDate DESC LIMIT 1) as planId
  FROM Patients p
  JOIN Users u ON p.patientId = u.userId
  LEFT JOIN NutritionalProfiles np ON p.patientId = np.patientId
  ORDER BY np.createdAt DESC NULLS LAST
`);
  const patients = profilesRes.rows;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Perfiles Nutricionales" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Evaluaciones Nutricionales</h1> <p class="text-slate-500 mt-1">Gestión de perfiles clínicos y planes alimenticios</p> </div> <a href="/patients" class="bg-white border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
Ver Directorio de Pacientes
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${patients.length === 0 ? renderTemplate`<div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-slate-500">
No hay pacientes registrados en el sistema.
</div>` : patients.map((p) => renderTemplate`<a${addAttribute(p.profileId ? `/nutrition/profiles/${p.profileId}` : `/nutrition/profiles/add?patientId=${p.patientId}`, "href")} class="block group"> <div class="glass-card rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl relative overflow-hidden border border-white/80 h-full flex flex-col"> ${p.isAthlete === 1 && renderTemplate`<div class="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200 uppercase tracking-widest flex items-center gap-1"> ${p.sport || "Atleta"} </div>`} <div class="flex items-center gap-4 mb-5"> <div${addAttribute(`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm border ${p.profileId ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`, "class")}> ${String(p.firstName)[0]}${String(p.lastName)[0]} </div> <div class="pr-10"> <h3 class="text-lg font-bold text-slate-800 leading-tight truncate">${p.firstName} ${p.lastName}</h3> <p class="text-xs text-slate-500 font-medium mt-0.5">Exp. #${String(p.patientId).padStart(4, "0")}</p> </div> </div> <div class="flex-1"> ${p.profileId ? renderTemplate`<div> <div class="bg-white/40 rounded-xl p-3 mb-4 border border-white/60"> <div class="flex justify-between items-center mb-1"> <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Diagnóstico Actual</p> <span${addAttribute(`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${p.metabolicRisk === "Alto" ? "bg-rose-50 text-rose-700 border-rose-200" : p.metabolicRisk === "Moderado" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`, "class")}>
Riesgo ${p.metabolicRisk} </span> </div> <p class="font-semibold text-sm text-slate-700 truncate">${p.nutritionalDiagnosis || "Pendiente"}</p> </div> <div class="grid grid-cols-2 gap-4 text-sm mb-5"> <div> <p class="text-slate-400 text-xs font-semibold">IMC Actual</p> <p class="font-bold text-slate-800 text-lg">${p.latestBmi || "--"}</p> </div> <div> <p class="text-slate-400 text-xs font-semibold">% Grasa Corporal</p> <p class="font-bold text-slate-800 text-lg">${p.bodyFatPercentage ? p.bodyFatPercentage + "%" : "--"}</p> </div> </div> </div>` : renderTemplate`<div class="py-6 flex flex-col items-center justify-center text-center h-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"> <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> </div> <p class="text-sm text-slate-600 font-semibold mb-1">Sin evaluación inicial</p> <p class="text-xs text-slate-400 mb-3 px-4">El paciente no tiene un perfil nutricional registrado.</p> <span class="inline-block px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm group-hover:bg-teal-500 transition-colors">
Crear Evaluación
</span> </div>`} </div> ${p.profileId && renderTemplate`<div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto"> <span class="text-xs text-slate-400 font-medium font-mono border bg-slate-50 px-2 py-1 rounded"> ${p.date ? String(p.date).split(" ")[0] : "Sin Fecha"} </span> ${p.planId ? renderTemplate`<span class="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
Ver Plan <span aria-hidden="true">&rarr;</span> </span>` : renderTemplate`<span class="text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition-colors flex items-center gap-1">
Crear Plan <span aria-hidden="true">&rarr;</span> </span>`} </div>`} </div> </a>`)} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/nutrition/profiles/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/nutrition/profiles/index.astro";
const $$url = "/nutrition/profiles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
