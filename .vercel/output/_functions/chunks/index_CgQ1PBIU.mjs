/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute, b7 as unescapeHTML } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import 'clsx';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$StatsCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StatsCard;
  const { title, value, icon, trendLabel, colorClass = "from-teal-500 to-emerald-500", href } = Astro2.props;
  const Tag = href ? "a" : "div";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class": "block glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex items-center justify-between"> <div${addAttribute(`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-md`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white">${unescapeHTML(icon)}</svg> </div> ${trendLabel && renderTemplate`<div class="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg> <span>${trendLabel}</span> </div>`} </div> <div class="mt-4"> <h3 class="text-3xl font-bold text-slate-800 tracking-tight">${value}</h3> <p class="text-sm font-medium text-slate-500 mt-1">${title}</p> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/StatsCard.astro", void 0);

const $$AlertBanner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AlertBanner;
  const { alerts } = Astro2.props;
  const ICONS = {
    stock: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    injury: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    note: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  };
  const COLORS = {
    stock: "bg-amber-50 border-amber-200 text-amber-800",
    injury: "bg-rose-50 border-rose-200 text-rose-800",
    note: "bg-sky-50 border-sky-200 text-sky-800"
  };
  return renderTemplate`${alerts.length > 0 && renderTemplate`${maybeRenderHead()}<div class="mb-8 space-y-3">${alerts.map((alert) => renderTemplate`<div${addAttribute(`flex items-start gap-3 p-4 rounded-xl border ${COLORS[alert.type]} shadow-sm`, "class")}><div class="mt-0.5 shrink-0 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS[alert.type])}</svg></div><div class="flex-1"><p class="text-sm font-medium">${alert.message}</p></div>${alert.link && renderTemplate`<a${addAttribute(alert.link, "href")} class="text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">
Ver detalle
</a>`}</div>`)}</div>`}`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/AlertBanner.astro", void 0);

const $$AdminDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminDashboard;
  const { user } = Astro2.props;
  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  };
  const patRes = await db.execute(`SELECT COUNT(*) as total FROM Patients`);
  const totalPatients = Number(patRes.rows[0].total);
  const aptsRes = await db.execute(`
    SELECT 
        SUM(CASE WHEN date(dateTime) = date('now') THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN date(dateTime) >= date('now', '-7 days') THEN 1 ELSE 0 END) as week
    FROM Appointments
`);
  const aptsToday = Number(aptsRes.rows[0].today || 0);
  const aptsWeek = Number(aptsRes.rows[0].week || 0);
  const alertsRes = await db.execute(`
    SELECT
      (SELECT COUNT(*) FROM Injuries WHERE status = 'Activa') +
      (SELECT COUNT(*) FROM Medications WHERE currentStock <= reorderPoint) +
      (SELECT COUNT(*) FROM CollaborativeNotes WHERE isAlert = 1 AND date(createdAt) >= date('now', '-3 days')) as total
`);
  const activeAlerts = Number(alertsRes.rows[0].total);
  await db.execute(`SELECT COUNT(*) as total FROM Users WHERE roleId = 3`);
  const stats = [
    { title: "Pacientes Totales", value: totalPatients, icon: ICONS.users, trend: "Global", color: "from-amber-500 to-orange-500", href: "/patients" },
    { title: "Citas Hoy", value: aptsToday, icon: ICONS.calendar, color: "from-sky-500 to-indigo-500", href: "/appointments" },
    { title: "Citas Semanales", value: aptsWeek, icon: ICONS.activity, color: "from-emerald-500 to-teal-500", href: "/appointments" },
    { title: "Alertas Activas", value: activeAlerts, icon: ICONS.alert, color: "from-rose-500 to-pink-500", href: "/injuries" }
  ];
  let alerts = [];
  if (activeAlerts > 0) {
    alerts.push({ type: "stock", message: `Sistema reporta ${activeAlerts} alertas globales prioritarias activas hoy.`, link: "/injuries" });
  }
  const mockRes = await db.execute(`
  SELECT a.appointmentId as id, a.dateTime, a.status,
         u.firstName || ' ' || u.lastName as patient,
         ud.lastName as doctor
  FROM Appointments a
  JOIN Patients p ON a.patientId = p.patientId
  JOIN Users u ON p.patientId = u.userId
  JOIN Users ud ON a.doctorId = ud.userId
  ORDER BY a.dateTime DESC LIMIT 4
`);
  const mockAppointments = mockRes.rows.map((r) => ({
    id: r.id,
    time: new Date(r.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
    doctor: `Dr. ${r.doctor}`,
    patient: r.patient,
    status: r.status
  }));
  return renderTemplate`${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Panel Administrativo Global</h1> <p class="text-slate-500 mt-1 text-lg">Visión general del sistema para ${user?.roleId === 1 ? "Administrador" : "Jefatura Médica"}</p> </div> ${renderComponent($$result, "AlertBanner", $$AlertBanner, { "alerts": alerts })} <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"> ${stats.map((stat) => renderTemplate`${renderComponent($$result, "StatsCard", $$StatsCard, { "title": stat.title, "value": stat.value, "icon": stat.icon, "trendLabel": stat.trend, "colorClass": stat.color, "href": stat.href })}`)} </div> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-slate-800">Citas Recientes (Global)</h3> <a href="/appointments" class="text-sm font-semibold text-teal-600 hover:text-teal-700">Ver agenda global →</a> </div> <div class="space-y-4"> ${mockAppointments.map((app) => renderTemplate`<a${addAttribute(`/appointments/${app.id}`, "href")} class="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors block group"> <div class="flex items-center gap-4"> <div class="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-teal-100 group-hover:scale-105 transition-transform"> ${app.time.split(" ")[0]} </div> <div> <h4 class="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">${app.patient}</h4> <p class="text-xs text-slate-500">${app.doctor} • Cita Médica</p> </div> </div> <div> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-semibold border ${app.status === "En Progreso" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}> ${app.status} </span> </div> </a>`)} </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/AdminDashboard.astro", void 0);

const $$DoctorDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DoctorDashboard;
  const { user } = Astro2.props;
  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
  };
  const patRes = await db.execute(`SELECT COUNT(*) as total FROM Patients`);
  const totalPatients = Number(patRes.rows[0].total);
  const aptsFiltered = await db.execute({
    sql: `SELECT
    SUM(CASE WHEN date(dateTime) = date('now') THEN 1 ELSE 0 END) as today,
    SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) as pending
  FROM Appointments WHERE doctorId = ?`,
    args: [user?.userId]
  });
  const aptsToday = Number(aptsFiltered.rows[0]?.today || 0);
  const consFiltered = await db.execute({
    sql: `SELECT COUNT(*) as total FROM Consultations c
        JOIN Appointments a ON c.appointmentId = a.appointmentId
        WHERE a.doctorId = ?`,
    args: [user?.userId]
  });
  const totalConsultations = Number(consFiltered.rows[0]?.total || 0);
  const todayAptsRes = await db.execute({
    sql: `SELECT a.appointmentId as id, a.dateTime, a.status,
               u.firstName || ' ' || u.lastName as patient
        FROM Appointments a
        JOIN Patients p ON a.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        WHERE a.doctorId = ? AND date(a.dateTime) = date('now')
        ORDER BY a.dateTime ASC LIMIT 5`,
    args: [user?.userId]
  });
  const todayApts = todayAptsRes.rows;
  return renderTemplate`${maybeRenderHead()}<div class="mb-8 flex justify-between items-end"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Bienvenido, Dr. ${user?.firstName}</h1> <p class="text-slate-500 mt-1">Resumen clínico del día — ${(/* @__PURE__ */ new Date()).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p> </div> <a href="/patients" class="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
Ver Expedientes
</a> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Pacientes en Sistema", "value": totalPatients, "icon": ICONS.users, "colorClass": "from-sky-500 to-indigo-500", "href": "/patients" })} ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Citas Hoy", "value": aptsToday, "icon": ICONS.calendar, "colorClass": "from-emerald-500 to-teal-500", "href": "/appointments" })} ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Consultas Realizadas", "value": totalConsultations, "icon": ICONS.activity, "colorClass": "from-amber-500 to-orange-500", "href": "/consultations" })} </div> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-slate-800">Citas del Día</h3> <a href="/appointments" class="text-sm font-semibold text-teal-600 hover:text-teal-700">Ver agenda completa →</a> </div> <div class="space-y-4"> ${todayApts.length === 0 ? renderTemplate`<div class="text-center py-10 text-slate-500"> <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-slate-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg> <p class="font-medium">No tienes citas programadas para hoy.</p> <a href="/appointments/add" class="text-sm text-teal-600 hover:underline font-bold mt-1 inline-block">+ Agendar nueva cita</a> </div>` : todayApts.map((app) => renderTemplate`<a${addAttribute(`/appointments/${app.id}`, "href")} class="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors group"> <div class="flex items-center gap-4"> <div class="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-teal-100"> ${String(app.dateTime).split("T")[1]?.slice(0, 5) || "--:--"} </div> <div> <h4 class="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">${app.patient}</h4> <p class="text-xs text-slate-500">Cita Médica</p> </div> </div> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-semibold border ${app.status === "Completada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : app.status === "Cancelada" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}> ${app.status} </span> </a>`)} </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/DoctorDashboard.astro", void 0);

const $$NutritionistDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$NutritionistDashboard;
  const { user } = Astro2.props;
  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    plans: '<path d="M12 22a9 9 0 0 0 9-9c0-4.97-4-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>'};
  const patRes = await db.execute(`SELECT COUNT(DISTINCT patientId) as total FROM NutritionalProfiles`);
  const totalPatients = Number(patRes.rows[0].total);
  const plansRes = await db.execute({
    sql: `SELECT COUNT(*) as total FROM NutritionalPlans WHERE nutritionistId = ?`,
    args: [user?.userId]
  });
  const totalPlans = Number(plansRes.rows[0].total);
  const aptsRes = await db.execute({
    sql: `SELECT COUNT(*) as total FROM Appointments WHERE doctorId = ? AND date(dateTime) = date('now')`,
    args: [user?.userId]
  });
  const aptsToday = Number(aptsRes.rows[0].total);
  const todayAptsRes = await db.execute({
    sql: `SELECT a.appointmentId as id, a.dateTime, a.status,
               u.firstName || ' ' || u.lastName as patient
        FROM Appointments a
        JOIN Patients p ON a.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        WHERE a.doctorId = ? AND date(a.dateTime) = date('now')
        ORDER BY a.dateTime ASC LIMIT 5`,
    args: [user?.userId]
  });
  const todayApts = todayAptsRes.rows;
  const pendingRes = await db.execute({
    sql: `SELECT np.planId, u.firstName || ' ' || u.lastName as patient, np.caloricRequirement
        FROM NutritionalPlans np
        JOIN Patients p ON np.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        WHERE np.nutritionistId = ? AND np.patientAccepted = 0
        LIMIT 5`,
    args: [user?.userId]
  });
  const pendingPlans = pendingRes.rows;
  return renderTemplate`${maybeRenderHead()}<div class="mb-8 flex justify-between items-end"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Panel Nutricional</h1> <p class="text-slate-500 mt-1">Hola, ${user?.firstName} — ${(/* @__PURE__ */ new Date()).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p> </div> <a href="/nutrition/profiles" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
Ver Perfiles
</a> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Pacientes en Control", "value": totalPatients, "icon": ICONS.users, "colorClass": "from-emerald-500 to-teal-500", "href": "/nutrition/profiles" })} ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Planes Creados", "value": totalPlans, "icon": ICONS.plans, "colorClass": "from-amber-500 to-orange-500", "href": "/nutrition/profiles" })} ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Citas Hoy", "value": aptsToday, "icon": ICONS.calendar, "colorClass": "from-sky-500 to-indigo-500", "href": "/appointments" })} </div> <div class="grid grid-cols-1 xl:grid-cols-2 gap-8"> <!-- Citas del día --> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5"> <h3 class="text-xl font-bold text-slate-800">Citas del Día</h3> <a href="/appointments" class="text-sm font-semibold text-teal-600 hover:underline">Ver todas →</a> </div> ${todayApts.length === 0 ? renderTemplate`<div class="text-center py-8 text-slate-400"> <p class="font-medium">Sin citas programadas para hoy.</p> <a href="/appointments/add" class="text-sm text-amber-600 hover:underline font-bold mt-1 inline-block">+ Agendar</a> </div>` : renderTemplate`<div class="space-y-3"> ${todayApts.map((app) => renderTemplate`<a${addAttribute(`/appointments/${app.id}`, "href")} class="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors group"> <div class="flex items-center gap-3"> <div class="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xs border border-amber-200"> ${String(app.dateTime).split("T")[1]?.slice(0, 5) || "--:--"} </div> <p class="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">${app.patient}</p> </div> <span${addAttribute(`text-[10px] font-bold px-2 py-0.5 rounded-full border ${app.status === "Completada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}>${app.status}</span> </a>`)} </div>`} </div> <!-- Planes pendientes de aceptación --> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5"> <h3 class="text-xl font-bold text-slate-800">Planes Sin Confirmar</h3> <a href="/nutrition/profiles" class="text-sm font-semibold text-amber-600 hover:underline">Ver todos →</a> </div> ${pendingPlans.length === 0 ? renderTemplate`<div class="text-center py-8 text-slate-400"> <p class="font-medium text-sm">Todos los planes han sido aceptados por los pacientes. ✓</p> </div>` : renderTemplate`<div class="space-y-3"> ${pendingPlans.map((pl) => renderTemplate`<a${addAttribute(`/nutrition/plans/${pl.planId}`, "href")} class="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-xl hover:bg-amber-50 transition-colors group"> <div class="flex items-center gap-3"> <div class="w-9 h-9 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm border border-amber-200"> ${String(pl.patient)[0]} </div> <div> <p class="font-bold text-slate-800 text-sm">${pl.patient}</p> <p class="text-xs text-slate-500">${pl.caloricRequirement} kcal/día</p> </div> </div> <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 uppercase">Pendiente</span> </a>`)} </div>`} </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/NutritionistDashboard.astro", void 0);

const $$CoachDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CoachDashboard;
  const { user } = Astro2.props;
  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    injury: '<path d="M12 2v20"/><path d="m14.5 4-5 5"/><path d="m14.5 9.5-5 5"/><path d="m14.5 15-5 5"/>'};
  const athletesRes = await db.execute({
    sql: `SELECT p.patientId, u.firstName, u.lastName, p.isAthlete
        FROM Coach_Athlete ca
        JOIN Patients p ON ca.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        WHERE ca.coachId = ?`,
    args: [user.userId]
  });
  const athletes = athletesRes.rows;
  const athleteIds = athletes.map((a) => a.patientId);
  let activeInjuries = 0;
  if (athleteIds.length > 0) {
    const placeholders = athleteIds.map(() => "?").join(",");
    const injRes = await db.execute({
      sql: `SELECT COUNT(*) as total FROM Injuries WHERE status = 'Activa' AND patientId IN (${placeholders})`,
      args: athleteIds
    });
    activeInjuries = Number(injRes.rows[0].total);
  }
  return renderTemplate`${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Panel del Entrenador</h1> <p class="text-slate-500 mt-1">Hola, ${user?.firstName} — monitoreo deportivo y médico de tus atletas</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Atletas Asignados", "value": athletes.length, "icon": ICONS.users, "colorClass": "from-sky-500 to-indigo-500", "href": "/patients" })} ${renderComponent($$result, "StatsCard", $$StatsCard, { "title": "Lesiones Activas", "value": activeInjuries, "icon": ICONS.injury, "colorClass": "from-rose-500 to-pink-500", "href": "/injuries" })} </div> <div class="grid grid-cols-1 xl:grid-cols-2 gap-8"> <!-- Listado de atletas --> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5"> <h3 class="text-xl font-bold text-slate-800">Mis Atletas</h3> <a href="/patients" class="text-sm font-semibold text-teal-600 hover:underline">Ver todos →</a> </div> <div class="space-y-3"> ${athletes.length === 0 ? renderTemplate`<div class="text-center py-8 text-slate-500 text-sm">No tienes atletas asignados aún.</div>` : athletes.map((athlete) => renderTemplate`<a${addAttribute(`/patients/${athlete.patientId}`, "href")} class="flex items-center justify-between p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors group"> <div class="flex items-center gap-3"> <div class="w-9 h-9 bg-sky-50 text-sky-700 border border-sky-200 rounded-full flex items-center justify-center font-bold text-sm"> ${String(athlete.firstName)[0]}${String(athlete.lastName)[0]} </div> <div> <p class="font-bold text-slate-800 text-sm">${athlete.firstName} ${athlete.lastName}</p> <p class="text-xs text-slate-500">Exp. #${String(athlete.patientId).padStart(4, "0")}</p> </div> </div> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-teal-600 transition-colors"><path d="m9 18 6-6-6-6"></path></svg> </a>`)} </div> </div> <!-- Acciones rápidas del entrenador --> <div class="glass-card rounded-2xl p-6"> <h3 class="text-xl font-bold text-slate-800 mb-5">Acciones</h3> <div class="space-y-3"> <a href="/injuries/add" class="flex items-center gap-4 p-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors group"> <div class="w-10 h-10 bg-rose-200 text-rose-700 rounded-xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path></svg> </div> <div> <p class="font-bold text-rose-900">Reportar Lesión</p> <p class="text-xs text-rose-700">Registrar incidente de algún atleta</p> </div> </a> <a href="/injuries" class="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors group"> <div class="w-10 h-10 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> </div> <div> <p class="font-bold text-amber-900">Ver Lesiones</p> <p class="text-xs text-amber-700">Historial de lesiones de tus atletas</p> </div> </a> <a href="/nutrition/profiles" class="flex items-center gap-4 p-4 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-colors group"> <div class="w-10 h-10 bg-teal-200 text-teal-700 rounded-xl flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a9 9 0 0 0 9-9c0-4.97-4-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z"></path></svg> </div> <div> <p class="font-bold text-teal-900">Planes Nutricionales</p> <p class="text-xs text-teal-700">Ver planes asignados por el nutriólogo</p> </div> </a> </div> </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/CoachDashboard.astro", void 0);

const $$StudentDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StudentDashboard;
  const { user } = Astro2.props;
  const ICONS = {
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    nutrition: '<path d="M12 22a9 9 0 0 0 9-9c0-4.97-4-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z"/><path d="M12 14c-1.66 0-3-1.34-3-3v0c0-1.66 1.34-3 3-3v0c1.66 0 3 1.34 3 3v0c0 1.66-1.34 3-3 3Z"/><path d="M12 2v2M2 12h2M20 12h2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41"/>'
  };
  const aptRes = await db.execute({
    sql: `SELECT a.dateTime, u.lastName as doctor 
          FROM Appointments a 
          JOIN Users u ON a.doctorId = u.userId 
          WHERE a.patientId = ? AND a.status = 'Pendiente' 
          ORDER BY a.dateTime ASC LIMIT 1`,
    args: [user.userId]
  });
  const nextApt = aptRes.rows[0];
  let latestBmi = "--";
  const bmiRes = await db.execute({
    sql: `SELECT currentBmi FROM NutritionalFollowUps 
          WHERE planId IN (SELECT planId FROM NutritionalPlans WHERE patientId = ?) 
          ORDER BY followUpDate DESC LIMIT 1`,
    args: [user.userId]
  });
  if (bmiRes.rows.length > 0) {
    latestBmi = String(bmiRes.rows[0].currentBmi);
  }
  const treatmentsRes = await db.execute({
    sql: `SELECT 
            (SELECT COUNT(*) FROM Prescriptions WHERE consultationId IN (SELECT consultationId FROM Consultations WHERE appointmentId IN (SELECT appointmentId FROM Appointments WHERE patientId = ?))) + 
            (SELECT COUNT(*) FROM NutritionalPlans WHERE patientId = ? AND planId NOT IN (SELECT planId FROM NutritionalDischarges)) +
            (SELECT COUNT(*) FROM Injuries WHERE patientId = ? AND status = 'Activa') as total`,
    args: [user.userId, user.userId, user.userId]
  });
  const activeTreatmentsCount = treatmentsRes.rows[0].total;
  const stats = [
    { title: "Próxima Cita", value: nextApt ? String(nextApt.dateTime).split(" ")[0] : "--", icon: ICONS.calendar, trend: nextApt ? `Dr. ${nextApt.doctor}` : "Ninguna", color: "from-emerald-500 to-teal-500" },
    { title: "IMC Actual", value: latestBmi, icon: ICONS.nutrition, trend: "En Segumiento", color: "from-sky-500 to-indigo-500" },
    { title: "Tratamientos Activos", value: Number(activeTreatmentsCount), icon: ICONS.activity, color: "from-amber-500 to-orange-500" }
  ];
  let alerts = [];
  if (!nextApt) {
    alerts.push({ type: "info", message: "No tienes citas programadas. Te sugerimos agendar un chequeo preventivo anual.", link: "/appointments" });
  }
  const historyRes = await db.execute({
    sql: `SELECT a.dateTime as date, u.lastName as doctor, c.diagnosis as reason, a.status 
          FROM Consultations c 
          JOIN Appointments a ON c.appointmentId = a.appointmentId 
          JOIN Users u ON a.doctorId = u.userId
          WHERE a.patientId = ?
          ORDER BY a.dateTime DESC LIMIT 4`,
    args: [user.userId]
  });
  const history = historyRes.rows;
  const planRes = await db.execute({
    sql: `SELECT pl.planId, pl.patientAccepted, u.lastName as nutri 
          FROM NutritionalPlans pl
          JOIN Users u ON pl.nutritionistId = u.userId
          WHERE pl.patientId = ? AND pl.planId NOT IN (SELECT planId FROM NutritionalDischarges)
          ORDER BY pl.creationDate DESC LIMIT 1`,
    args: [user.userId]
  });
  const activePlan = planRes.rows[0];
  return renderTemplate`${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Mi Salud Estudiantil</h1> <p class="text-slate-500 mt-1 text-lg">Revisa tu estado de salud y próximas citas</p> </div> ${alerts.length > 0 && renderTemplate`${renderComponent($$result, "AlertBanner", $$AlertBanner, { "alerts": alerts })}`} <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> ${stats.map((stat) => renderTemplate`${renderComponent($$result, "StatsCard", $$StatsCard, { "title": stat.title, "value": stat.value, "icon": stat.icon, "trendLabel": stat.trend, "colorClass": stat.color })}`)} </div> <div class="grid grid-cols-1 xl:grid-cols-3 gap-8"> <div class="xl:col-span-2 glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-slate-800">Historial Reciente</h3> <a${addAttribute(`/patients/${user.userId}`, "href")} class="text-sm font-semibold text-teal-600 hover:text-teal-700">Ver Expediente Clínico Completo &rarr;</a> </div> <div class="space-y-4"> ${history.map((item) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl flex-wrap gap-4"> <div class="flex items-center gap-4"> <div class="w-12 h-12 bg-white text-teal-700 rounded-xl flex items-center justify-center font-bold text-xs text-center leading-tight shadow-sm border border-teal-100"> ${String(item.date).split(" ")[0]} </div> <div> <h4 class="font-bold text-slate-800 text-sm">${item.reason}</h4> <p class="text-xs text-slate-500">Dr. ${item.doctor}</p> </div> </div> <div> <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider"> ${item.status} </span> </div> </div>`)} ${history.length === 0 && renderTemplate`<div class="text-center py-8 text-slate-500 border border-white rounded-xl bg-white/30">Aún no tienes expediente registrado.</div>`} </div> </div> <div class="glass-card rounded-2xl p-6"> <h3 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Tu Plan Nutricional</h3> ${activePlan ? renderTemplate`<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 relative overflow-hidden group shadow-sm"> <div class="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent"></div> <div class="relative z-10 text-center"> <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3"> <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.nutrition)}</svg> </div> <h4 class="font-bold text-amber-900 mb-1">Plan Activo</h4> <p class="text-xs text-amber-800 mb-4 px-2">Asignado por: Nutrióloga ${activePlan.nutri}</p> ${activePlan.patientAccepted === 0 ? renderTemplate`<form action="/api/accept-plan" method="POST" class="mt-4"> <input type="hidden" name="planId"${addAttribute(String(activePlan.planId), "value")}> <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg shadow-md transition-all text-sm mb-2 hover:-translate-y-0.5 animate-pulse">
Aceptar Plan Ahora
</button> <a${addAttribute(`/nutrition/plans/${activePlan.planId}`, "href")} class="block text-amber-700 text-xs font-semibold hover:underline">Revisar detalles primero</a> </form>` : renderTemplate`<div class="mt-4"> <div class="bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-bold py-1.5 px-3 rounded-full mb-3 inline-block">
El plan fue aceptado ✅
</div> <a${addAttribute(`/nutrition/plans/${activePlan.planId}`, "href")} class="block w-full py-2 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 font-semibold rounded-lg shadow-sm transition-colors text-sm">
Ver Mi Dieta Completa
</a> </div>`} </div> </div>` : renderTemplate`<div class="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl"> <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.nutrition)}</svg> <p class="text-sm font-semibold text-slate-600">Sin plan alimenticio</p> <p class="text-xs text-slate-400 mt-1 px-4">No tienes ningún plan nutricional activo asignado en este momento.</p> </div>`} </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/StudentDashboard.astro", void 0);

const $$StaffDashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StaffDashboard;
  const ICONS = {
    inventory: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  };
  const aptRes = await db.execute(`
    SELECT COUNT(*) as total 
    FROM Appointments 
    WHERE date(dateTime) = date('now')
`);
  const appointmentsToday = Number(aptRes.rows[0].total);
  const stockRes = await db.execute(`
    SELECT COUNT(*) as total, group_concat(brandName) as names 
    FROM Medications 
    WHERE currentStock <= reorderPoint
`);
  const criticalMedsCount = Number(stockRes.rows[0].total);
  const criticalMedsNames = stockRes.rows[0].names;
  const docsRes = await db.execute(`SELECT COUNT(*) as total FROM Users WHERE roleId = 3`);
  const activeDoctors = Number(docsRes.rows[0].total);
  const stats = [
    { title: "Citas Hoy", value: appointmentsToday, icon: ICONS.calendar, trend: "Global", color: "from-emerald-500 to-teal-500" },
    { title: "Medicamentos Críticos", value: criticalMedsCount, icon: ICONS.inventory, trend: "En Farmacia", color: "from-rose-500 to-pink-500" },
    { title: "Doctores Activos", value: activeDoctors, icon: ICONS.alert, trend: "En Clínica", color: "from-sky-500 to-indigo-500" }
  ];
  let alerts = [];
  if (criticalMedsCount > 0) {
    alerts.push({ type: "stock", message: `Alerta: Hay ${criticalMedsCount} medicamentos en stock crítico (${criticalMedsNames}).`, link: "/medications" });
  }
  const mockRes = await db.execute(`
  SELECT a.dateTime, a.status,
         u.firstName || ' ' || u.lastName as patient,
         ud.lastName as doctor
  FROM Appointments a
  JOIN Patients p ON a.patientId = p.patientId
  JOIN Users u ON p.patientId = u.userId
  JOIN Users ud ON a.doctorId = ud.userId
  WHERE date(a.dateTime) >= date('now')
  ORDER BY a.dateTime ASC LIMIT 5
`);
  const mockAppointments = mockRes.rows.map((r) => ({
    time: new Date(r.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    doctor: `Dr. ${r.doctor}`,
    patient: r.patient,
    status: r.status
  }));
  return renderTemplate`${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Panel Administrativo Staff</h1> <p class="text-slate-500 mt-1 text-lg">Control de agenda, inventario y logística</p> </div> ${renderComponent($$result, "AlertBanner", $$AlertBanner, { "alerts": alerts })} <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> ${stats.map((stat) => renderTemplate`${renderComponent($$result, "StatsCard", $$StatsCard, { "title": stat.title, "value": stat.value, "icon": stat.icon, "trendLabel": stat.trend, "colorClass": stat.color })}`)} </div> <div class="grid grid-cols-1 xl:grid-cols-2 gap-8"> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-slate-800">Control de Agenda General</h3> <a href="/appointments" class="text-sm font-semibold text-teal-600 hover:text-teal-700">Ver Calendario &rarr;</a> </div> <div class="space-y-4"> ${mockAppointments.map((app) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-colors"> <div class="flex items-center gap-4"> <div class="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-teal-100"> ${app.time.split(" ")[0]} </div> <div> <h4 class="font-bold text-slate-800">${app.patient}</h4> <p class="text-xs text-slate-500">${app.doctor} • Cita Médica</p> </div> </div> <div> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-semibold border ${app.status === "En Progreso" ? "bg-sky-50 text-sky-700 border-sky-200" : app.status === "Pendiente" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`, "class")}> ${app.status} </span> </div> </div>`)} </div> </div> <div class="glass-card rounded-2xl p-6"> <h3 class="text-xl font-bold text-slate-800 mb-6">Accesos Logísticos</h3> <div class="grid grid-cols-2 gap-4"> <a href="/appointments" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/40 bg-white/50 hover:bg-white hover:scale-105 transition-all shadow-sm group"> <div class="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-500 group-hover:text-white transition-colors"> <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.calendar)}</svg> </div> <span class="font-semibold text-slate-700">Agendar Cita</span> </a> <a href="/medications/add" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/40 bg-white/50 hover:bg-white hover:scale-105 transition-all shadow-sm group"> <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors"> <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M12 2v20"></path><path d="m14.5 4-5 5"></path><path d="m14.5 9.5-5 5"></path><path d="m14.5 15-5 5"></path> </svg> </div> <span class="font-semibold text-slate-700 text-center">Registrar Medicamento</span> </a> <a href="/medications" class="flex flex-col items-center justify-center p-6 rounded-xl border border-white/40 bg-white/50 hover:bg-white hover:scale-105 transition-all shadow-sm group col-span-2"> <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors"> <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.inventory)}</svg> </div> <span class="font-semibold text-slate-700">Supervisar Inventario</span> </a> </div> </div> </div>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Dashboard/StaffDashboard.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (user?.roleId === ROLES.STAFF) {
    return Astro2.redirect("/medications");
  }
  if (user?.roleId === ROLES.ESTUDIANTE) {
    return Astro2.redirect("/mi-perfil");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard Principal" }, { "default": ($$result2) => renderTemplate`${user?.roleId === ROLES.ADMINISTRADOR || user?.roleId === ROLES.JEFE_MEDICO ? (
    // Vista para Administradores y Jefes Médicos (Estadísticas Globales)
    renderTemplate`${renderComponent($$result2, "AdminDashboard", $$AdminDashboard, { "user": user })}`
  ) : user?.roleId === ROLES.DOCTOR ? (
    // Vista para Doctores (Citas del día y Alertas)
    renderTemplate`${renderComponent($$result2, "DoctorDashboard", $$DoctorDashboard, { "user": user })}`
  ) : user?.roleId === ROLES.NUTRIOLOGO ? (
    // Vista para Nutriólogos (Planes activos y seguimientos)
    renderTemplate`${renderComponent($$result2, "NutritionistDashboard", $$NutritionistDashboard, { "user": user })}`
  ) : user?.roleId === ROLES.ENTRENADOR ? (
    // Vista para Entrenadores (Estado físico de sus atletas asignados)
    renderTemplate`${renderComponent($$result2, "CoachDashboard", $$CoachDashboard, { "user": user })}`
  ) : user?.roleId === ROLES.ESTUDIANTE ? (
    // Vista para Estudiantes (Dashboard personal - backup si falla la redirección)
    renderTemplate`${renderComponent($$result2, "StudentDashboard", $$StudentDashboard, { "user": user })}`
  ) : user?.roleId === ROLES.STAFF ? (
    // Vista para Staff (Inventario - backup si falla la redirección)
    renderTemplate`${renderComponent($$result2, "StaffDashboard", $$StaffDashboard, { "user": user })}`
  ) : (
    // Fallback de seguridad por si el rol no está mapeado correctamente
    renderTemplate`${maybeRenderHead()}<div class="text-center py-20 text-slate-500 font-semibold"> <p>⚠️ Rol no reconocido.</p> <p class="text-sm font-normal">Contacta al administrador del sistema para verificar tus permisos.</p> </div>`
  )}` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/index.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
