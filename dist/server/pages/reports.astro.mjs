/* empty css                               */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DrfESANN.mjs';
import { c as checkRole, R as ROLES } from '../chunks/checkRole_wmyz_iGO.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const injuriesData = [
    { sport: "F\xFAtbol", count: 12, color: "bg-emerald-500" },
    { sport: "B\xE1squetbol", count: 8, color: "bg-amber-500" },
    { sport: "B\xE9isbol", count: 5, color: "bg-rose-500" },
    { sport: "Tenis", count: 3, color: "bg-sky-500" }
  ];
  const maxInjuries = Math.max(...injuriesData.map((d) => d.count));
  const weeklyAppointments = [
    { day: "Lun", value: 45 },
    { day: "Mar", value: 52 },
    { day: "Mi\xE9", value: 38 },
    { day: "Jue", value: 65 },
    { day: "Vie", value: 48 }
  ];
  const maxApt = Math.max(...weeklyAppointments.map((d) => d.value));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reportes y Estad\xEDsticas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Reportes del Sistema</h1> <p class="text-slate-500 mt-1">Estadísticas globales de clínicas, lesiones e inventario</p> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"> <!-- Gráfica de Barras Horizontales: Lesiones por Deporte --> <div class="glass-card rounded-2xl p-6"> <h3 class="text-xl font-bold text-slate-800 mb-6">Lesiones por Deporte</h3> <div class="space-y-5"> ${injuriesData.map((item) => renderTemplate`<div> <div class="flex justify-between text-sm font-semibold mb-1.5"> <span class="text-slate-700">${item.sport}</span> <span class="text-slate-500">${item.count} reportes</span> </div> <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner"> <div${addAttribute(`${item.color} h-3 rounded-full animate-fade-in`, "class")}${addAttribute(`width: ${item.count / maxInjuries * 100}%`, "style")}></div> </div> </div>`)} </div> <div class="mt-6 pt-4 border-t border-slate-100 min-w-full"> <a href="/injuries" class="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center justify-center gap-2">
Ver listado detallado
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </a> </div> </div> <!-- Gráfica de Barras Verticales: Citas de la Semana --> <div class="glass-card rounded-2xl p-6 flex flex-col"> <h3 class="text-xl font-bold text-slate-800 mb-6">Tráfico de Consultas Semanal</h3> <div class="flex-1 flex items-end justify-between gap-2 h-48 mt-4"> ${weeklyAppointments.map((item) => renderTemplate`<div class="flex flex-col items-center flex-1 group"> <div class="w-full flex justify-center"> <div class="w-full max-w-[3rem] bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-lg shadow group-hover:from-teal-400 group-hover:to-emerald-300 transition-colors relative"${addAttribute(`height: ${item.value / maxApt * 160}px`, "style")}> <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"> ${item.value} </div> </div> </div> <span class="text-xs font-semibold text-slate-500 mt-3 uppercase tracking-wider">${item.day}</span> </div>`)} </div> </div> </div>  <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500"> <h4 class="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Stock Crítico</h4> <p class="text-3xl font-bold text-slate-800 mb-2">12</p> <p class="text-sm text-slate-500">Medicamentos por debajo del nivel de reordenamiento.</p> </div> <div class="glass-card rounded-2xl p-6 border-l-4 border-l-sky-500"> <h4 class="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Tiempo Promedio Espera</h4> <p class="text-3xl font-bold text-slate-800 mb-2">14 <span class="text-lg">min</span></p> <p class="text-sm text-slate-500">Promedio general en salas de espera.</p> </div> <div class="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500"> <h4 class="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Altas Nutricionales</h4> <p class="text-3xl font-bold text-slate-800 mb-2">24</p> <p class="text-sm text-slate-500">Estudiantes que lograron su meta este semestre.</p> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/reports/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/reports/index.astro";
const $$url = "/reports";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
