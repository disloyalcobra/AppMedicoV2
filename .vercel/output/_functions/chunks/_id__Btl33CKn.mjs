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
  if (!checkRole(user, [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR])) {
    return Astro2.redirect("/403");
  }
  const { id } = Astro2.params;
  const res = await db.execute({
    sql: `SELECT p.patientId, u.firstName, u.lastName, u.email,
               p.dateOfBirth, p.gender, p.bloodType, p.allergies,
               p.weight, p.height, p.isAthlete, p.schoolLevel
        FROM Patients p JOIN Users u ON p.patientId = u.userId
        WHERE p.patientId = ?`,
    args: [String(id)]
  });
  if (res.rows.length === 0) {
    return Astro2.redirect("/404");
  }
  const p = res.rows[0];
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const dateOfBirth = data.get("dateOfBirth");
    const gender = data.get("gender");
    const bloodType = data.get("bloodType");
    const allergies = data.get("allergies");
    const weight = data.get("weight");
    const height = data.get("height");
    const isAthlete = data.get("isAthlete") === "1" ? 1 : 0;
    const schoolLevel = data.get("schoolLevel");
    await db.execute({
      sql: `UPDATE Users SET firstName = ?, lastName = ?, email = ? WHERE userId = ?`,
      args: [firstName, lastName, email, String(id)]
    });
    await db.execute({
      sql: `UPDATE Patients SET dateOfBirth = ?, gender = ?, bloodType = ?, allergies = ?,
                weight = ?, height = ?, isAthlete = ?, schoolLevel = ?
          WHERE patientId = ?`,
      args: [dateOfBirth, gender, bloodType, allergies, weight, height, isAthlete, schoolLevel, String(id)]
    });
    return Astro2.redirect(`/patients/${id}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Paciente: ${p.firstName} ${p.lastName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2"> <a${addAttribute(`/patients/${id}`, "href")} class="hover:text-teal-600 transition-colors">Expediente del Paciente</a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-teal-700">Editar Datos</span> </div> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Editar Paciente</h1> <p class="text-slate-500 mt-1">Expediente #${String(id).padStart(4, "0")} — ${p.firstName} ${p.lastName}</p> </div> <form method="POST" class="max-w-3xl space-y-8"> <!-- Datos Personales --> <div class="glass-card rounded-2xl p-6"> <h2 class="text-lg font-bold text-slate-800 mb-5 border-b border-white/60 pb-3">Datos Personales</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nombre(s)</label> <input type="text" name="firstName"${addAttribute(String(p.firstName), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Apellidos</label> <input type="text" name="lastName"${addAttribute(String(p.lastName), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label> <input type="email" name="email"${addAttribute(String(p.email), "value")} required class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Fecha de Nacimiento</label> <input type="date" name="dateOfBirth"${addAttribute(String(p.dateOfBirth || "").split("T")[0], "value")} class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Género</label> <select name="gender" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="M"${addAttribute(p.gender === "M", "selected")}>Masculino</option> <option value="F"${addAttribute(p.gender === "F", "selected")}>Femenino</option> <option value="O"${addAttribute(p.gender === "O", "selected")}>Otro</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nivel de Escolaridad</label> <select name="schoolLevel" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">— Sin especificar —</option> <option value="Primaria"${addAttribute(p.schoolLevel === "Primaria", "selected")}>Primaria</option> <option value="Secundaria"${addAttribute(p.schoolLevel === "Secundaria", "selected")}>Secundaria</option> <option value="Preparatoria"${addAttribute(p.schoolLevel === "Preparatoria", "selected")}>Preparatoria</option> <option value="Universidad"${addAttribute(p.schoolLevel === "Universidad", "selected")}>Universidad</option> </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">¿Es Atleta?</label> <select name="isAthlete" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="0"${addAttribute(p.isAthlete !== 1, "selected")}>No</option> <option value="1"${addAttribute(p.isAthlete === 1, "selected")}>Sí — Atleta</option> </select> </div> </div> </div> <!-- Datos Médicos --> <div class="glass-card rounded-2xl p-6"> <h2 class="text-lg font-bold text-slate-800 mb-5 border-b border-white/60 pb-3">Datos Médicos</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Tipo de Sangre</label> <select name="bloodType" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> <option value="">— Desconocido —</option> ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => renderTemplate`<option${addAttribute(bt, "value")}${addAttribute(p.bloodType === bt, "selected")}>${bt}</option>`)} </select> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Peso (kg)</label> <input type="number" step="0.1" name="weight"${addAttribute(String(p.weight), "value")} placeholder="ej. 70.5" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Altura (cm)</label> <input type="number" step="0.1" name="height"${addAttribute(String(p.height), "value")} placeholder="ej. 175" class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"> </div> <div class="md:col-span-2"> <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Alergias conocidas</label> <textarea name="allergies" rows="3" placeholder="Describe alergias medicamentosas o alimentarias relevantes..." class="w-full bg-white/50 border border-slate-200/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm">${p.allergies}</textarea> </div> </div> </div> <div class="flex justify-end gap-4"> <a${addAttribute(`/patients/${id}`, "href")} class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancelar</a> <button type="submit" class="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
Guardar Cambios
</button> </div> </form> ` })}`;
}, "C:/claude-projects/AppMedicoV2/src/pages/patients/edit/[id].astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/patients/edit/[id].astro";
const $$url = "/patients/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
