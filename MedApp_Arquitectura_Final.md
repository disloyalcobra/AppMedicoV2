**MedApp**

Documento de Arquitectura y Diseño del Sistema

Aplicación Médica con Astro \+ Turso

Versión Final  •  Marzo 2026

# **1\. Visión General del Sistema**

MedApp es una aplicación web completa para la gestión de clínicas médicas con enfoque en población estudiantil y atletas. Combina un módulo clínico tradicional con uno nutricional especializado, permitiendo la colaboración entre múltiples roles de atención médica.

El sistema se construye con Astro como framework principal (SSR) y Turso (SQLite distribuido en la nube) como base de datos, replicando el patrón de arquitectura del proyecto LegacyMuseum: páginas Astro con frontmatter para queries directas a Turso, componentes reutilizables, y rutas dinámicas con \[id\].

## **1.1 Stack Tecnológico**

| Tecnologías Principales |  |
| :---- | :---- |
| **Framework** | Astro (modo SSR con adapter Node.js) |
| **Base de Datos** | Turso — SQLite distribuido en la nube (libsql) |
| **Cliente DB** | @libsql/client — turso.ts centralizado (idéntico a LegacyMuseum) |
| **Estilos** | Tailwind CSS |
| **Autenticación** | Manejo de sesiones con cookies firmadas \+ middleware Astro |
| **Despliegue** | Vercel / Netlify / Railway (compatible con SSR Astro) |

# **2\. Análisis de la Base de Datos**

La base de datos está compuesta por 17 tablas organizadas en 6 módulos funcionales. Se describen las tablas, sus campos clave y las relaciones entre módulos.

## **2.1 Módulo de Usuarios y Acceso**

| Tablas: Roles \+ Users |  |
| :---- | :---- |
| **Roles** | Define 7 tipos de usuario: Administrador, Jefe Médico, Doctor, Nutriólogo, Estudiante, Staff, Entrenador. |
| **Users** | Almacena todos los usuarios del sistema. Cada usuario tiene un roleId que determina qué puede hacer en la app. |
| **Relación** | Un User pertenece a exactamente un Role. El roleId es la clave de control de acceso en toda la aplicación. |

## **2.2 Módulo de Pacientes y Perfiles**

| Tablas: Patients \+ Coach\_Athlete |  |
| :---- | :---- |
| **Patients** | Extiende Users con datos médicos: fecha de nacimiento, género, tipo de sangre, alergias, peso, altura, nivel escolar. El campo isAthlete (0/1) distingue entre paciente regular y atleta. |
| **Coach\_Athlete** | Tabla Many-to-Many entre Entrenadores y Pacientes Atletas. Permite a un entrenador monitorear múltiples atletas. |
| **Relación** | Un Patient es siempre un User (patientId \= userId). Un Coach es un User con roleId \= Entrenador. |

## **2.3 Módulo Clínico**

| Tablas: Appointments, Consultations, ClinicalFiles, Prescriptions |  |
| :---- | :---- |
| **Appointments** | Citas médicas con estado: Pendiente, Completada, Cancelada. Vincula un paciente con un doctor en fecha/hora específica. |
| **Consultations** | Registro de la consulta realizada: diagnóstico, síntomas, fecha. Depende de un Appointment. |
| **ClinicalFiles** | Archivos adjuntos a una consulta: rayos X, resultados de laboratorio, PDFs. Almacena la URL del archivo. |
| **Prescriptions** | Recetas médicas emitidas en una consulta: medicamento, dosis, frecuencia, duración. Ligadas a la Consultation donde fueron creadas. |
| **Flujo** | Appointment → (Completada) → Consultation → ClinicalFiles y Prescriptions |

## **2.4 Módulo de Lesiones**

| Tabla: Injuries (NUEVA) |  |
| :---- | :---- |
| **patientId** | Paciente afectado — obligatorio. |
| **consultationId** | Consulta donde se diagnosticó la lesión — obligatorio. |
| **coachId** | Entrenador asignado al atleta — nullable, visible solo si isAthlete=1. |
| **campusLocation** | Ubicación en el campus donde ocurrió: Cancha de Futbol, Gimnasio, Alberca, Pista, Aula, Área común, Fuera del campus, Otro. |
| **sport** | Deporte practicado al momento de la lesión — nullable, solo si isAthlete=1. |
| **injuryType / bodyZone** | Tipo de lesión (Esguince, Fractura, Desgarro, etc.) y zona del cuerpo afectada. |
| **severity** | Severidad: Leve, Moderada, Grave. |
| **injuryDate / estimatedRecovery** | Fecha de la lesión y fecha estimada de recuperación. |
| **requiresInsurance** | Flag 0/1 — ¿necesita cobertura de seguro médico? |
| **insuranceNotes** | Datos de póliza o aseguradora — nullable, aplica solo si requiresInsurance=1. |
| **status** | Estado: Activa, En recuperación, Recuperada (default: Activa). |

| 🏋️ COACH ALERT | Al registrar una lesión de atleta con coachId, el sistema crea automáticamente una CollaborativeNote con isAlert=1 dirigida al entrenador, con tipo de lesión, severidad y fechas. |
| :---: | :---- |

## **2.5 Módulo de Inventario y Recetas**

| Tablas: Medications, Batches |  |
| :---- | :---- |
| **Medications** | Catálogo de medicamentos: nombre comercial, ingrediente activo, presentación, stock actual, punto de reorden para alertas. |
| **Batches** | Lotes de medicamento: cantidad, fecha de entrada y vencimiento para control de caducidad. |
| **Relación** | Un Medication tiene muchos Batches. Las Prescriptions (módulo clínico) referencian Medications para descontar stock al emitir una receta. |

## **2.6 Módulo de Nutrición**

| Tablas: NutritionalProfiles, NutritionalPlans, NutritionalFollowUps, NutritionalDischarges |  |
| :---- | :---- |
| **NutritionalProfiles** | Evaluación inicial: circunferencia de cintura, % grasa, nivel de actividad, historial familiar, recordatorio 24h, diagnóstico nutricional y riesgo metabólico. |
| **NutritionalPlans** | Plan asignado por Nutriólogo: calorías, distribución de macros, menú semanal (JSON), equivalencias, recomendaciones y PDF. El paciente debe aceptar el plan (patientAccepted=1). |
| **NutritionalFollowUps** | Seguimientos: peso actual, IMC, medidas corporales (JSON), % cumplimiento, ajustes y nuevas metas. |
| **NutritionalDischarges** | Alta nutricional: si se alcanzó la meta, peso logrado, duración del tratamiento, razón del alta. |
| **Flujo** | NutritionalProfile → NutritionalPlan (aceptado) → (N) FollowUps → Discharge |

## **2.7 Módulo de Integración y Alertas**

| Tabla: CollaborativeNotes |  |
| :---- | :---- |
| **CollaborativeNotes** | Notas compartidas entre profesionales sobre un paciente. Pueden marcarse como alertas con etiquetas (ej. 'alergia grave', 'lesión', 'riesgo nutricional'). |
| **isAlert** | Cuando es 1, la nota se convierte en alerta visible para todos los roles con acceso al paciente. |
| **Uso clave** | Doctor avisa al Nutriólogo de contraindicación. Entrenador notifica lesión. Sistema genera alerta automática de lesión de atleta. |

# **3\. Roles, Flujos e Interfaz por Usuario**

## **3.1 Tabla de Roles y Permisos**

| Rol | Permisos Principales | Módulos con Acceso |
| :---- | :---- | :---- |
| **Administrador** | Acceso total al sistema | Todos los módulos \+ Configuración de usuarios |
| **Jefe Médico** | Supervisión clínica y de usuarios | Consultas, Expedientes, Usuarios, Alertas, Reportes |
| **Doctor** | Gestión completa de sus pacientes | Pacientes, Citas, Consultas, Recetas, Lesiones, Notas |
| **Nutriólogo** | Planes y seguimiento nutricional | Perfiles Nutricionales, Planes, Seguimientos, Altas |
| **Entrenador** | Monitoreo de atletas asignados | Atletas asignados, Lesiones (lectura), Notas Colaborativas |
| **Estudiante** | Acceso a su propio expediente | Dashboard personal, Citas, Consultas, Lesiones propias |
| **Staff** | Operación administrativa | Agenda, Inventario, Alertas de stock |

## **3.2 Doctor**

El Doctor es el rol central del módulo clínico. Su punto de entrada es la lista de pacientes asignados. Al seleccionar un paciente llega a su hub central desde donde gestiona todo el expediente clínico.

### **Flujo principal del Doctor**

* Inicia sesión → Dashboard con citas del día y alertas activas

* Navega a /patients → lista de sus pacientes asignados

* Selecciona un paciente → llega a /patients/\[id\] (hub central con 4 secciones)

* Desde el hub puede acceder directamente a: Citas, Consultas, Recetas, Lesiones

* Al terminar la consulta puede agregar una CollaborativeNote o alerta al paciente

### **Interfaz del Doctor — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/patients (lista)** | Ver todos sus pacientes. Buscar por nombre. Click en un paciente → va a /patients/\[id\] |
| **/patients/\[id\] — Header** | Ver datos del paciente: nombre, edad, sangre, alergias, peso, altura. Badge ATLETA si isAthlete=1 |
| **/patients/\[id\] — Citas** | Ver todas las citas del paciente (fecha, doctor, estado). Botón \+ Nueva Cita. Botón Editar cita existente |
| **/patients/\[id\] — Consultas** | Ver lista de consultas (fecha, diagnóstico resumido, conteo de recetas y archivos). Botón \+ Nueva Consulta. Botón Ver/Editar consulta |
| **/patients/\[id\] — Recetas** | Ver todas las recetas del paciente agrupadas por consulta (medicamento, dosis, frecuencia, duración). Botón \+ Nueva Receta desde aquí. Botón Editar receta. Botón Eliminar receta |
| **/patients/\[id\] — Lesiones** | Ver lista de lesiones (campus, deporte si atleta, tipo, zona, severidad, seguro, estado). Botón \+ Nueva Lesión. Botón Ver/Editar lesión |
| **/consultations/\[id\]** | Ver diagnóstico y síntomas completos. Editar campos. Ver y gestionar ClinicalFiles. Ver y gestionar Recetas de esa consulta |
| **/appointments/\[id\]** | Editar fecha, hora, doctor asignado y estado de la cita (Pendiente/Completada/Cancelada) |
| **/injuries/add** | Crear lesión: campus, tipo, zona, severidad, fechas, tratamiento. Si atleta: deporte \+ selector de coach. Si seguro: notas de póliza |
| **/injuries/\[id\]** | Ver y editar todos los campos de la lesión. Cambiar estado de recuperación |
| **Panel de alertas** | Ver CollaborativeNotes con isAlert=1 del paciente en todos los módulos. Crear nueva nota o alerta |

### **Acciones disponibles desde /patients/\[id\] (hub central)**

* Botón \+ Nueva Cita → /appointments/add con patientId pre-llenado

* Botón \+ Nueva Consulta → /consultations/add con patientId pre-llenado

* Botón \+ Nueva Receta → formulario con patientId pre-llenado (selecciona consulta)

* Botón \+ Nueva Lesión → /injuries/add con patientId pre-llenado

* En la sección Citas: botón Editar en cada fila → /appointments/\[id\]

* En la sección Consultas: botón Ver/Editar en cada fila → /consultations/\[id\]

* En la sección Recetas: botón Editar en cada fila → edita dosis, frecuencia, duración

* En la sección Lesiones: botón Ver/Editar en cada fila → /injuries/\[id\]

## **3.3 Nutriólogo**

### **Flujo del Nutriólogo**

* Dashboard → lista de pacientes con perfil nutricional activo o pendiente

* Selecciona paciente → crea NutritionalProfile con evaluación inicial

* Genera NutritionalPlan: calorías, macros, menú semanal

* Paciente acepta el plan (patientAccepted \= 1\)

* Registra NutritionalFollowUps en cada cita de seguimiento

* Cierra el ciclo con NutritionalDischarge al alcanzar la meta o por abandono

### **Interfaz del Nutriólogo — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/nutrition/profiles** | Ver lista de perfiles nutricionales. Crear nuevo perfil. Ver estado de cada paciente |
| **/nutrition/profiles/\[id\]** | Ver y editar evaluación inicial: IMC, circunferencia, % grasa, historial, diagnóstico nutricional |
| **/nutrition/plans/add** | Crear plan: calorías, distribución de macros, menú semanal en JSON, equivalencias, recomendaciones |
| **/nutrition/plans/\[id\]** | Ver plan completo. Editar campos. Ver si el paciente ya aceptó. Descargar PDF del plan |
| **/nutrition/followups/add** | Registrar seguimiento: peso actual, IMC, medidas, % cumplimiento, ajustes y nuevas metas |
| **/nutrition/discharges/add** | Registrar alta: meta alcanzada, peso logrado, duración, recomendaciones de mantenimiento |
| **CollaborativeNotes** | Leer alertas del doctor sobre contraindicaciones. Escribir notas al doctor o entrenador |

## **3.4 Entrenador**

### **Flujo del Entrenador**

* Dashboard → lista de sus atletas asignados (Coach\_Athlete)

* Selecciona atleta → ve su expediente en modo lectura: citas recientes, consultas, lesiones activas

* Recibe CollaborativeNote de alerta cuando el doctor registra una lesión del atleta

* Puede agregar CollaborativeNotes sobre rendimiento o incidentes en práctica

### **Interfaz del Entrenador — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/patients (mis atletas)** | Ver solo los atletas asignados a él (filtrado por Coach\_Athlete). No ve otros pacientes |
| **/patients/\[id\] — Lesiones** | Ver lista de lesiones del atleta: tipo, campus, deporte, severidad, estado, fechas. Solo lectura — no puede editar ni crear |
| **/patients/\[id\] — Citas** | Ver citas del atleta. Solo lectura — no puede editar ni agendar |
| **/patients/\[id\] — Consultas** | Ver consultas del atleta. Solo lectura — no puede editar |
| **CollaborativeNotes** | Leer alertas de lesiones que le fueron enviadas. Escribir notas sobre rendimiento o incidentes del atleta |
| **Alertas en Dashboard** | Recibe notificación cuando se registra una lesión de alguno de sus atletas (isAlert=1) |

## **3.5 Estudiante / Paciente**

### **Flujo del Estudiante**

* Dashboard personal → próximas citas y resumen de su estado de salud

* Consulta su historial: consultas pasadas, recetas activas, lesiones

* Cuando el Nutriólogo crea un plan, puede aceptarlo desde su interfaz

* No puede crear ni editar ningún registro médico

### **Interfaz del Estudiante — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **Dashboard personal** | Próximas citas, alertas del médico, resumen de peso e IMC si tiene perfil nutricional |
| **Mis Citas** | Ver sus citas (fecha, doctor, estado). Solo lectura — no puede agendar ni editar |
| **Mis Consultas** | Ver sus consultas y diagnósticos. Solo lectura |
| **Mis Recetas** | Ver recetas emitidas: medicamento, dosis, frecuencia, duración. Solo lectura |
| **Mis Lesiones** | Ver sus lesiones: tipo, campus, severidad, estado, fecha estimada de recuperación. Solo lectura |
| **Mi Plan Nutricional** | Ver el plan asignado por el Nutriólogo. Botón ACEPTAR PLAN si patientAccepted=0 |
| **Notas y Alertas** | Ver CollaborativeNotes que le fueron dirigidas (ej. indicaciones post-consulta) |

## **3.6 Staff**

### **Interfaz del Staff — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/appointments** | Ver agenda completa de todos los doctores. Agendar citas. Editar fecha/hora/estado. Cancelar citas |
| **/medications** | Ver inventario de medicamentos. Ver alertas de stock bajo (currentStock \<= reorderPoint) |
| **/medications/add** | Agregar nuevo medicamento al catálogo |
| **/batches/add** | Registrar nuevo lote de medicamento: cantidad, fecha de entrada, fecha de vencimiento |
| **Dashboard** | Ver alertas de stock crítico y citas del día para gestión administrativa |

## **3.7 Jefe Médico y Administrador**

### **Interfaz del Jefe Médico — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/patients** | Ver todos los pacientes del sistema, sin importar el doctor asignado |
| **/injuries (global)** | Ver listado global de lesiones con filtros por campus, severidad, deporte — para reportes de accidentabilidad |
| **/users** | Ver listado de usuarios. Asignar roles. Activar/desactivar cuentas |
| **Reportes** | Ver reportes de citas completadas, lesiones por campus, stock de medicamentos |
| **CollaborativeNotes** | Leer todas las alertas activas del sistema |

### **Interfaz del Administrador — Lo que ve y puede hacer**

| Sección / Página | Acciones disponibles en la interfaz |
| :---- | :---- |
| **/users/add** | Crear nuevos usuarios con cualquier rol |
| **/users/\[id\]** | Editar usuario: nombre, email, rol, estado |
| **Configuración** | Gestionar Roles, opciones del sistema |
| **Acceso total** | Puede ver y editar cualquier módulo del sistema sin restricciones |

# **4\. Estructura del Proyecto Astro**

La estructura sigue exactamente el patrón de LegacyMuseum: carpetas por entidad dentro de src/pages/, componentes reutilizables en src/components/, y un archivo turso.ts centralizado para la conexión a la base de datos.

## **4.1 Raíz del Proyecto**

| Ruta / Archivo | Descripción |
| :---- | :---- |
| src/turso.ts | Cliente Turso — igual a LegacyMuseum: turso (producción) y devClient (desarrollo) |
| src/middleware.ts | Middleware Astro: protección de rutas por rol, lectura de cookie de sesión |
| src/layouts/Layout.astro | Layout principal con Sidebar y navegación por rol |
| src/layouts/AuthLayout.astro | Layout sin sidebar para login/registro |
| .env | TURSO\_DATABASE\_URL, TURSO\_AUTH\_TOKEN, SESSION\_SECRET |
| astro.config.mjs | Config Astro con output: server y adapter Node.js |

## **4.2 Páginas — src/pages/**

| Ruta / Archivo | Descripción |
| :---- | :---- |
| src/pages/index.astro | Dashboard — resumen del día, citas, alertas activas, stock crítico |
| src/pages/login.astro | Inicio de sesión |
| src/pages/register.astro | Registro de nuevos usuarios (solo Admin) |
| src/pages/404.astro | Página de error 404 |
| src/pages/patients/index.astro | Lista de pacientes (filtrada por rol del usuario logueado) |
| src/pages/patients/\[patientId\].astro | Hub central del paciente — 4 secciones: Citas, Consultas, Recetas, Lesiones |
| src/pages/patients/add.astro | Formulario POST para registrar nuevo paciente |
| src/pages/patients/delete.astro | Confirmar y eliminar paciente |
| src/pages/appointments/index.astro | Lista completa de citas (filtrable por doctor, fecha, estado) |
| src/pages/appointments/\[appointmentId\].astro | Editar cita: fecha, hora, doctor, estado |
| src/pages/appointments/add.astro | Agendar nueva cita (patientId pre-llenado desde hub del paciente) |
| src/pages/appointments/delete.astro | Cancelar cita con confirmación |
| src/pages/consultations/\[consultationId\].astro | Ver \+ editar consulta \+ gestionar Recetas \+ ClinicalFiles |
| src/pages/consultations/add.astro | Registrar nueva consulta vinculada a una cita |
| src/pages/consultations/delete.astro | Eliminar consulta (solo si no tiene recetas) |
| src/pages/prescriptions/add.astro | Emitir receta — selecciona medicamento, dosis, frecuencia, duración |
| src/pages/prescriptions/\[prescriptionId\].astro | Editar receta existente |
| src/pages/prescriptions/delete.astro | Eliminar receta con confirmación |
| src/pages/injuries/index.astro | Lista global de lesiones (Admin / Jefe Médico — con filtros) |
| src/pages/injuries/add.astro | Crear lesión — campos dinámicos según isAthlete y requiresInsurance |
| src/pages/injuries/\[injuryId\].astro | Ver \+ editar lesión completa |
| src/pages/injuries/delete.astro | Eliminar lesión con confirmación |
| src/pages/medications/index.astro | Inventario de medicamentos con alertas de stock bajo |
| src/pages/medications/add.astro | Agregar nuevo medicamento al catálogo |
| src/pages/medications/\[medicationId\].astro | Editar medicamento |
| src/pages/batches/add.astro | Registrar lote: cantidad, entrada, vencimiento |
| src/pages/nutrition/profiles/index.astro | Lista de perfiles nutricionales |
| src/pages/nutrition/profiles/add.astro | Crear perfil nutricional inicial |
| src/pages/nutrition/profiles/\[profileId\].astro | Ver y editar perfil nutricional |
| src/pages/nutrition/plans/add.astro | Crear plan nutricional |
| src/pages/nutrition/plans/\[planId\].astro | Ver plan, editar, descargar PDF |
| src/pages/nutrition/followups/add.astro | Registrar seguimiento nutricional |
| src/pages/nutrition/discharges/add.astro | Registrar alta nutricional |
| src/pages/notes/index.astro | Notas y alertas colaborativas del paciente |
| src/pages/notes/add.astro | Agregar nota o alerta dirigida a otro profesional |
| src/pages/users/index.astro | Gestión de usuarios del sistema (Admin / Jefe Médico) |
| src/pages/users/add.astro | Crear usuario con rol asignado |
| src/pages/users/\[userId\].astro | Editar usuario: nombre, email, rol, estado |

## **4.3 Componentes — src/components/**

| Ruta / Archivo | Descripción |
| :---- | :---- |
| src/components/ui/sidebar/SideBar.astro | Sidebar con links filtrados según rol activo |
| src/components/ui/sidebar/SideBarLink.astro | Link individual del sidebar con ícono |
| src/components/ui/sidebar/MiniProfile.astro | Avatar y nombre del usuario logueado |
| src/components/ui/Buttons/AddRegisterBtn.astro | Botón '+' para agregar registro |
| src/components/ui/Buttons/SubmitBtn.astro | Botón de envío de formulario |
| src/components/ui/Buttons/BackBtn.astro | Botón de regresar |
| src/components/ui/Forms/Form.astro | Wrapper de formulario HTML |
| src/components/ui/Forms/FormInput.astro | Input reutilizable con label |
| src/components/ui/Forms/FormSelect.astro | Select reutilizable con opciones |
| src/components/ui/Tables/ItemStatus.astro | Badge de estado con color según valor |
| src/components/ui/Tables/EditRecord.astro | Botón de editar registro en tabla |
| src/components/Patient/PatientHeader.astro | Header con datos clave \+ badge ATLETA |
| src/components/Patient/PatientTabs.astro | Tabs del hub: Citas | Consultas | Recetas | Lesiones |
| src/components/Patient/PatientForm.astro | Formulario completo de registro de paciente |
| src/components/Appointment/AppointmentForm.astro | Formulario de cita médica |
| src/components/Consultation/ConsultationForm.astro | Formulario de consulta (diagnóstico, síntomas) |
| src/components/Consultation/PrescriptionList.astro | Lista de recetas de una consulta con CRUD inline |
| src/components/Consultation/ClinicalFileList.astro | Lista de archivos adjuntos con upload |
| src/components/Injury/InjuryForm.astro | Formulario de lesión con campos dinámicos |
| src/components/Injury/CoachSelector.astro | Dropdown de coaches del paciente (solo atletas) |
| src/components/Injury/SeverityBadge.astro | Badge: Leve (verde) | Moderada (amarillo) | Grave (rojo) |
| src/components/Injury/InsuranceFields.astro | Campos de seguro — aparece solo si requiresInsurance=1 |
| src/components/Medication/MedicationForm.astro | Formulario de medicamento |
| src/components/Medication/StockAlert.astro | Badge de alerta cuando stock \<= reorderPoint |
| src/components/Nutrition/NutritionalProfileForm.astro | Formulario de evaluación nutricional inicial |
| src/components/Nutrition/NutritionalPlanForm.astro | Formulario de plan nutricional |
| src/components/Nutrition/FollowUpForm.astro | Formulario de seguimiento nutricional |
| src/components/Dashboard/StatsCard.astro | Tarjeta de estadística del dashboard |
| src/components/Dashboard/AlertBanner.astro | Banner de alertas activas (stock, lesiones, notas) |
| src/components/ui/icons/ | Íconos SVG por módulo (igual patrón que LegacyMuseum) |

## **4.4 Funciones de Utilidad — src/functions/**

| Ruta / Archivo | Descripción |
| :---- | :---- |
| src/functions/ConvertPatientData.ts | Transforma rows de Turso a objetos Patient tipados |
| src/functions/ConvertAppointmentData.ts | Parser de datos de citas con join de Users |
| src/functions/ConvertConsultationData.ts | Parser de consultas con conteo de recetas y archivos |
| src/functions/ConvertInjuryData.ts | Parser de lesiones con datos de coach si aplica |
| src/functions/ConvertNutritionData.ts | Parser de perfiles y planes nutricionales |
| src/functions/getSession.ts | Obtiene usuario logueado desde cookie de sesión |
| src/functions/checkRole.ts | Verifica si el usuario tiene permiso para una acción o ruta |
| src/functions/stockAlerts.ts | Detecta medicamentos con currentStock \<= reorderPoint |
| src/functions/createInjuryAlert.ts | Crea CollaborativeNote de alerta al coach al registrar lesión de atleta |

# **5\. Patrón de Implementación (igual a LegacyMuseum)**

Cada página sigue el mismo patrón del proyecto de referencia: el frontmatter de Astro maneja tanto la lógica GET (queries a Turso) como la lógica POST (inserciones/actualizaciones), y el template HTML renderiza los datos directamente.

## **5.1 Página de Lista (index.astro)**

| Patrón: GET → Query Turso → Render tabla |  |
| :---- | :---- |
| **Frontmatter** | import { turso } from 'src/turso' → ejecuta SELECT \+ JOINs → convierte a JSON → pasa al template |
| **Template** | Tabla HTML con .map() sobre los resultados → botones Editar y Eliminar por fila |
| **Ejemplo** | SELECT Patients.\*, Users.firstName FROM Patients JOIN Users ON Patients.patientId \= Users.userId |

## **5.2 Página de Agregar (add.astro)**

| Patrón: POST → Insert Turso → Redirect |  |
| :---- | :---- |
| **Frontmatter** | if (Astro.request.method \=== 'POST') { formData → turso.execute(INSERT) → Astro.redirect('/ruta') } |
| **Template** | Componente Form con inputs → action='' method='POST' |
| **Ejemplo** | INSERT INTO Appointments (patientId, doctorId, dateTime, status) VALUES (...) |

## **5.3 Página de Detalle / Editar (\[id\].astro)**

| Patrón: GET params → Query → Render | POST → Update → Redirect |  |
| :---- | :---- |
| **GET** | const { patientId } \= Astro.params → SELECT WHERE patientId \= ? → mostrar formulario pre-llenado |
| **POST** | if POST → leer formData → UPDATE tabla WHERE id \= ? → redirect a lista o hub del paciente |
| **Ejemplo** | UPDATE Injuries SET status=?, estimatedRecovery=? WHERE injuryId=? |

## **5.4 Página de Eliminar (delete.astro)**

| Patrón: GET con query param → Confirmación → POST → DELETE → Redirect |  |
| :---- | :---- |
| **GET** | Astro.url.searchParams.get('id') → mostrar modal de confirmación con nombre del registro |
| **POST** | DELETE FROM tabla WHERE id=? → Astro.redirect('/lista') |
| **Nota** | Igual al patrón de LegacyMuseum: delete.astro recibe el ID por query string desde la tabla |

## **5.5 Hub del Paciente (/patients/\[patientId\].astro)**

| Patrón especial: múltiples queries \+ render condicional por rol |  |
| :---- | :---- |
| **Queries** | Una query por sección: citas, consultas (con count de recetas), recetas, lesiones del paciente |
| **Render por rol** | Si roleId \= Doctor: muestra botones de crear/editar. Si roleId \= Entrenador: solo lectura. Si roleId \= Estudiante: solo sus propios datos |
| **Tabs** | Implementadas con radio buttons CSS o Alpine.js para cambiar entre secciones sin recargar |
| **patientId** | Todos los botones \+ Nueva Cita / Consulta / Receta / Lesión pasan el patientId como query param o hidden input |

# **6\. Funcionalidades Especiales**

## **6.1 Control de Acceso por Rol**

El middleware Astro intercepta cada request, extrae el rol de la cookie de sesión, y redirige a 403 si el usuario no tiene permiso para la ruta solicitada.

* Rutas /admin/\* y /users/\* → solo Administrador y Jefe Médico

* Rutas /nutrition/\* → Nutriólogo \+ Doctor \+ Jefe Médico

* Rutas /injuries/add → solo Doctor

* Rutas /injuries/\* (lectura) → Doctor \+ Entrenador (sus atletas) \+ Estudiante (sus propias)

* Rutas /medications/\* → Staff \+ Doctor \+ Administrador

* Rutas /patients/\[id\] → Doctor asignado \+ Nutriólogo \+ Entrenador asignado \+ el propio Paciente

## **6.2 Formulario de Lesión — Campos Dinámicos**

El formulario /injuries/add.astro adapta los campos visibles según las características del paciente:

* Todos los pacientes: campus, tipo de lesión, zona, severidad, fechas, tratamiento, observaciones, estado

* Si isAthlete=1: se agregan los campos deporte y selector de entrenador (cargado desde Coach\_Athlete)

* Si requiresInsurance=1 (checkbox): se activa el campo de notas de seguro médico / póliza

## **6.3 Alerta Automática al Entrenador**

Al guardar una lesión de atleta con coachId seleccionado, la función createInjuryAlert.ts ejecuta un INSERT en CollaborativeNotes con isAlert=1, alertTags='lesión', dirigida al coachId. El entrenador verá la alerta en su dashboard la próxima vez que ingrese.

## **6.4 Alertas de Stock**

La página /medications/index.astro compara currentStock con reorderPoint para cada medicamento y muestra un badge rojo cuando el stock está por debajo del umbral. El componente AlertBanner.astro en el dashboard muestra estas alertas globalmente para Staff y Administrador.

## **6.5 Recetas Ligadas a Consultas**

Las Prescriptions se gestionan siempre dentro del contexto de una Consultation. El doctor puede ver y gestionar las recetas de un paciente desde dos lugares: la sección Recetas del hub del paciente (/patients/\[id\]) que muestra todas agrupadas, o directamente en /consultations/\[id\] donde puede crear, editar y eliminar recetas de esa consulta específica.

## **6.6 Plan Nutricional con Aceptación del Paciente**

Un NutritionalPlan tiene patientAccepted=0 por defecto. Solo cuando el paciente confirma el plan desde su interfaz se actualiza a 1, lo cual desbloquea el registro de seguimientos y el alta nutricional.

# **7\. SQL — Nueva Tabla Injuries**

Agregar al final del schema.sql existente. El total de tablas pasa de 16 a 17\.

| \-- ─── MÓDULO DE LESIONES ──────────────────────────────────────────── CREATE TABLE IF NOT EXISTS Injuries (   injuryId           INTEGER PRIMARY KEY AUTOINCREMENT,   patientId          INTEGER NOT NULL,   consultationId     INTEGER NOT NULL,   coachId            INTEGER,           \-- nullable; solo si isAthlete=1   campusLocation     TEXT NOT NULL,     \-- 'Cancha de Futbol','Gimnasio','Alberca',                                         \-- 'Pista de Atletismo','Laboratorio','Aula',                                         \-- 'Área común','Fuera del campus','Otro'   sport              TEXT,              \-- nullable; solo si isAthlete=1                                         \-- 'Futbol','Basquetbol','Natación',etc.   injuryType         TEXT NOT NULL,     \-- 'Esguince','Fractura','Desgarro',                                         \-- 'Contusión','Luxación','Otro'   bodyZone           TEXT NOT NULL,     \-- 'Rodilla','Tobillo','Hombro',etc.   severity           TEXT NOT NULL                      CHECK(severity IN ('Leve','Moderada','Grave')),   injuryDate         DATE NOT NULL,   estimatedRecovery  DATE,              \-- nullable   requiresInsurance  INTEGER NOT NULL DEFAULT 0,  \-- 0=No, 1=Sí   insuranceNotes     TEXT,              \-- nullable; solo si requiresInsurance=1   treatment          TEXT,   observations       TEXT,   status             TEXT NOT NULL DEFAULT 'Activa'                      CHECK(status IN ('Activa','En recuperación','Recuperada')),   createdAt          DATETIME NOT NULL DEFAULT CURRENT\_TIMESTAMP,   FOREIGN KEY (patientId)      REFERENCES Patients(patientId),   FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),   FOREIGN KEY (coachId)        REFERENCES Users(userId) ); |
| :---- |

# **8\. Configuración e Inicialización**

## **8.1 Variables de Entorno (.env)**

| Variables requeridas |  |
| :---- | :---- |
| **TURSO\_DATABASE\_URL** | URL de la base de datos Turso (ej. libsql://nombre-org.turso.io) |
| **TURSO\_AUTH\_TOKEN** | Token de autenticación Turso |
| **SESSION\_SECRET** | Clave para firmar cookies de sesión |

## **8.2 Inicialización de la Base de Datos**

Ejecutar el SQL del schema en Turso CLI para crear las 17 tablas, luego hacer INSERT de los Roles y crear el primer usuario Administrador.

* turso db shell \[nombre-db\] \< schema.sql

* INSERT INTO Roles VALUES (1,'Administrador'),(2,'Jefe Médico'),(3,'Doctor'),(4,'Nutriólogo'),(5,'Estudiante'),(6,'Staff'),(7,'Entrenador')

* INSERT INTO Users (firstName, lastName, email, password, roleId) VALUES ('Admin','Sistema','admin@medapp.com','\[hash\]',1)

## **8.3 turso.ts (idéntico a LegacyMuseum)**

El archivo src/turso.ts exporta dos clientes: turso para producción (URL \+ authToken desde .env) y devClient para desarrollo local apuntando a http://127.0.0.1:8080 con turso dev.

# Querry de la base de datos

\-- ═══════════════════════════════════════════════════════════════════  
\-- MedApp — Schema de Base de Datos  
\-- Turso (libsql / SQLite)  
\-- 17 tablas  •  6 módulos  
\-- ═══════════════════════════════════════════════════════════════════

\-- ─── MÓDULO 1: USUARIOS Y ACCESO ────────────────────────────────────

CREATE TABLE IF NOT EXISTS Roles (  
  roleId   INTEGER PRIMARY KEY AUTOINCREMENT,  
  roleName TEXT NOT NULL  
  \-- 'Administrador', 'Jefe Médico', 'Doctor',  
  \-- 'Nutriólogo', 'Estudiante', 'Staff', 'Entrenador'  
);

CREATE TABLE IF NOT EXISTS Users (  
  userId    INTEGER PRIMARY KEY AUTOINCREMENT,  
  firstName TEXT    NOT NULL,  
  lastName  TEXT    NOT NULL,  
  email     TEXT    NOT NULL UNIQUE,  
  password  TEXT    NOT NULL,  
  roleId    INTEGER NOT NULL,  
  FOREIGN KEY (roleId) REFERENCES Roles(roleId)  
);

\-- ─── MÓDULO 2: PACIENTES Y PERFILES ─────────────────────────────────

CREATE TABLE IF NOT EXISTS Patients (  
  patientId   INTEGER PRIMARY KEY,  
  dateOfBirth DATE,  
  gender      TEXT    CHECK(length(gender) \= 1),  
  bloodType   TEXT,  
  allergies   TEXT,  
  weight      DECIMAL,  
  height      DECIMAL,  
  isAthlete   INTEGER NOT NULL DEFAULT 0, \-- 0 \= No, 1 \= Sí  
  schoolLevel TEXT,  \-- 'Primaria','Secundaria','Preparatoria','Universidad'  
  FOREIGN KEY (patientId) REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS Coach\_Athlete (  
  coachId   INTEGER NOT NULL,  
  patientId INTEGER NOT NULL,  
  PRIMARY KEY (coachId, patientId),  
  FOREIGN KEY (coachId)   REFERENCES Users(userId),  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)  
);

\-- ─── MÓDULO 3: CLÍNICO ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Appointments (  
  appointmentId INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId     INTEGER NOT NULL,  
  doctorId      INTEGER NOT NULL,  
  dateTime      DATETIME NOT NULL,  
  status        TEXT NOT NULL DEFAULT 'Pendiente',  
  \-- 'Pendiente', 'Completada', 'Cancelada'  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId),  
  FOREIGN KEY (doctorId)  REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS Consultations (  
  consultationId INTEGER PRIMARY KEY AUTOINCREMENT,  
  appointmentId  INTEGER NOT NULL,  
  diagnosis      TEXT,  
  symptoms       TEXT,  
  consultationDate DATE NOT NULL,  
  FOREIGN KEY (appointmentId) REFERENCES Appointments(appointmentId)  
);

CREATE TABLE IF NOT EXISTS ClinicalFiles (  
  fileId         INTEGER PRIMARY KEY AUTOINCREMENT,  
  consultationId INTEGER NOT NULL,  
  fileType       TEXT    NOT NULL,  
  \-- 'Rayos X', 'Resultados de Laboratorio', 'PDF Receta', 'Otro'  
  fileUrl        TEXT    NOT NULL,  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId)  
);

CREATE TABLE IF NOT EXISTS Prescriptions (  
  prescriptionId INTEGER PRIMARY KEY AUTOINCREMENT,  
  consultationId INTEGER NOT NULL,  
  medicationId   INTEGER NOT NULL,  
  dosage         TEXT, \-- ej. '500mg'  
  frequency      TEXT, \-- ej. 'Cada 8 horas'  
  duration       TEXT, \-- ej. '7 días'  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),  
  FOREIGN KEY (medicationId)   REFERENCES Medications(medicationId)  
);

\-- ─── MÓDULO 4: LESIONES ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Injuries (  
  injuryId          INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId         INTEGER NOT NULL,  
  consultationId    INTEGER NOT NULL,  
  coachId           INTEGER, \-- nullable; solo si isAthlete \= 1  
  campusLocation    TEXT    NOT NULL,  
  \-- 'Cancha de Futbol', 'Gimnasio', 'Alberca',  
  \-- 'Pista de Atletismo', 'Laboratorio', 'Aula',  
  \-- 'Área común', 'Fuera del campus', 'Otro'  
  sport             TEXT,    \-- nullable; solo si isAthlete \= 1  
  \-- 'Futbol', 'Basquetbol', 'Natación', 'Atletismo',  
  \-- 'Voleibol', 'Gimnasia', 'Otro'  
  injuryType        TEXT    NOT NULL,  
  \-- 'Esguince', 'Fractura', 'Desgarro', 'Contusión', 'Luxación', 'Otro'  
  bodyZone          TEXT    NOT NULL,  
  \-- 'Rodilla', 'Tobillo', 'Hombro', 'Muñeca', 'Columna', 'Cabeza', 'Otro'  
  severity          TEXT    NOT NULL  
                    CHECK(severity IN ('Leve', 'Moderada', 'Grave')),  
  injuryDate        DATE    NOT NULL,  
  estimatedRecovery DATE,   \-- nullable  
  requiresInsurance INTEGER NOT NULL DEFAULT 0, \-- 0 \= No, 1 \= Sí  
  insuranceNotes    TEXT,   \-- nullable; solo si requiresInsurance \= 1  
  treatment         TEXT,  
  observations      TEXT,  
  status            TEXT    NOT NULL DEFAULT 'Activa'  
                    CHECK(status IN ('Activa', 'En recuperación', 'Recuperada')),  
  createdAt         DATETIME NOT NULL DEFAULT CURRENT\_TIMESTAMP,  
  FOREIGN KEY (patientId)      REFERENCES Patients(patientId),  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),  
  FOREIGN KEY (coachId)        REFERENCES Users(userId)  
);

\-- ─── MÓDULO 5: INVENTARIO ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Medications (  
  medicationId    INTEGER PRIMARY KEY AUTOINCREMENT,  
  brandName       TEXT    NOT NULL,  
  activeIngredient TEXT,  
  presentation    TEXT,   \-- 'Tabletas', 'Jarabe', 'Pomada', 'Inyectable'  
  currentStock    INTEGER NOT NULL DEFAULT 0,  
  reorderPoint    INTEGER NOT NULL DEFAULT 0  
);

CREATE TABLE IF NOT EXISTS Batches (  
  batchId        INTEGER PRIMARY KEY AUTOINCREMENT,  
  medicationId   INTEGER NOT NULL,  
  quantity       INTEGER NOT NULL,  
  entryDate      DATE    NOT NULL,  
  expirationDate DATE    NOT NULL,  
  FOREIGN KEY (medicationId) REFERENCES Medications(medicationId)  
);

\-- ─── MÓDULO 6: NUTRICIÓN ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS NutritionalProfiles (  
  profileId              INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId              INTEGER NOT NULL UNIQUE, \-- 1 a 1 con Patients  
  waistCircumference     DECIMAL,  
  bodyFatPercentage      DECIMAL,  
  physicalActivityLevel  TEXT,  
  familyHistory          TEXT,  
  dietaryRecall24h       TEXT,  
  consumptionFrequency   TEXT,  
  dietaryHabits          TEXT,  
  mealSchedule           TEXT,  
  waterConsumptionLiters DECIMAL,  
  nutritionalDiagnosis   TEXT,  
  \-- 'Sobrepeso', 'Obesidad', 'Bajo peso', 'Normal'  
  metabolicRisk          TEXT,  
  nutritionalObjective   TEXT,  
  createdAt              DATETIME NOT NULL DEFAULT CURRENT\_TIMESTAMP,  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)  
);

CREATE TABLE IF NOT EXISTS NutritionalPlans (  
  planId                  INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId               INTEGER NOT NULL,  
  nutritionistId          INTEGER NOT NULL,  
  caloricRequirement      INTEGER,  
  macrosDistribution      TEXT,  
  \-- ej. '50% Carbohidratos, 25% Proteína, 25% Grasas'  
  weeklyMenu              TEXT,   \-- JSON  
  equivalencesList        TEXT,  
  generalRecommendations  TEXT,  
  pdfUrl                  TEXT,  
  patientAccepted         INTEGER NOT NULL DEFAULT 0, \-- 0 \= No, 1 \= Sí  
  creationDate            DATE    NOT NULL DEFAULT CURRENT\_DATE,  
  FOREIGN KEY (patientId)      REFERENCES Patients(patientId),  
  FOREIGN KEY (nutritionistId) REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS NutritionalFollowUps (  
  followUpId           INTEGER PRIMARY KEY AUTOINCREMENT,  
  planId               INTEGER NOT NULL,  
  consultationId       INTEGER NOT NULL,  
  currentWeight        DECIMAL,  
  currentBmi           DECIMAL,  
  bodyMeasurements     TEXT,    \-- JSON con medidas corporales  
  compliancePercentage DECIMAL,  
  adjustmentsMade      TEXT,  
  newGoals             TEXT,  
  followUpDate         DATE    NOT NULL,  
  FOREIGN KEY (planId)         REFERENCES NutritionalPlans(planId),  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId)  
);

CREATE TABLE IF NOT EXISTS NutritionalDischarges (  
  dischargeId                INTEGER PRIMARY KEY AUTOINCREMENT,  
  planId                     INTEGER NOT NULL UNIQUE, \-- 1 a 1 con NutritionalPlans  
  goalReached                INTEGER, \-- 0 \= No, 1 \= Sí  
  targetWeightAchieved       DECIMAL,  
  treatmentDurationDays      INTEGER,  
  maintenanceRecommendations TEXT,  
  dischargeReason            TEXT,    \-- 'Cumplimiento', 'Abandono'  
  dischargeDate              DATE    NOT NULL,  
  FOREIGN KEY (planId) REFERENCES NutritionalPlans(planId)  
);

\-- ─── MÓDULO 7: INTEGRACIÓN Y ALERTAS ────────────────────────────────

CREATE TABLE IF NOT EXISTS CollaborativeNotes (  
  noteId      INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId   INTEGER NOT NULL,  
  authorId    INTEGER NOT NULL,  
  noteContent TEXT    NOT NULL,  
  isAlert     INTEGER NOT NULL DEFAULT 0, \-- 0 \= Nota, 1 \= Alerta  
  alertTags   TEXT,  
  \-- ej. 'lesión', 'alergia', 'riesgo nutricional', 'rendimiento'  
  createdAt   DATETIME NOT NULL DEFAULT CURRENT\_TIMESTAMP,  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId),  
  FOREIGN KEY (authorId)  REFERENCES Users(userId)  
);

\-- ═══════════════════════════════════════════════════════════════════  
\-- DATOS INICIALES  
\-- ═══════════════════════════════════════════════════════════════════

INSERT INTO Roles (roleName) VALUES  
  ('Administrador'),  
  ('Jefe Médico'),  
  ('Doctor'),  
  ('Nutriólogo'),  
  ('Estudiante'),  
  ('Staff'),  
  ('Entrenador');

MedApp — Documento de Arquitectura — Versión Final

Astro \+ Turso  •  17 tablas  •  7 roles  •  Arquitectura basada en LegacyMuseum