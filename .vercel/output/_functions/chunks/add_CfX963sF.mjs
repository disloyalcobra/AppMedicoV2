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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const url = Astro2.url;
  const patientId = url.searchParams.get("patientId");
  const appointmentId = url.searchParams.get("appointmentId");
  if (!patientId && !appointmentId) {
    return Astro2.redirect("/patients?error=missing_params");
  }
  let finalAptId = appointmentId;
  if (!finalAptId) {
    const apts = await db.execute({
      sql: `SELECT appointmentId FROM Appointments WHERE patientId = ? AND status != 'Cancelada' ORDER BY dateTime DESC LIMIT 1`,
      args: [patientId]
    });
    finalAptId = apts.rows[0]?.appointmentId;
  }
  if (!finalAptId) {
    return Astro2.redirect(`/patients/${patientId}?error=no_appointment_found`);
  }
  let finalPatientId = patientId;
  if (!finalPatientId) {
    const pRes = await db.execute({
      sql: `SELECT patientId FROM Appointments WHERE appointmentId = ?`,
      args: [finalAptId]
    });
    finalPatientId = pRes.rows[0]?.patientId;
  }
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const symptoms = data.get("symptoms");
    const diagnosis = data.get("diagnosis");
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await db.execute({
      sql: `INSERT INTO Consultations (appointmentId, diagnosis, symptoms, consultationDate) VALUES (?, ?, ?, ?)`,
      args: [finalAptId, diagnosis, symptoms, date]
    });
    await db.execute({
      sql: `UPDATE Appointments SET status = 'Completada' WHERE appointmentId = ?`,
      args: [finalAptId]
    });
    return Astro2.redirect(`/patients/${finalPatientId}`);
  }
  const patientDataRes = await db.execute({
    sql: `SELECT u.firstName, u.lastName, p.dateOfBirth, p.bloodType, p.allergies 
        FROM Patients p JOIN Users u ON p.patientId = u.userId WHERE p.patientId = ?`,
    args: [finalPatientId]
  });
  const pt = patientDataRes.rows[0];
  const age = pt?.dateOfBirth ? Math.abs(new Date(Date.now() - new Date(pt.dateOfBirth).getTime()).getUTCFullYear() - 1970) : "N/A";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar Consulta" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a${addAttribute(`/patients/${patientId}`, "href")} class="hover:text-teal-600 transition-colors">Regresar al Expediente</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Consulta nueva</span> </div> <div class="flex items-center gap-4"> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Registro de Consulta</h1> <span class="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 uppercase">Cita #${String(finalAptId).padStart(4, "0")}</span> </div> </div> <div class="grid grid-cols-1 xl:grid-cols-3 gap-8"> <div class="xl:col-span-2 space-y-6"> <form method="POST" id="consultationForm"> <div class="glass-card rounded-2xl p-6"> <h3 class="text-lg font-bold text-slate-800 mb-4 border-b border-white/60 pb-2">Diagnóstico y Notas</h3> <div class="space-y-5"> <div> <label for="symptoms" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Síntomas / Motivo de Consulta</label> <textarea name="symptoms" id="symptoms" required rows="3" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Descripción de los síntomas presentados por el paciente..."></textarea> </div> <div> <label for="diagnosis" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Diagnóstico Médico</label> <textarea name="diagnosis" id="diagnosis" required rows="3" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" placeholder="Diagnóstico presuntivo o definitivo..."></textarea> </div> </div> </div> </form> <!-- Placeholder para la receta y archivos --> <div class="glass-card rounded-2xl p-6 opacity-60"> <h3 class="text-lg font-bold text-slate-800">Receta Médica y Archivos</h3> <p class="text-sm text-slate-500">Primero guarde esta consulta para poder adjuntar recetas y documentos.</p> </div> <div class="flex justify-end gap-4 pt-4"> <button onclick="document.getElementById('consultationForm').submit()" class="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] w-full md:w-auto">
Finalizar y Guardar Consulta
</button> </div> </div> <!-- Summary Sidebar --> <div class="xl:col-span-1"> <div class="glass-strong rounded-2xl p-6 sticky top-24 border border-teal-100/50"> <h3 class="font-bold text-slate-800 text-lg border-b border-teal-100 pb-3 mb-4">Resumen del Paciente</h3> <div class="flex items-center gap-4 mb-6"> <div class="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg border border-teal-200 uppercase"> ${pt?.firstName && pt.firstName[0]}${pt?.lastName && pt.lastName[0]} </div> <div> <p class="font-bold text-slate-800">${pt?.firstName} ${pt?.lastName}</p> <p class="text-xs text-slate-500">${age} años • ${pt?.bloodType}</p> </div> </div> <div class="space-y-4 text-sm"> <div> <p class="text-slate-400 font-semibold mb-1">Alergias</p> <p class="font-medium text-slate-800">${pt?.allergies || "Ninguna conocida"}</p> </div> <div class="pt-4 border-t border-teal-100"> <a${addAttribute(`/patients/${finalPatientId}`, "href")} class="text-teal-600 font-semibold text-xs hover:underline inline-block mt-1">Ver expediente completo &rarr;</a> </div> </div> </div> </div> </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/consultations/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/consultations/add.astro";
const $$url = "/consultations/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
