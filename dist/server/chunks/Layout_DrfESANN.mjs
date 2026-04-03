import { e as createComponent, m as maybeRenderHead, g as addAttribute, u as unescapeHTML, r as renderTemplate, h as createAstro, k as renderComponent, o as renderHead, p as renderSlot } from './astro/server_DBbqSsVa.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';
import { R as ROLES, c as checkRole } from './checkRole_wmyz_iGO.mjs';

const $$Astro$2 = createAstro();
const $$SideBarLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SideBarLink;
  const { href, label, icon, active = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${active ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md transform translate-x-1" : "text-slate-700 hover:bg-white/40 hover:translate-x-1"}`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 flex-shrink-0">${unescapeHTML(icon)}</svg> <span class="font-medium text-sm">${label}</span> </a>`;
}, "C:/claude-projects/AppMedicoV2/src/components/ui/sidebar/SideBarLink.astro", void 0);

const $$Astro$1 = createAstro();
const $$SideBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SideBar;
  const { user, currentPath } = Astro2.props;
  const ICONS = {
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    patients: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    appointments: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    injuries: '<path d="M12 2v20"/><path d="m14.5 4-5 5"/><path d="m14.5 9.5-5 5"/><path d="m14.5 15-5 5"/>',
    inventory: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/>',
    nutrition: '<path d="M12 22a9 9 0 0 0 9-9c0-4.97-4-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z"/><path d="M12 14c-1.66 0-3-1.34-3-3v0c0-1.66 1.34-3 3-3v0c1.66 0 3 1.34 3 3v0c0 1.66-1.34 3-3 3Z"/><path d="M12 2v2M2 12h2M20 12h2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41"/>',
    notes: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
    reports: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    medical: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
  };
  const links = [
    { href: "/", label: "Dashboard", icon: ICONS.dashboard, roles: Object.values(ROLES) },
    { href: "/patients", label: "Pacientes", icon: ICONS.patients, roles: [ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR] },
    { href: "/appointments", label: "Agenda", icon: ICONS.appointments, roles: [ROLES.DOCTOR, ROLES.STAFF, ROLES.JEFE_MEDICO] },
    { href: "/injuries", label: "Lesiones Globales", icon: ICONS.injuries, roles: [ROLES.JEFE_MEDICO] },
    { href: "/medications", label: "Inventario", icon: ICONS.inventory, roles: [ROLES.STAFF, ROLES.DOCTOR] },
    { href: "/nutrition/profiles", label: "Nutrici\xF3n", icon: ICONS.nutrition, roles: [ROLES.NUTRIOLOGO, ROLES.DOCTOR, ROLES.JEFE_MEDICO] },
    { href: "/notes", label: "Alertas y Notas", icon: ICONS.notes, roles: [ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.JEFE_MEDICO] },
    { href: "/reports", label: "Reportes", icon: ICONS.reports, roles: [ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO] },
    { href: "/users", label: "Usuarios", icon: ICONS.users, roles: [ROLES.JEFE_MEDICO] }
    // Admin default true
  ];
  const visibleLinks = links.filter((link) => checkRole(user, link.roles));
  return renderTemplate`${maybeRenderHead()}<aside class="w-64 glass-strong shadow-2xl flex flex-col min-h-screen border-r border-white/40 z-20 sticky top-0"> <div class="p-6 border-b border-white/30"> <div class="flex items-center gap-3"> <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-sky-500 rounded-xl flex items-center justify-center shadow-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white">${unescapeHTML(ICONS.medical)}</svg> </div> <div> <h1 class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-sky-700">MedApp</h1> <p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sistema Médico</p> </div> </div> </div> <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide"> ${visibleLinks.map((link) => renderTemplate`${renderComponent($$result, "SideBarLink", $$SideBarLink, { "href": link.href, "label": link.label, "icon": link.icon, "active": currentPath === link.href || link.href !== "/" && currentPath.startsWith(link.href) })}`)} </nav> <div class="p-4 border-t border-white/30 mt-auto bg-white/20"> <div class="flex items-center gap-3 px-2 py-2 mb-4"> <div class="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center border border-teal-200 text-teal-800 font-bold capitalize"> ${user?.firstName?.[0] || "U"} </div> <div class="overflow-hidden"> <p class="text-sm font-semibold text-slate-800 truncate">${user?.firstName} ${user?.lastName}</p> <p class="text-xs text-slate-500 truncate">Rol: ${user?.roleId === 1 ? "Admin" : "Usuario"}</p> </div> </div> <a href="/api/auth/logout" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors bg-white/40 border border-white/60 shadow-sm font-medium text-sm w-full justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">${unescapeHTML(ICONS.logout)}</svg> <span>Cerrar Sesión</span> </a> </div> </aside>`;
}, "C:/claude-projects/AppMedicoV2/src/components/ui/sidebar/SideBar.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const user = Astro2.locals.user || null;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | MedApp</title><meta name="theme-color" content="#0d9488">${renderHead()}</head> <body class="min-h-screen bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50 text-slate-800 flex overflow-hidden"> <!-- Animated background blobs behind everything --> <div class="fixed inset-0 opacity-[0.15] pointer-events-none z-0"> <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div> <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div> <div class="absolute bottom-0 left-20 w-[600px] h-[600px] bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div> </div> <!-- Sidebar component receives user data and the active path --> ${renderComponent($$result, "SideBar", $$SideBar, { "user": user, "currentPath": currentPath })} <!-- Main Content Area --> <main class="flex-1 flex flex-col h-screen overflow-hidden relative z-10"> <header class="h-16 glass border-b border-white/40 flex items-center px-8 shadow-sm justify-between shrink-0"> <h2 class="text-xl font-semibold text-slate-800 tracking-tight">${title}</h2> <div class="text-sm font-medium px-3 py-1 bg-white/50 rounded-full border border-teal-100 text-teal-800 shadow-sm flex items-center gap-2"> <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
Sistema Activo
</div> </header> <div class="flex-1 overflow-y-auto p-8 scrollbar-hide"> <div class="max-w-7xl mx-auto pb-12 animate-fade-in"> ${renderSlot($$result, $$slots["default"])} </div> </div> </main> </body></html>`;
}, "C:/claude-projects/AppMedicoV2/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
