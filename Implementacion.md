# Implementación de Sistema Clínico Funcional (Fases 2-7)

Este plan detalla los pasos para transformar el proyecto en un sistema tipo SaaS con control de acceso real (RBAC por paciente), generación de citas con disponibilidad y vinculación dinámica de pacientes, según lo estipulado en `Implementacion.md`.

## User Review Required
> [!IMPORTANT]
> Esta actualización afectará múltiples páginas centrales (`patients`, `appointments`, `nutrition`, `consultations`, `injuries`). Revisa las fases propuestas a continuación para asegurar que las acciones detalladas se alinean exactamente con tu visión.

## Open Questions
> [!WARNING]
> 1. Para la **Fase 4 (Disponibilidad)**, ¿deseas que construya una nueva página (ej. `/settings/availability`) para que los doctores configuren sus horarios, o prefieres que se integre en alguna vista existente del Dashboard?
> 2. Para la **Fase 3 (Vincular Paciente)**, ¿la barra de búsqueda que llamará a `/api/patients/search` debe ir en el directorio de pacientes (`/patients/index.astro`) en forma de un modal "Vincular nuevo paciente"?

## Proposed Changes

### Fase 2: Lógica Backend (RBAC y Vinculación)
Implementaremos la validación de pertenencia en todas las vistas de detalle y la auto-vinculación al crear registros.

#### [MODIFY] Páginas de Creación (`add.astro` en patients, appointments, nutrition/plans, injuries, consultations)
- Agregar query: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, ?)` utilizando el ID del usuario en sesión y el ID del paciente.

#### [MODIFY] Páginas de Detalle (`[id].astro` en todas las carpetas principales)
- Implementar barrera de seguridad antes de mostrar los datos (solo para roles específicos como Doctores, Nutriólogos, Entrenadores):
  ```typescript
  const accessCheck = await db.execute({
    sql: `SELECT 1 FROM User_Patient WHERE userId = ? AND patientId = ?`,
    args: [user.userId, patientId]
  });
  if (accessCheck.rows.length === 0) return Astro.redirect('/403');
  ```

### Fase 3: Búsqueda Global y Vinculación
#### [NEW] [src/pages/api/patients/search.ts](file:///c:/claude-projects/AppMedicoV2/src/pages/api/patients/search.ts)
- Endpoint GET para buscar pacientes por nombre o matrícula que no estén ya vinculados al profesional.

#### [NEW] [src/pages/api/link-patient.ts](file:///c:/claude-projects/AppMedicoV2/src/pages/api/link-patient.ts)
- Endpoint POST para insertar la relación en `User_Patient` al seleccionar un resultado de búsqueda.

#### [MODIFY] [src/pages/patients/index.astro](file:///c:/claude-projects/AppMedicoV2/src/pages/patients/index.astro)
- Modificar las consultas para usar `JOIN User_Patient up ON p.patientId = up.patientId WHERE up.userId = ?`.
- Añadir interfaz visual (Modal/Buscador AJAX) para buscar y vincular pacientes usando los nuevos endpoints.

### Fase 4 y 5: Disponibilidad y Generación de Slots
#### [NEW] [src/pages/api/availability.ts](file:///c:/claude-projects/AppMedicoV2/src/pages/api/availability.ts)
- Endpoint GET/POST para leer y guardar la configuración en `Doctor_Availability`.

#### [NEW] [src/pages/api/slots.ts](file:///c:/claude-projects/AppMedicoV2/src/pages/api/slots.ts)
- Algoritmo que cruza `Doctor_Availability` con las citas ocupadas en `Appointments` para devolver bloques de 30 minutos (u otra duración configurada) libres para un día y doctor específico.

### Fase 6: Citas (Core Renovado)
#### [MODIFY] [src/pages/appointments/add.astro](file:///c:/claude-projects/AppMedicoV2/src/pages/appointments/add.astro)
- Cambiar los inputs estáticos de fecha/hora por un selector dinámico que consume `/api/slots.ts`.
- Guardar citas iniciales con status `'Pendiente'`.

#### [MODIFY] [src/pages/appointments/[id].astro](file:///c:/claude-projects/AppMedicoV2/src/pages/appointments/[id].astro)
- Proveer botones de acción al Doctor: "Confirmar Cita" o "Reagendar" (solicitando `proposedDateTime`).
- Proveer botones de acción al Paciente: "Aceptar" o "Rechazar" si la cita fue reagendada por el doctor.
- Actualizar la BD acorde a las reglas estipuladas.

## Verification Plan

### Manual Verification
1. Ingresar como un **Doctor A**, intentar ver directamente la URL de un paciente del **Doctor B**. Confirmar que redirige a `/403`.
2. Usar la barra de búsqueda para vincular un paciente existente. Confirmar que aparece en la cartera del doctor.
3. Crear un plan nutricional a un paciente no vinculado. Confirmar que automáticamente se vincula.
4. Generar una cita, comprobando que solo se puedan elegir horarios libres (Slots).
5. Como doctor, reagendar la cita a un nuevo horario. Como paciente, aceptarla. Revisar cambios en base de datos de `status`.


⚠️ PROBLEMAS IMPORTANTES (y solución)
🔴 1. RBAC incompleto (falla silenciosa)

Tu validación:

SELECT 1 FROM User_Patient WHERE userId = ? AND patientId = ?

👉 Esto está bien PERO:

❌ Problema:

No distingue roles

👉 Un coach podría acceder como doctor

✅ Solución:
SELECT 1 
FROM User_Patient 
WHERE userId = ? 
AND patientId = ?
AND roleType = ?

👉 Usa el rol de sesión

🔴 2. Auto-vinculación mal ubicada

Estás haciendo esto en:

páginas .astro

👉 ❌ Error de arquitectura

❌ Problema:
lógica duplicada
difícil de mantener
riesgo de inconsistencia
✅ Solución:

Mover a backend/API

👉 Ejemplo:

/api/appointments/create
/api/nutrition/create

Y ahí:

INSERT OR IGNORE INTO User_Patient (...)

👉 Centralizado = limpio

🔴 3. /api/slots.ts (riesgo de race condition)

Tu lógica:

ver slots libres

👉 ❌ Problema:
Dos usuarios pueden tomar el mismo slot

✅ Ya lo mitigaste parcialmente con índice:

✔️ bien hecho

Pero falta:

👉 validar antes de insertar:

SELECT 1 
FROM Appointments
WHERE doctorId = ?
AND dateTime = ?
AND status IN ('Pendiente','Confirmada');
🔴 4. Endpoint search incompleto

Dices:

pacientes que no estén ya vinculados

👉 ❌ pero no pusiste la lógica

✅ Query correcta:
SELECT u.userId, u.firstName, u.lastName
FROM Users u
JOIN Patients p ON u.userId = p.patientId
LEFT JOIN User_Patient up 
  ON up.patientId = p.patientId 
  AND up.userId = ?
WHERE up.patientId IS NULL
AND (
  u.firstName LIKE ?
  OR u.lastName LIKE ?
  OR u.matricula LIKE ?
)
LIMIT 20;
⚠️ RESPUESTAS A TUS OPEN QUESTIONS
🟡 Disponibilidad (Fase 4)

👉 NO lo metas en dashboard existente

💡 Mejor:

👉 ✔️ /settings/availability

Por qué:
es configuración persistente
no es acción diaria
más limpio mentalmente

👉 Opinión directa:
hazlo separado

🟡 Búsqueda global (Fase 3)

👉 ✔️ Modal en /patients/index.astro

Correcto porque:
contexto claro
UX natural
no rompe navegación

👉 buena decisión

🔥 MEJORA PRO (te va a ahorrar problemas)
🧩 Agrega ownership implícito en citas

Cuando creas cita:

INSERT OR IGNORE INTO User_Patient (...)

👉 pero también valida:

👉 que el paciente ya esté vinculado
o permitir auto-vinculación controlada

🔐 Agrega validación por rol en endpoints

Ejemplo:

solo doctor puede confirmar
solo paciente puede aceptar

👉 no lo dejes solo en UI