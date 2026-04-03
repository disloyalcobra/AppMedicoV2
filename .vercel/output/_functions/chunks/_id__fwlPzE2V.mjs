/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, a3 as addAttribute, F as Fragment, b7 as unescapeHTML } from './sequence_D80S23pC.mjs';
import { r as renderComponent } from './entrypoint_qVGLm_qQ.mjs';
import { $ as $$Layout } from './Layout_DgiK0uwO.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';
import { d as db } from './turso_BY-aYcMZ.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const user = Astro2.locals.user;
  if (!checkRole(user, [
    ROLES.DOCTOR,
    ROLES.JEFE_MEDICO,
    ROLES.NUTRIOLOGO,
    ROLES.ENTRENADOR,
    ROLES.ADMINISTRADOR,
    ROLES.ESTUDIANTE
  ])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/404");
  if (user?.roleId === ROLES.ESTUDIANTE && String(user.userId) !== String(id)) {
    return Astro2.redirect("/403");
  }
  const patientResult = await db.execute({
    sql: `SELECT p.patientId, u.firstName, u.lastName, p.dateOfBirth, p.bloodType, p.allergies, p.weight, p.height, p.isAthlete, p.gender, p.schoolLevel
        FROM Patients p JOIN Users u ON p.patientId = u.userId 
        WHERE p.patientId = ?`,
    args: [id]
  });
  if (patientResult.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const pData = patientResult.rows[0];
  const dob = new Date(String(pData.dateOfBirth || ""));
  const age = Math.abs(
    new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970
  );
  const patient = {
    id: pData.patientId,
    firstName: pData.firstName,
    lastName: pData.lastName,
    age,
    bloodType: pData.bloodType || "N/A",
    allergies: pData.allergies || "Ninguna",
    weight: pData.weight ? `${pData.weight} kg` : "N/A",
    height: pData.height ? `${pData.height} cm` : "N/A",
    isAthlete: pData.isAthlete,
    gender: pData.gender || "O",
    schoolLevel: pData.schoolLevel || ""
  };
  const aptResult = await db.execute({
    sql: `SELECT a.appointmentId as id, a.dateTime as date, u.firstName || ' ' || u.lastName as doctor, a.status 
        FROM Appointments a JOIN Users u ON a.doctorId = u.userId 
        WHERE a.patientId = ? ORDER BY a.dateTime DESC`,
    args: [id]
  });
  const appointments = aptResult.rows.map((r) => ({
    id: r.id,
    date: String(r.date),
    doctor: "Dr. " + r.doctor,
    status: r.status
  }));
  const consResult = await db.execute({
    sql: `SELECT c.consultationId as id, c.consultationDate as date, c.diagnosis, 
        (SELECT COUNT(*) FROM Prescriptions WHERE consultationId = c.consultationId) as prescriptionsCount,
        (SELECT COUNT(*) FROM ClinicalFiles WHERE consultationId = c.consultationId) as filesCount
        FROM Consultations c JOIN Appointments a ON c.appointmentId = a.appointmentId 
        WHERE a.patientId = ? ORDER BY c.consultationDate DESC`,
    args: [id]
  });
  const consultations = consResult.rows;
  const presResult = await db.execute({
    sql: `SELECT p.prescriptionId as id, m.brandName || ' (' || m.activeIngredient || ')' as med, p.dosage as dose, p.frequency as freq, p.duration, p.consultationId
        FROM Prescriptions p JOIN Medications m ON p.medicationId = m.medicationId
        JOIN Consultations c ON p.consultationId = c.consultationId
        JOIN Appointments a ON c.appointmentId = a.appointmentId
        WHERE a.patientId = ?`,
    args: [id]
  });
  const prescriptions = presResult.rows;
  const injResult = await db.execute({
    sql: `SELECT injuryId as id, injuryDate as date, injuryType as type, bodyZone as zone, severity, status, campusLocation as campus 
        FROM Injuries WHERE patientId = ? ORDER BY injuryDate DESC`,
    args: [id]
  });
  const injuries = injResult.rows;
  const isDoctorOrAdmin = user?.roleId === ROLES.DOCTOR || user?.roleId === ROLES.ADMINISTRADOR || user?.roleId === ROLES.JEFE_MEDICO;
  const isStudent = user?.roleId === ROLES.ESTUDIANTE;
  const ICONS = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Expediente: ${patient.firstName} ${patient.lastName}` }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="mb-6 flex justify-between items-end"> <div> <a href="/patients" class="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
Volver a Pacientes
</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3"> ${patient.firstName} ${patient.lastName} ${patient.isAthlete === 1 && renderTemplate`<span class="bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full border border-amber-200 uppercase tracking-widest align-middle">
Atleta
</span>`} </h1> </div> <div class="flex gap-2">  ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/patients/edit/${patient.id}`, "href")} class="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path> </svg>
Editar Datos
</a>`} ${isDoctorOrAdmin && renderTemplate`<a href="#alert-modal" class="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-xl text-sm hover:bg-rose-100 transition-colors">
+ Generar Alerta
</a>`} </div> </div> <div class="glass-card rounded-2xl p-6 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"> <div> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
Edad
</p> <p class="font-bold text-slate-800 text-lg">${patient.age} años</p> </div> <div> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
Peso / Altura
</p> <p class="font-bold text-slate-800 text-lg"> ${patient.weight} / ${patient.height} </p> </div> <div> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
Sangre
</p> <p class="font-bold text-rose-600 text-lg">${patient.bloodType}</p> </div> <div class="lg:col-span-2"> <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
Alergias
</p> <p class="font-bold text-amber-600 text-sm md:text-md"> ${patient.allergies} </p> </div> <div> ${patient.isAthlete === 1 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
Perfil
</p> <p class="font-bold text-amber-700 text-lg">Deportista</p> ` })}`} </div> </div> <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">  <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-4 border-b border-white/40 pb-4"> <h3 class="text-xl font-bold text-slate-800">Citas</h3> ${(isDoctorOrAdmin || isStudent) && renderTemplate`<a${addAttribute(`/appointments/add?patientId=${patient.id}`, "href")} class="flex items-center gap-1 text-sm bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold hover:bg-teal-500 hover:text-white transition-colors"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.plus)}</svg> ${isStudent ? "Agendar Cita" : "Nueva Cita"} </a>`} </div> <div class="space-y-3"> ${appointments.length > 0 ? appointments.map((apt) => renderTemplate`<div class="p-4 bg-white/40 rounded-xl border border-white/60 flex justify-between items-center group"> <div> <p class="font-bold text-slate-800 text-sm">${apt.date}</p> <p class="text-xs text-slate-500 mt-0.5">${apt.doctor}</p> </div> <div class="flex items-center gap-4"> <span${addAttribute(`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${apt.status === "Completada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}> ${apt.status} </span> ${(isDoctorOrAdmin || isStudent) && renderTemplate`<a${addAttribute(`/appointments/${apt.id}`, "href")} class="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 p-1" title="Ver Detalles"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(isDoctorOrAdmin ? ICONS.edit : ICONS.eye)}</svg> </a>`} </div> </div>`) : renderTemplate`<div class="text-sm text-slate-500 py-2">
No hay citas registradas.
</div>`} </div> </div>  <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-4 border-b border-white/40 pb-4"> <h3 class="text-xl font-bold text-slate-800">Consultas</h3> ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/consultations/add?patientId=${patient.id}`, "href")} class="flex items-center gap-1 text-sm bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold hover:bg-teal-500 hover:text-white transition-colors"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.plus)}</svg>
Nueva Consulta
</a>`} </div> <div class="space-y-3"> ${consultations.length > 0 ? consultations.map((cons) => renderTemplate`<div class="p-4 bg-white/40 rounded-xl border border-white/60 group"> <div class="flex justify-between items-start mb-2"> <p class="font-bold text-slate-800 text-sm">${cons.date}</p> ${isDoctorOrAdmin ? renderTemplate`<a${addAttribute(`/consultations/${cons.id}`, "href")} class="text-xs font-semibold text-teal-600 hover:text-teal-800 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1"> <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.edit)}</svg>${" "}
Ver/Editar
</a>` : renderTemplate`<a${addAttribute(`/consultations/${cons.id}`, "href")} class="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-1"> <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.eye)}</svg>${" "}
Ver
</a>`} </div> <p class="text-sm text-slate-600 line-clamp-2"> ${cons.diagnosis} </p> <div class="mt-3 flex gap-3 text-xs text-slate-400 font-medium"> <span class="flex items-center gap-1"> <span class="w-2 h-2 rounded-full bg-indigo-400"></span>${" "} ${cons.prescriptionsCount} Recetas
</span> <span class="flex items-center gap-1"> <span class="w-2 h-2 rounded-full bg-slate-400"></span>${" "} ${cons.filesCount} Archivos
</span> </div> </div>`) : renderTemplate`<div class="text-sm text-slate-500 py-2">
No hay consultas registradas.
</div>`} </div> </div>  <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-4 border-b border-white/40 pb-4"> <h3 class="text-xl font-bold text-slate-800">Recetas Activas</h3> ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/prescriptions/add?patientId=${patient.id}`, "href")} class="flex items-center gap-1 text-sm bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold hover:bg-teal-500 hover:text-white transition-colors"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.plus)}</svg>
Nueva Receta
</a>`} </div> <div class="space-y-3"> ${prescriptions.length > 0 ? prescriptions.map((pres) => renderTemplate`<div class="p-4 bg-white/40 rounded-xl border border-white/60 flex justify-between items-center group"> <div class="flex-1 min-w-0"> <p class="font-bold text-slate-800 text-sm truncate"> ${pres.med} </p> <p class="text-xs text-slate-500 mt-0.5"> ${pres.dose} · ${pres.freq} · Por ${pres.duration} </p> </div> ${isDoctorOrAdmin && renderTemplate`<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-3 shrink-0"> <a${addAttribute(`/prescriptions/${pres.id}?consultationId=${pres.consultationId}`, "href")} class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm" title="Editar Receta"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path> </svg> </a> <form method="POST"${addAttribute(`/prescriptions/${pres.id}`, "action")} onsubmit="return confirm('¿Eliminar esta receta?')" style="display:inline"> <input type="hidden" name="_action" value="delete"> <button type="submit" class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm" title="Eliminar Receta"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M3 6h18"></path> <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path> <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path> </svg> </button> </form> </div>`} ${isStudent && renderTemplate`<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-3 shrink-0"> <a${addAttribute(`/consultations/${pres.consultationId}`, "href")} class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm" title="Ver Detalles de Consulta"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.eye)}</svg> </a> </div>`} </div>`) : renderTemplate`<div class="text-sm text-slate-500 py-2">
No hay recetas activas.
</div>`} </div> </div>  <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-4 border-b border-white/40 pb-4"> <h3 class="text-xl font-bold text-slate-800">Lesiones</h3> ${(isDoctorOrAdmin || isStudent) && renderTemplate`<a${addAttribute(`/injuries/add?patientId=${patient.id}`, "href")} class="flex items-center gap-1 text-sm bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold hover:bg-teal-500 hover:text-white transition-colors"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.plus)}</svg>
Reportar Lesión
</a>`} </div> <div class="space-y-3"> ${injuries.length > 0 ? injuries.map((inj) => renderTemplate`<div class="p-4 bg-rose-50/50 rounded-xl border border-rose-100 group"> <div class="flex justify-between items-start mb-2"> <p class="font-bold text-rose-900 text-sm"> ${inj.type} en ${inj.zone} </p> ${isDoctorOrAdmin ? renderTemplate`<a${addAttribute(`/injuries/${inj.id}/edit`, "href")} class="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-white px-2 py-1 rounded shadow-sm border border-rose-100 flex items-center gap-1"> <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.edit)}</svg>${" "}
Ver/Editar
</a>` : renderTemplate`<a${addAttribute(`/injuries/${inj.id}`, "href")} class="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-white px-2 py-1 rounded shadow-sm border border-rose-100 flex items-center gap-1"> <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${unescapeHTML(ICONS.eye)}</svg>${" "}
Ver Detalles
</a>`} </div> <div class="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">  <span class="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200"> ${inj.severity} </span> <span class="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200"> ${inj.status} </span> <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"> ${inj.date} </span> </div> </div>`) : renderTemplate`<div class="text-sm text-slate-500 py-2">
No hay historial de lesiones.
</div>`} </div> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/patients/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/patients/[id].astro";
const $$url = "/patients/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
