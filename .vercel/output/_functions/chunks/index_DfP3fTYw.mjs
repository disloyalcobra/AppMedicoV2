/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const notes = [
    { id: 1, patient: "Juan Pérez", author: "Dra. Silva (Nutrición)", content: "Paciente con baja ingesta proteica pre-partido. Reportado al entrenador.", isAlert: true, date: "11/03/2026", tags: ["nutrición", "rendimiento"] },
    { id: 2, patient: "María Lozano", author: "Dr. Gómez (General)", content: "Presenta leve reacción alérgica en brazo. En observación.", isAlert: true, date: "10/03/2026", tags: ["alergia"] },
    { id: 3, patient: "Carlos Ruiz", author: "Entrenador Luis", content: "Carga de entrenamiento reducida al 50% por molestia en hombro.", isAlert: false, date: "08/03/2026", tags: ["lesión prevenible"] }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Notas y Alertas Clínicas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Centro de Alertas</h1> <p class="text-slate-500 mt-1">Comunicación interdisciplinaria sobre expedientes</p> </div> </div> <div class="space-y-4"> ${notes.map((note) => renderTemplate`<div${addAttribute(`glass-card rounded-2xl p-6 relative overflow-hidden group border ${note.isAlert ? "border-rose-200/60" : "border-white/60"}`, "class")}> ${note.isAlert && renderTemplate`<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-400 to-rose-600"></div>`} <div class="flex items-start justify-between mb-3"> <div class="flex items-center gap-3"> <h3 class="text-lg font-bold text-slate-800">${note.patient}</h3> ${note.isAlert && renderTemplate`<span class="flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-bold px-2 py-0.5 rounded border border-rose-200 uppercase tracking-widest"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
Alerta Importante
</span>`} </div> <p class="text-sm font-semibold text-slate-400">${note.date}</p> </div> <div class="bg-white/40 p-4 rounded-xl border border-white/60 mb-4"> <p class="text-slate-700 font-medium leading-relaxed">${note.content}</p> </div> <div class="flex items-center justify-between"> <div class="flex gap-2"> ${note.tags.map((tag) => renderTemplate`<span class="text-xs bg-slate-100/80 text-slate-600 font-semibold px-2 py-1 rounded-md border border-slate-200/60">#${tag}</span>`)} </div> <p class="text-sm font-semibold text-teal-700">✍️ ${note.author}</p> </div> </div>`)} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/notes/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/notes/index.astro";
const $$url = "/notes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
