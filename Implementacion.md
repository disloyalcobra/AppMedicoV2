🧠 PROMPT COMPLETO — IMPLEMENTACIÓN DASHBOARD + SISTEMA CLÍNICO

Quiero que implementes un Dashboard Médico-Administrativo interactivo dentro de mi sistema clínico (Astro + Turso/SQLite), siguiendo buenas prácticas de rendimiento, seguridad (RBAC) y escalabilidad.

El sistema ya cuenta con:

Usuarios con roles (Administrador, Doctor, Nutriólogo, Entrenador)
Relación User_Patient (RBAC por paciente)
Sistema de citas (Appointments)
Disponibilidad (Doctor_Availability)
🎯 OBJETIVO

Construir un dashboard modular, dinámico y exportable, con:

Filtros globales (tiempo y doctor)
Gráficos interactivos (Chart.js)
Datos obtenidos vía API (async)
Exportación por sección (PDF y CSV)
Control de acceso por rol (RBAC)
🏗️ ARQUITECTURA (IMPORTANTE)
🔥 Backend — API UNIFICADA

NO crear múltiples endpoints separados.

👉 Crear UN SOLO endpoint:

/api/reports?range=week|month|year&doctorId=ID

Debe retornar:

{
  "general": {},
  "clinical": {},
  "patients": {},
  "injuries": {},
  "nutrition": {},
  "alerts": {}
}
🔐 RBAC (CRÍTICO)
Si el usuario es Administrador → puede ver todo
Si es Doctor/Nutriólogo/Coach → SOLO sus pacientes

Aplicar en TODAS las queries:

WHERE doctorId = ? -- si no es admin

O usando User_Patient:

JOIN User_Patient up ON up.patientId = p.patientId
WHERE up.userId = ?
📊 MÓDULOS DEL DASHBOARD
1. General
KPIs (total pacientes, citas, etc.)
Citas por estado
Carga semanal
2. Clinical
Diagnósticos más comunes
Síntomas frecuentes
Medicamentos usados
3. Patients
Distribución por edad
Género
Alergias más comunes
4. Injuries
Tipos de lesiones
Zonas del cuerpo (usar barras, NO SVG complejo)
Severidad
5. Nutrition
Cumplimiento de planes
Diagnósticos nutricionales
6. Alerts
Tipos de alertas
Ranking de creadores
⚙️ FRONTEND
📁 Estructura
src/pages/reports/index.astro
src/components/reports/

Componentes:

FiltersBar.astro
GeneralVision.astro
ClinicalModule.astro
PatientsModule.astro
InjuriesModule.astro
NutritionModule.astro
AlertsModule.astro
🎛️ Filtros
Rango de tiempo: semana / mes / año
Doctor (solo visible para admin)

👉 Al cambiar filtros:

hacer fetch a /api/reports
actualizar todos los gráficos
📊 Gráficos

Usar:

npm install chart.js

NO usar CDN.

Tipos:

barras
líneas
pastel
radar
⚡ Performance
Usar un solo request
Implementar cache simple (30–60s)
cacheKey = doctorId + range
🧩 Lazy Loading (recomendado)
Cargar módulos por tabs
No renderizar todo al inicio
📤 EXPORTACIÓN
PDF

Usar:

html2canvas
jsPDF

Cada módulo debe tener botón:
👉 "Descargar PDF"

⚠️ No guardar PDFs en la base de datos

CSV

Permitir descarga de datos tabulares:

.csv

(NO usar .xlsx por ahora)


🧠 BACKEND — LÓGICA
Query base con filtros
filtrar por fecha
filtrar por doctor (si aplica)
IMPORTANTE
Evitar múltiples queries innecesarias
Agrupar datos con GROUP BY
Optimizar consultas
🔒 SEGURIDAD

Validar SIEMPRE:

rol del usuario
acceso a pacientes
datos filtrados correctamente
⚠️ EVITAR

❌ múltiples endpoints para reportes
❌ usar CDN para Chart.js
❌ guardar PDFs en DB
❌ no aplicar RBAC
❌ queries sin filtros
❌ renderizar todo sin control

🧪 TESTING

Validar:

Seguridad
Doctor NO ve datos de otros doctores
Admin ve todo
Performance
cambio de filtros < 500ms
Funcionalidad
gráficos actualizan correctamente
exportación funciona
🚀 RESULTADO ESPERADO

Un dashboard:

dinámico
rápido
seguro (RBAC)
modular
escalable
listo para SaaS
🧠 CONTEXTO FINAL

Este sistema NO es un prototipo.

👉 Debe quedar como:
producto clínico real, mantenible y escalable