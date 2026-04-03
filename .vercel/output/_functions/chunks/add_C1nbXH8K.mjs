/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { B as maybeRenderHead, Q as renderTemplate } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import 'clsx';
import { d as db } from './turso_BY-aYcMZ.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';

const $$MedicationForm = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<form method="POST" class="glass-card rounded-2xl p-6 space-y-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> <div> <label for="brandName" class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Comercial (Marca)</label> <input type="text" name="brandName" id="brandName" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required placeholder="Ej. Tylenol 500mg"> </div> <div> <label for="activeIngredient" class="block text-sm font-semibold text-slate-700 mb-1.5">Ingrediente Activo</label> <input type="text" name="activeIngredient" id="activeIngredient" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required placeholder="Ej. Paracetamol"> </div> <div> <label for="presentation" class="block text-sm font-semibold text-slate-700 mb-1.5">Presentación</label> <select name="presentation" id="presentation" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required> <option value="">Seleccionar...</option> <option value="Tabletas">Tabletas</option> <option value="Cápsulas">Cápsulas</option> <option value="Jarabe">Jarabe</option> <option value="Suspensión">Suspensión</option> <option value="Pomada">Pomada / Gel</option> <option value="Inyectable">Inyectable</option> <option value="Gotas">Gotas</option> <option value="Supositorios">Supositorios</option> </select> </div> <div> <label for="reorderPoint" class="block text-sm font-semibold text-slate-700 mb-1.5">Punto de Reorden (Alerta Mínima) <span class="text-xs text-rose-500 ml-1 font-bold">importante</span></label> <input type="number" name="reorderPoint" id="reorderPoint" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" min="0" required placeholder="Ej. 20"> <p class="text-xs text-slate-500 mt-1">El sistema alertará cuando el stock sea menor a este número.</p> </div> </div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-200/60"> <a href="/medications" class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Medicamento
</button> </div> </form>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Medication/MedicationForm.astro", void 0);

const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.STAFF, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    await db.execute({
      sql: `INSERT INTO Medications (brandName, activeIngredient, presentation, currentStock, minimumStock)
          VALUES (?, ?, ?, 0, ?)`,
      args: [
        data.get("brandName"),
        data.get("activeIngredient"),
        data.get("presentation"),
        data.get("reorderPoint")
      ]
    });
    return Astro2.redirect("/medications");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nuevo Medicamento" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/medications" class="hover:text-teal-600 transition-colors">Inventario</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Añadir Producto</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registrar Nuevo Medicamento</h1> </div> <div class="max-w-3xl"> <div class="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl text-sm mb-6 flex gap-3 shadow-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg> <div> <p class="font-bold">Aviso sobre el Stock:</p> <p class="mt-0.5 text-teal-700/80">Al crear un medicamento el stock inicial es 0. Para añadir existencias debes registrar un nuevo Lote en la opción de Entrada.</p> </div> </div> ${renderComponent($$result2, "MedicationForm", $$MedicationForm, {})} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/medications/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/medications/add.astro";
const $$url = "/medications/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
