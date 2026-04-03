/* empty css                               */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DrfESANN.mjs';
import { d as db } from '../chunks/turso_YhtWwx2k.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.STAFF, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  let query = `
  SELECT a.appointmentId as id, a.dateTime as fullDate, a.status, 
         p.patientId, u.firstName || ' ' || u.lastName as patient,
         ud.lastName as doctor
  FROM Appointments a
  JOIN Patients p ON a.patientId = p.patientId
  JOIN Users u ON p.patientId = u.userId
  JOIN Users ud ON a.doctorId = ud.userId
  WHERE date(a.dateTime) >= date('now', '-1 day')
`;
  let args = [];
  if (user.roleId === ROLES.DOCTOR) {
    query += ` AND a.doctorId = ?`;
    args.push(user.userId);
  }
  query += ` ORDER BY a.dateTime ASC LIMIT 20`;
  const aptRes = await db.execute({ sql: query, args });
  const appointments = aptRes.rows.map((r) => {
    const d = new Date(r.fullDate);
    return {
      ...r,
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      doctor: `Dr. ${r.doctor}`
    };
  });
  const statusStyles = {
    "En Progreso": "bg-sky-100 text-sky-700 border-sky-200",
    "Pendiente": "bg-amber-100 text-amber-700 border-amber-200",
    "Completada": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Cancelada": "bg-rose-100 text-rose-700 border-rose-200"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Agenda M\xE9dica" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Agenda de Citas</h1> <p class="text-slate-500 mt-1">Gestiona los horarios y consultas programadas</p> </div> <a href="/appointments/add" class="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Agendar Cita
</a> </div> <div class="glass-card rounded-2xl p-6"> <!-- Header Calendario (UI Mock) --> <div class="flex items-center justify-between mb-6 pb-6 border-b border-white/60"> <div class="flex items-center gap-4"> <button class="w-10 h-10 flex items-center justify-center bg-white/60 rounded-xl hover:bg-white border border-slate-200/60 shadow-sm transition-all text-slate-600"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg> </button> <h2 class="text-xl font-bold text-slate-800 w-48 text-center text-teal-900">Hoy, 12 de Marzo</h2> <button class="w-10 h-10 flex items-center justify-center bg-white/60 rounded-xl hover:bg-white border border-slate-200/60 shadow-sm transition-all text-slate-600"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> </button> </div> <div class="flex gap-2"> <button class="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg text-sm shadow-sm">Hoy</button> <button class="px-4 py-2 bg-white/60 text-slate-600 font-semibold rounded-lg text-sm hover:bg-white transition-colors border border-slate-200/60">Semana</button> </div> </div> <!-- Lista de Citas --> <div class="space-y-4"> ${appointments.map((app) => renderTemplate`<div class="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white/40 border border-white/60 rounded-xl hover:bg-white/70 transition-colors shadow-sm relative overflow-hidden group"> <div${addAttribute(`absolute left-0 top-0 bottom-0 w-1 ${app.status === "En Progreso" ? "bg-sky-500" : app.status === "Completada" ? "bg-emerald-500" : app.status === "Cancelada" ? "bg-rose-500" : "bg-amber-500"}`, "class")}></div> <div class="flex items-center gap-5 ml-2"> <div class="w-14 h-14 bg-teal-50 flex flex-col items-center justify-center rounded-xl border border-teal-100 shadow-sm"> <span class="text-xs font-bold text-teal-600 uppercase">Hora</span> <span class="text-lg font-bold text-teal-800 leading-tight">${app.time.split(" ")[0]}</span> </div> <div> <a${addAttribute(`/patients/${app.patientId}?tab=citas`, "href")} class="text-lg font-bold text-slate-800 hover:text-teal-700 transition-colors">${app.patient}</a> <p class="text-sm text-slate-500 flex items-center gap-2 mt-0.5"> <span class="font-medium text-slate-600">Cita Médica</span> <span>•</span> <span>${app.doctor}</span> </p> </div> </div> <div class="mt-4 md:mt-0 flex items-center gap-4 w-full md:w-auto justify-end"> <span${addAttribute(`px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${statusStyles[app.status]}`, "class")}> ${app.status} </span> <div class="flex items-center gap-2"> ${app.status === "En Progreso" && user?.roleId === ROLES.DOCTOR && renderTemplate`<a${addAttribute(`/consultations/add?appointmentId=${app.id}`, "href")} class="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-sm font-semibold transition-colors shadow-sm">
Iniciar Consulta
</a>`} <div class="relative group/menu inline-block"> <button class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-teal-600 shadow-sm transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </button> </div> </div> </div> </div>`)} </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/appointments/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/appointments/index.astro";
const $$url = "/appointments";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
