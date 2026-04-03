/* empty css                                  */
import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate, h as createAstro, u as unescapeHTML, k as renderComponent } from '../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DrfESANN.mjs';
import 'clsx';
import { c as checkRole, R as ROLES } from '../../chunks/checkRole_wmyz_iGO.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$PatientHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PatientHeader;
  const { patient } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden"> <!-- Status Stripe --> <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-400 to-sky-500"></div> <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"> <div class="flex items-center gap-5"> <div${addAttribute(`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md border-2 ${patient.isAthlete === 1 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-teal-50 text-teal-700 border-teal-200"}`, "class")}> ${patient.firstName[0]}${patient.lastName[0]} </div> <div> <div class="flex items-center gap-3 mb-1"> <h2 class="text-2xl font-bold text-slate-800 tracking-tight">${patient.firstName} ${patient.lastName}</h2> ${patient.isAthlete === 1 && renderTemplate`<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-widest flex items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path></svg>
Atleta
</span>`} </div> <p class="text-slate-500 font-medium">Expediente #${patient.id.toString().padStart(4, "0")} • ${patient.age} años</p> </div> </div> <div class="flex gap-4"> <button class="px-4 py-2 border border-slate-200/60 rounded-xl bg-white/50 text-slate-600 hover:bg-slate-50/80 hover:text-teal-600 transition-colors flex items-center gap-2 text-sm font-medium"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
Editar Perfil
</button> <button class="px-4 py-2 border border-slate-200/60 rounded-xl bg-white/50 text-slate-600 hover:bg-slate-50/80 hover:text-teal-600 transition-colors flex items-center gap-2 text-sm font-medium"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
Agregar Alerta
</button> </div> </div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200/60"> <div> <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tipo de Sangre</p> <p class="font-semibold text-slate-800 flex items-center gap-1.5"> <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ${patient.bloodType} </p> </div> <div> <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Estatura / Peso</p> <p class="font-semibold text-slate-800">${patient.height} cm / ${patient.weight} kg</p> </div> <div> <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Alergias</p> <p${addAttribute(`font-semibold ${patient.allergies ? "text-rose-600" : "text-slate-800"}`, "class")}> ${patient.allergies || "Ninguna conocida"} </p> </div> <div> <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Género / Escolaridad</p> <p class="font-semibold text-slate-800">${patient.gender === "M" ? "Masculino" : patient.gender === "F" ? "Femenino" : "Otro"} • ${patient.schoolLevel || "N/A"}</p> </div> </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Patient/PatientHeader.astro", void 0);

const $$Astro$1 = createAstro();
const $$PatientTabs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PatientTabs;
  const { patientId, activeTab } = Astro2.props;
  const tabs = [
    { id: "citas", label: "Citas", icon: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>' },
    { id: "consultas", label: "Expediente", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>' },
    { id: "recetas", label: "Recetas", icon: '<path d="M10.5 20.5 7 17l3.5-3.5"/><path d="M14 17H7"/><path d="m13.5 3.5 3.5 3.5-3.5 3.5"/><path d="M10 7h7"/><path d="M7 21V3"/><path d="M17 21V3"/>' },
    // Pills approximation
    { id: "lesiones", label: "Lesiones", icon: '<path d="M12 2v20"/><path d="m14.5 4-5 5"/><path d="m14.5 9.5-5 5"/><path d="m14.5 15-5 5"/>' }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-wrap gap-2 mb-6"> ${tabs.map((tab) => renderTemplate`<a${addAttribute(`/patients/${patientId}?tab=${tab.id}`, "href")}${addAttribute(`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-teal-600 text-white shadow-md" : "bg-white/50 border border-slate-200/60 text-slate-600 hover:bg-slate-50/80 hover:text-teal-700"}`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(tab.icon)}</svg> ${tab.label} </a>`)} </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Patient/PatientTabs.astro", void 0);

const $$Astro = createAstro();
const $$patientId = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$patientId;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const { patientId } = Astro2.params;
  const activeTab = Astro2.url.searchParams.get("tab") || "citas";
  const mockPatient = {
    id: Number(patientId),
    firstName: "Juan",
    lastName: "P\xE9rez",
    age: 21,
    bloodType: "O+",
    allergies: "Ninguna",
    weight: 72.5,
    height: 178,
    isAthlete: 1,
    sport: "Futbol"
  };
  const mockItems = {
    citas: [
      { id: 1, date: "15/03/2026", time: "10:00 AM", doctor: "Dra. Silva", status: "Completada" },
      { id: 2, date: "22/04/2026", time: "11:30 AM", doctor: "Dr. G\xF3mez", status: "Pendiente" }
    ],
    lesiones: [
      { id: 1, date: "10/02/2026", type: "Esguince", zone: "Tobillo derecho", status: "Recuperada", severity: "Leve" }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Expediente: ${mockPatient.firstName}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/patients" class="hover:text-teal-600 transition-colors">Pacientes</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Expediente ${mockPatient.id.toString().padStart(4, "0")}</span> </div> </div> ${renderComponent($$result2, "PatientHeader", $$PatientHeader, { "patient": mockPatient })} ${renderComponent($$result2, "PatientTabs", $$PatientTabs, { "patientId": patientId, "activeTab": activeTab })}  <div class="glass-card rounded-2xl p-6"> <div class="flex justify-between items-center mb-6"> <h3 class="text-xl font-bold text-slate-800 capitalize">${activeTab}</h3> ${user?.roleId === ROLES.DOCTOR && renderTemplate`<a${addAttribute(`/${activeTab}/add?patientId=${patientId}`, "href")} class="bg-teal-50 text-teal-700 font-semibold py-2 px-4 rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-2 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Nuevo Registro
</a>`} </div> ${activeTab === "citas" && renderTemplate`<div class="space-y-3"> ${mockItems.citas.map((c) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/50 border border-slate-200/60 rounded-xl hover:bg-white/80 transition-colors"> <div class="flex items-center gap-4"> <div class="w-12 h-12 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center shadow-sm border border-sky-100"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg> </div> <div> <p class="font-bold text-slate-800">${c.date} • ${c.time}</p> <p class="text-sm text-slate-500">Con ${c.doctor}</p> </div> </div> <div class="flex items-center gap-4"> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "Completada" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`, "class")}> ${c.status} </span> <button class="text-teal-600 hover:text-teal-800 text-sm font-semibold">Gestionar &rarr;</button> </div> </div>`)} </div>`} ${activeTab === "lesiones" && renderTemplate`<div class="space-y-3"> ${mockItems.lesiones.map((l) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/50 border border-slate-200/60 rounded-xl hover:bg-white/80 transition-colors"> <div class="flex items-center gap-4"> <div${addAttribute(`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${l.severity === "Leve" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"}`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path></svg> </div> <div> <p class="font-bold text-slate-800">${l.type} - ${l.zone}</p> <p class="text-sm text-slate-500">${l.date}</p> </div> </div> <div class="flex items-center gap-4"> <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"> ${l.status} </span> <button class="text-teal-600 hover:text-teal-800 text-sm font-semibold">Detalles &rarr;</button> </div> </div>`)} ${mockItems.lesiones.length === 0 && renderTemplate`<p class="text-slate-500 text-center py-6">No hay lesiones registradas.</p>`} </div>`}  ${activeTab !== "citas" && activeTab !== "lesiones" && renderTemplate`<div class="text-center py-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white/30"> <p>Listado de ${activeTab} para el paciente</p> </div>`} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/patients/[patientId].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/patients/[patientId].astro";
const $$url = "/patients/[patientId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$patientId,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
