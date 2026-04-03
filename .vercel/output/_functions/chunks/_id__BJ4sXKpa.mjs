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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.STAFF])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/404");
  const medRes = await db.execute({
    sql: `SELECT * FROM Medications WHERE medicationId = ?`,
    args: [id]
  });
  if (medRes.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const med = medRes.rows[0];
  let success = false;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const brandName = data.get("brandName");
    const activeIngredient = data.get("activeIngredient");
    const presentation = data.get("presentation");
    const currentStock = data.get("currentStock");
    const reorderPoint = data.get("reorderPoint");
    if (brandName && activeIngredient) {
      await db.execute({
        sql: `UPDATE Medications 
                SET brandName = ?, activeIngredient = ?, presentation = ?, currentStock = ?, reorderPoint = ?
                WHERE medicationId = ?`,
        args: [brandName, activeIngredient, presentation, currentStock, reorderPoint, id]
      });
      success = true;
      med.brandName = brandName;
      med.activeIngredient = activeIngredient;
      med.presentation = presentation;
      med.currentStock = currentStock;
      med.reorderPoint = reorderPoint;
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar: ${med.brandName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8 flex justify-between items-end border-b border-slate-200/60 pb-6"> <div> <a href="/medications" class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a Inventario
</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Editar Medicamento</h1> <p class="text-slate-500 mt-1">ID #${String(med.medicationId).padStart(4, "0")}</p> </div> </div> ${success && renderTemplate`<div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between"> <div class="flex items-center gap-2 font-medium"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
Información del producto actualizada correctamente.
</div> <a href="/medications" class="text-emerald-800 underline font-bold">Volver al Inventario</a> </div>`}<form method="POST" class="glass-card rounded-2xl p-8 max-w-2xl bg-white/40"> <div class="space-y-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nombre Comercial</label> <input type="text" name="brandName"${addAttribute(med.brandName, "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Ingrediente Activo</label> <input type="text" name="activeIngredient"${addAttribute(med.activeIngredient, "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Presentación (Ej: Tabletas 500mg, Jarabe 120ml)</label> <input type="text" name="presentation"${addAttribute(med.presentation, "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="grid grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Stock Actual (Unidades)</label> <input type="number" min="0" name="currentStock"${addAttribute(med.currentStock, "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Punto de Reorden (Alerta Mínima)</label> <input type="number" min="0" name="reorderPoint"${addAttribute(med.reorderPoint, "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"> <p class="text-[10px] text-slate-500 mt-1 ml-1 leading-tight">Si el stock cae de este número, se genera alerta.</p> </div> </div> </div> <div class="mt-8 pt-6 border-t border-slate-200/60 flex justify-end gap-3"> <a href="/medications" class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Actualizar Medicamento
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/medications/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/medications/[id].astro";
const $$url = "/medications/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
