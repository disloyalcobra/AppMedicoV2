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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.STAFF, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const url = Astro2.url;
  const medIdParam = url.searchParams.get("medId");
  const medsRes = await db.execute(`
    SELECT medicationId as id, brandName, presentation 
    FROM Medications 
    ORDER BY brandName ASC
`);
  const medications = medsRes.rows;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const medId = data.get("medicationId");
    const quantity = Number(data.get("quantity"));
    const expirationDate = data.get("expirationDate");
    data.get("batchNumber");
    await db.execute({
      sql: `INSERT INTO Batches (medicationId, quantity, entryDate, expirationDate)
            VALUES (?, ?, date('now'), ?)`,
      args: [medId, quantity, expirationDate]
    });
    await db.execute({
      sql: `UPDATE Medications SET currentStock = currentStock + ? WHERE medicationId = ?`,
      args: [quantity, medId]
    });
    return Astro2.redirect("/medications");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Entrada de Lote" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/medications" class="hover:text-teal-600 transition-colors">Inventario</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Recepción</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registrar Lote de Ingreso</h1> </div> <div class="max-w-3xl"> <form method="POST" class="glass-card rounded-2xl p-6 space-y-6"> <div> <label for="medicationId" class="block text-sm font-semibold text-slate-700 mb-1.5">Producto (Medicamento)</label> <select name="medicationId" id="medicationId" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-sans"> <option value="">Selecciona qué producto ha llegado...</option> ${medications.map((m) => renderTemplate`<option${addAttribute(String(m.id), "value")}${addAttribute(String(m.id) === medIdParam, "selected")}> ${m.brandName} - ${m.presentation} </option>`)} </select> <p class="text-xs text-slate-500 mt-2">¿No encuentras el medicamento? <a href="/medications/add" class="text-teal-600 font-bold hover:underline">Regístralo primero aquí.</a></p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> <div> <label for="quantity" class="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad (Piezas/Cajas)</label> <input type="number" min="1" name="quantity" id="quantity" required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-emerald-800" placeholder="Ej. 50"> </div> <div> <label for="expirationDate" class="block text-sm font-semibold text-slate-700 mb-1.5">Fecha de Caducidad</label> <input type="date" name="expirationDate" id="expirationDate" required class="w-full bg-rose-50/50 border border-rose-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"> </div> </div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-8"> <a href="/medications" class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>
Registrar Ingreso al Stock
</button> </div> </form> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/batches/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/batches/add.astro";
const $$url = "/batches/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
