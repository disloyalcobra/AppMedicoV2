/* empty css                               */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../chunks/checkRole_wmyz_iGO.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.STAFF, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const medsRes = await db.execute(`
  SELECT medicationId as id, brandName as name, activeIngredient, 
         presentation, currentStock as stock, reorderPoint as minStock
  FROM Medications
  ORDER BY currentStock ASC
`);
  const medications = medsRes.rows.map((m) => ({
    ...m,
    critical: m.stock <= m.minStock
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Inventario Cl\xEDnico" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Inventario de Medicamentos</h1> <p class="text-slate-500 mt-1">Control de existencias y alertas de reabastecimiento</p> </div> <div class="flex gap-3"> <a href="/batches/add" class="bg-white border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>
Entrada Lote
</a> <a href="/medications/add" class="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Nuevo Producto
</a> </div> </div> <div class="glass-card rounded-2xl overflow-hidden border border-white/60"> <!-- Filters / Search --> <div class="p-4 border-b border-slate-200/60 flex items-center gap-4 bg-white/30"> <div class="relative flex-1 max-w-md"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-2.5 text-slate-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <input type="text" placeholder="Buscar medicamento o ingrediente activo..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"> </div> <label class="flex items-center gap-2 text-sm text-slate-600 font-semibold cursor-pointer"> <input type="checkbox" class="rounded text-teal-600 focus:ring-teal-500 border-slate-300">
Ver solo stock crítico
</label> </div> <!-- Table --> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50/50 border-b border-slate-200/60"> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold w-16 text-center">ID</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Medicamento y Presentación</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold">Ingrediente Activo</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center">Stock Actual</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-center">Alerta (Mín)</th> <th class="p-4 text-xs tracking-widest text-slate-500 uppercase font-bold text-right">Acciones</th> </tr> </thead> <tbody class="divide-y divide-slate-100/60"> ${medications.map((med) => renderTemplate`<tr${addAttribute(`hover:bg-white/40 transition-colors ${med.critical ? "bg-rose-50/30" : ""}`, "class")}> <td class="p-4 text-center"> <span class="text-slate-400 font-bold text-sm">#${med.id}</span> </td> <td class="p-4"> <div class="flex items-center gap-3"> <div${addAttribute(`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${med.critical ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-white text-teal-600 border-slate-200"}`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 7 17l3.5-3.5"></path><path d="M14 17H7"></path><path d="m13.5 3.5 3.5 3.5-3.5 3.5"></path><path d="M10 7h7"></path><path d="M7 21V3"></path><path d="M17 21V3"></path></svg> </div> <div> <p class="font-bold text-slate-800">${med.name}</p> <p class="text-xs text-slate-500">${med.presentation}</p> </div> </div> </td> <td class="p-4"> <span class="text-slate-600 font-medium">${med.activeIngredient}</span> </td> <td class="p-4 text-center"> <span${addAttribute(`text-lg font-bold px-3 py-1 rounded-full border shadow-sm ${med.critical ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`, "class")}> ${med.stock} </span> </td> <td class="p-4 text-center"> <span class="text-slate-500 font-semibold">${med.minStock}</span> </td> <td class="p-4 text-right"> <div class="flex items-center justify-end gap-2"> <a${addAttribute(`/batches/add?medId=${med.id}`, "href")} class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm text-xs font-bold" title="Ingresar Lote">
+ Lote
</a> <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm" title="Editar"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg> </button> </div> </td> </tr>`)} </tbody> </table> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/medications/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/medications/index.astro";
const $$url = "/medications";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
