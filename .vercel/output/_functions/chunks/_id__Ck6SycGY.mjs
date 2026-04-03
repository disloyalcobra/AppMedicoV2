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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.ESTUDIANTE, ROLES.NUTRIOLOGO])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/404");
  const isDoctorOrAdmin = user?.roleId === ROLES.DOCTOR || user?.roleId === ROLES.ADMINISTRADOR || user?.roleId === ROLES.JEFE_MEDICO;
  const consRes = await db.execute({
    sql: `SELECT c.consultationId, c.diagnosis, c.symptoms, c.consultationDate,
               c.appointmentId,
               u.firstName || ' ' || u.lastName as patient,
               a.patientId,
               ud.firstName || ' ' || ud.lastName as doctor,
               a.dateTime as aptDateTime, a.status as aptStatus
        FROM Consultations c
        JOIN Appointments a ON c.appointmentId = a.appointmentId
        JOIN Patients p ON a.patientId = p.patientId
        JOIN Users u ON p.patientId = u.userId
        JOIN Users ud ON a.doctorId = ud.userId
        WHERE c.consultationId = ?`,
    args: [String(id)]
  });
  if (consRes.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const cons = consRes.rows[0];
  if (user?.roleId === ROLES.ESTUDIANTE && String(user.userId) !== String(cons.patientId)) {
    return Astro2.redirect("/403");
  }
  const presRes = await db.execute({
    sql: `SELECT pr.prescriptionId, pr.dosage, pr.frequency, pr.duration,
               m.brandName, m.activeIngredient, m.presentation, m.medicationId
        FROM Prescriptions pr
        JOIN Medications m ON pr.medicationId = m.medicationId
        WHERE pr.consultationId = ?`,
    args: [String(id)]
  });
  const prescriptions = presRes.rows;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const action = data.get("_action");
    if (action === "update" && isDoctorOrAdmin) {
      const symptoms = data.get("symptoms");
      const diagnosis = data.get("diagnosis");
      await db.execute({
        sql: `UPDATE Consultations SET symptoms = ?, diagnosis = ? WHERE consultationId = ?`,
        args: [symptoms, diagnosis, String(id)]
      });
    }
    if (action === "delete_prescription" && isDoctorOrAdmin) {
      const prescriptionId = data.get("prescriptionId");
      await db.execute({
        sql: `DELETE FROM Prescriptions WHERE prescriptionId = ?`,
        args: [prescriptionId]
      });
    }
    return Astro2.redirect(`/consultations/${id}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Consulta: ${cons.patient}` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a${addAttribute(`/patients/${cons.patientId}`, "href")} class="hover:text-teal-600 transition-colors">Expediente del Paciente</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Consulta #${String(id).padStart(4, "0")}</span> </div> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> <div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registro de Consulta</h1> <p class="text-slate-500 mt-1">
Paciente: <span class="font-semibold text-slate-700">${cons.patient}</span> · 
          Atendido por <span class="font-semibold text-slate-700">Dr. ${cons.doctor}</span> </p> </div> <div class="flex items-center gap-3"> <span class="bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-widest"> ${String(cons.consultationDate).split("T")[0]} </span> ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/prescriptions/add?consultationId=${String(id)}&patientId=${String(cons.patientId)}`, "href")} class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Añadir Receta
</a>`} </div> </div> </div> <div class="grid grid-cols-1 xl:grid-cols-3 gap-8"> <!-- Left: Diagnosis Form + Prescriptions --> <div class="xl:col-span-2 space-y-6"> <!-- Diagnóstico y Síntomas --> ${isDoctorOrAdmin ? renderTemplate`<form method="POST" class="glass-card rounded-2xl p-6"> <input type="hidden" name="_action" value="update"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-3 mb-5">Diagnóstico y Síntomas</h3> <div class="space-y-5"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Síntomas / Motivo de Consulta</label> <textarea name="symptoms" rows="4" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Descripción de los síntomas...">${cons.symptoms}</textarea> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Diagnóstico Médico</label> <textarea name="diagnosis" rows="4" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" placeholder="Diagnóstico clínico...">${cons.diagnosis}</textarea> </div> </div> <div class="mt-5 flex justify-end gap-3 border-t border-white/60 pt-4"> <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Cambios
</button> </div> </form>` : renderTemplate`<div class="glass-card rounded-2xl p-6"> <h3 class="text-lg font-bold text-slate-800 border-b border-white/60 pb-3 mb-5">Diagnóstico y Síntomas</h3> <div class="space-y-5"> <div> <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Síntomas</p> <p class="text-slate-700 leading-relaxed">${cons.symptoms || "Sin registrar"}</p> </div> <div> <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Diagnóstico</p> <p class="text-slate-800 font-semibold leading-relaxed">${cons.diagnosis || "Sin registrar"}</p> </div> </div> </div>`} <!-- Recetas de esta consulta --> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5 border-b border-white/60 pb-3"> <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
Recetas de esta Consulta
</h3> <span class="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full"> ${prescriptions.length} ${prescriptions.length === 1 ? "Medicamento" : "Medicamentos"} </span> </div> ${prescriptions.length === 0 ? renderTemplate`<div class="text-center py-8 text-slate-500"> <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-slate-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> <p class="text-sm font-medium">No hay recetas registradas para esta consulta.</p> ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/prescriptions/add?consultationId=${id}&patientId=${cons.patientId}`, "href")} class="mt-3 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
+ Agregar primera receta
</a>`} </div>` : renderTemplate`<div class="space-y-4"> ${prescriptions.map((pr) => renderTemplate`<div class="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/80 shadow-sm group"> <div class="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 7 17l3.5-3.5"></path><path d="M14 17H7"></path><path d="m13.5 3.5 3.5 3.5-3.5 3.5"></path><path d="M10 7h7"></path><path d="M7 21V3"></path><path d="M17 21V3"></path></svg> </div> <div class="flex-1 min-w-0"> <p class="font-bold text-slate-800 text-base">${pr.brandName}</p> <p class="text-sm text-slate-500 mt-0.5">${pr.activeIngredient} · ${pr.presentation}</p> <div class="flex flex-wrap gap-3 mt-2"> <span class="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-semibold">Dosis: ${pr.dosage}</span> <span class="text-xs bg-sky-50 border border-sky-200 text-sky-700 px-2.5 py-1 rounded-lg font-semibold">Frec: ${pr.frequency}</span> <span class="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg font-semibold">Duración: ${pr.duration}</span> </div> </div> ${isDoctorOrAdmin && renderTemplate`<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"> <a${addAttribute(`/prescriptions/${pr.prescriptionId}?consultationId=${id}`, "href")} class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm" title="Editar"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg> </a> <form method="POST" onsubmit="return confirm('¿Eliminar esta receta?')"> <input type="hidden" name="_action" value="delete_prescription"> <input type="hidden" name="prescriptionId"${addAttribute(pr.prescriptionId, "value")}> <button type="submit" class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm" title="Eliminar"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg> </button> </form> </div>`} </div>`)} </div>`} </div> </div> <!-- Right sidebar: Patient Info --> <div class="xl:col-span-1"> <div class="glass-strong rounded-2xl p-6 sticky top-24 border border-slate-200/60 space-y-5"> <h3 class="font-bold text-slate-800 text-lg border-b border-slate-200 pb-3">Información del Paciente</h3> <div class="flex items-center gap-3"> <div class="w-12 h-12 bg-teal-50 text-teal-700 border border-teal-200 rounded-full flex items-center justify-center font-bold text-lg"> ${String(cons.patient).split(" ").map((n) => n[0]).slice(0, 2).join("")} </div> <div> <p class="font-bold text-slate-800">${cons.patient}</p> <p class="text-xs text-slate-500">Exp. #${String(cons.patientId).padStart(4, "0")}</p> </div> </div> <div class="space-y-3 text-sm"> <div class="flex justify-between items-center py-2 border-b border-slate-100"> <span class="text-slate-500 font-medium">Fecha de cita</span> <span class="font-semibold text-slate-800 text-right">${String(cons.aptDateTime).split("T")[0]}</span> </div> <div class="flex justify-between items-center py-2 border-b border-slate-100"> <span class="text-slate-500 font-medium">Doctor</span> <span class="font-semibold text-slate-800">Dr. ${cons.doctor}</span> </div> <div class="flex justify-between items-center py-2 border-b border-slate-100"> <span class="text-slate-500 font-medium">Estado Cita</span> <span${addAttribute(`text-xs font-bold px-2.5 py-1 rounded-full border ${cons.aptStatus === "Completada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, "class")}> ${cons.aptStatus} </span> </div> <div class="flex justify-between items-center py-2"> <span class="text-slate-500 font-medium">Recetas</span> <span class="font-bold text-indigo-700">${prescriptions.length}</span> </div> </div> <div class="pt-4 border-t border-slate-200 space-y-2"> <a${addAttribute(`/patients/${cons.patientId}`, "href")} class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-white hover:text-teal-700 hover:border-teal-200 transition-colors text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
Ver Expediente Completo
</a> ${isDoctorOrAdmin && renderTemplate`<a${addAttribute(`/prescriptions/add?consultationId=${id}&patientId=${cons.patientId}`, "href")} class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-md transition-all text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Añadir Medicamento
</a>`} </div> </div> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/consultations/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/consultations/[id].astro";
const $$url = "/consultations/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
