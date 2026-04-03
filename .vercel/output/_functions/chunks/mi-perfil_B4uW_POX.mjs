/* empty css               */
import { c as createComponent } from './astro-component_CGUy0Zk-.mjs';
import 'piccolore';
import './sequence_D80S23pC.mjs';
import 'clsx';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';

const $$MiPerfil = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MiPerfil;
  const user = Astro2.locals.user;
  if (!checkRole(user, [ROLES.ESTUDIANTE])) {
    return Astro2.redirect("/403");
  }
  return Astro2.redirect(`/patients/${user.userId}`);
}, "C:/claude-projects/AppMedicoV2/src/pages/mi-perfil.astro", void 0);

const $$file = "C:/claude-projects/AppMedicoV2/src/pages/mi-perfil.astro";
const $$url = "/mi-perfil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MiPerfil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
