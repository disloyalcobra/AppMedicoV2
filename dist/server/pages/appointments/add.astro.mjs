/* empty css                                  */
import { e as createComponent, m as maybeRenderHead, r as renderTemplate, g as addAttribute, h as createAstro, k as renderComponent } from '../../chunks/astro/server_DBbqSsVa.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DrfESANN.mjs';
import 'clsx';
import { d as db } from '../../chunks/turso_YhtWwx2k.mjs';
import { c as checkRole, R as ROLES } from '../../chunks/checkRole_wmyz_iGO.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$AppointmentForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AppointmentForm;
  const { appointment } = Astro2.props;
  const patientsRes = await db.execute(`SELECT patientId, firstName, lastName FROM Patients JOIN Users ON Patients.patientId = Users.userId`);
  const patients = patientsRes.rows;
  const doctorsRes = await db.execute(`SELECT userId, firstName, lastName, roleName FROM Users JOIN Roles ON Users.roleId = Roles.roleId WHERE Roles.roleName IN ('Doctor', 'Jefe M\xE9dico', 'Nutri\xF3logo')`);
  const doctors = doctorsRes.rows;
  let success = false;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const patientId = data.get("patientId");
    const doctorId = data.get("doctorId");
    const dateStr = data.get("date");
    const timeStr = data.get("time");
    const dateTime = `${dateStr} ${timeStr}:00`;
    await db.execute({
      sql: `INSERT INTO Appointments (patientId, doctorId, dateTime, status) VALUES (?, ?, ?, 'Pendiente')`,
      args: [patientId, doctorId, dateTime]
    });
    success = true;
  }
  return renderTemplate`${success && renderTemplate`${maybeRenderHead()}<div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between"><div class="flex items-center gap-2 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
Cita agendada exitosamente.
</div><a href="/appointments" class="text-emerald-800 underline font-bold">Ver Agenda</a></div>`}<form method="POST" class="space-y-6"> <div class="glass-card rounded-2xl p-6"> <h3 class="text-lg font-bold text-slate-800 mb-4 border-b border-white/60 pb-2">Datos de la Cita</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> <div class="md:col-span-2"> <label for="patientId" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Paciente</label> <select name="patientId" id="patientId" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required> <option value="">Seleccionar Paciente</option> ${patients.map((p) => renderTemplate`<option${addAttribute(p.patientId, "value")}>${p.firstName} ${p.lastName} (Exp. #${String(p.patientId).padStart(4, "0")})</option>`)} </select> <p class="text-xs text-slate-500 mt-1 ml-1">Busca por nombre o número de expediente.</p> </div> <div> <label for="doctorId" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Médico/Especialista</label> <select name="doctorId" id="doctorId" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required> <option value="">Asignar Médico</option> ${doctors.map((d) => renderTemplate`<option${addAttribute(d.userId, "value")}>${d.firstName} ${d.lastName} (${d.roleName})</option>`)} </select> </div> <div> <label for="date" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Fecha</label> <input type="date" name="date" id="date" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required> </div> <div> <label for="time" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Hora</label> <input type="time" name="time" id="time" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required> </div> </div> </div> <div class="flex justify-end gap-4"> <a href="/appointments" class="px-5 py-2.5 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"> ${appointment ? "Actualizar Cita" : "Agendar Cita"} </button> </div> </form>`;
}, "C:/claude-projects/AppMedicoV2/src/components/Appointment/AppointmentForm.astro", void 0);

const $$Astro = createAstro();
const $$Add = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Add;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.STAFF, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Agendar Cita" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a href="/appointments" class="hover:text-teal-600 transition-colors">Agenda</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Nueva Cita</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Agendar Consulta</h1> </div> <div class="max-w-4xl"> ${renderComponent($$result2, "AppointmentForm", $$AppointmentForm, {})} </div> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/appointments/add.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/appointments/add.astro";
const $$url = "/appointments/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
