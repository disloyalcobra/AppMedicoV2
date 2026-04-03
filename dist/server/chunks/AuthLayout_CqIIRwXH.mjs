import { e as createComponent, o as renderHead, p as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_DBbqSsVa.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AuthLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | MedApp</title><!-- Medical Theme Colors --><meta name="theme-color" content="#0d9488">${renderHead()}</head> <body class="min-h-screen bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50 text-slate-800"> <div class="fixed inset-0 opacity-30 pointer-events-none"> <div class="absolute top-0 left-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div> <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div> <div class="absolute bottom-0 left-0 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div> </div> <main class="relative z-10 w-full min-h-screen flex items-center justify-center p-4"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/claude-projects/AppMedicoV2/src/layouts/AuthLayout.astro", void 0);

export { $$AuthLayout as $ };
