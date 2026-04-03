import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D6vDkcYE.mjs';
import { manifest } from './manifest_Yf-Lcesk.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/accept-plan.astro.mjs');
const _page2 = () => import('./pages/api/auth/logout.astro.mjs');
const _page3 = () => import('./pages/api/toggle-user-status.astro.mjs');
const _page4 = () => import('./pages/appointments/add.astro.mjs');
const _page5 = () => import('./pages/appointments.astro.mjs');
const _page6 = () => import('./pages/batches/add.astro.mjs');
const _page7 = () => import('./pages/consultations/add.astro.mjs');
const _page8 = () => import('./pages/injuries/add.astro.mjs');
const _page9 = () => import('./pages/injuries.astro.mjs');
const _page10 = () => import('./pages/login.astro.mjs');
const _page11 = () => import('./pages/medications/add.astro.mjs');
const _page12 = () => import('./pages/medications.astro.mjs');
const _page13 = () => import('./pages/notes.astro.mjs');
const _page14 = () => import('./pages/nutrition/discharges/add.astro.mjs');
const _page15 = () => import('./pages/nutrition/followups/add.astro.mjs');
const _page16 = () => import('./pages/nutrition/plans/add.astro.mjs');
const _page17 = () => import('./pages/nutrition/plans/_id_.astro.mjs');
const _page18 = () => import('./pages/nutrition/profiles/add.astro.mjs');
const _page19 = () => import('./pages/nutrition/profiles/_id_.astro.mjs');
const _page20 = () => import('./pages/nutrition/profiles.astro.mjs');
const _page21 = () => import('./pages/patients/add.astro.mjs');
const _page22 = () => import('./pages/patients/_id_.astro.mjs');
const _page23 = () => import('./pages/patients/_patientid_.astro.mjs');
const _page24 = () => import('./pages/patients.astro.mjs');
const _page25 = () => import('./pages/prescriptions/add.astro.mjs');
const _page26 = () => import('./pages/register.astro.mjs');
const _page27 = () => import('./pages/reports.astro.mjs');
const _page28 = () => import('./pages/users/add.astro.mjs');
const _page29 = () => import('./pages/users.astro.mjs');
const _page30 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/accept-plan.ts", _page1],
    ["src/pages/api/auth/logout.ts", _page2],
    ["src/pages/api/toggle-user-status.ts", _page3],
    ["src/pages/appointments/add.astro", _page4],
    ["src/pages/appointments/index.astro", _page5],
    ["src/pages/batches/add.astro", _page6],
    ["src/pages/consultations/add.astro", _page7],
    ["src/pages/injuries/add.astro", _page8],
    ["src/pages/injuries/index.astro", _page9],
    ["src/pages/login.astro", _page10],
    ["src/pages/medications/add.astro", _page11],
    ["src/pages/medications/index.astro", _page12],
    ["src/pages/notes/index.astro", _page13],
    ["src/pages/nutrition/discharges/add.astro", _page14],
    ["src/pages/nutrition/followups/add.astro", _page15],
    ["src/pages/nutrition/plans/add.astro", _page16],
    ["src/pages/nutrition/plans/[id].astro", _page17],
    ["src/pages/nutrition/profiles/add.astro", _page18],
    ["src/pages/nutrition/profiles/[id].astro", _page19],
    ["src/pages/nutrition/profiles/index.astro", _page20],
    ["src/pages/patients/add.astro", _page21],
    ["src/pages/patients/[id].astro", _page22],
    ["src/pages/patients/[patientId].astro", _page23],
    ["src/pages/patients/index.astro", _page24],
    ["src/pages/prescriptions/add.astro", _page25],
    ["src/pages/register.astro", _page26],
    ["src/pages/reports/index.astro", _page27],
    ["src/pages/users/add.astro", _page28],
    ["src/pages/users/index.astro", _page29],
    ["src/pages/index.astro", _page30]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/claude-projects/AppMedicoV2/dist/client/",
    "server": "file:///C:/claude-projects/AppMedicoV2/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
