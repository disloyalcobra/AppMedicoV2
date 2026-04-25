⚙️ PLAN DE IMPLEMENTACIÓN — CREACIÓN DE PACIENTES SIN DUPLICADOS
🧠 1. PRINCIPIO BASE

👉 Antes de crear un paciente:

SI existe → NO crear → vincular
SI no existe → crear → vincular

👉 nunca duplicar registros

🔍 2. ¿CÓMO DEFINES “PACIENTE EXISTENTE”?

Aquí tienes 3 opciones, de mejor a peor:

🟢 OPCIÓN RECOMENDADA (más confiable)
matricula (UNIQUE)

👉 ya la tienes en Users

🟡 OPCIÓN SECUNDARIA
email

👉 útil si no hay matrícula

🔴 OPCIÓN DÉBIL (fallback)
firstName + lastName + dateOfBirth

👉 solo como sugerencia, no como validación estricta

🔧 3. BACKEND — ENDPOINT PRINCIPAL
📌 POST /api/patients/create-or-link
🧠 LÓGICA COMPLETA
🟢 Paso 1: Buscar paciente existente
SELECT userId
FROM Users
WHERE matricula = ?
OR email = ?
🟢 Paso 2A: SI EXISTE

👉 NO crear nuevo

👉 solo vincular:

INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType)
VALUES (?, ?, ?)

👉 respuesta:

{
  "status": "linked",
  "patientId": 123
}
🟢 Paso 2B: SI NO EXISTE

👉 crear usuario + paciente

1. Crear en Users
INSERT INTO Users (
  firstName,
  lastName,
  email,
  password,
  roleId,
  matricula
)
VALUES (?, ?, ?, ?, ?, ?)

👉 roleId = Estudiante (o paciente)

2. Crear en Patients
INSERT INTO Patients (
  patientId,
  dateOfBirth,
  gender,
  weight,
  height
)
VALUES (?, ?, ?, ?, ?)
3. Vincular
INSERT INTO User_Patient (userId, patientId, roleType)
VALUES (?, ?, ?)

👉 respuesta:

{
  "status": "created",
  "patientId": 456
}
🔒 4. VALIDACIONES IMPORTANTES
🟢 1. Evitar duplicados reales

Antes de insertar:

SELECT 1 FROM Users
WHERE matricula = ?
OR email = ?

👉 si existe → bloquear creación

🟢 2. Validar rol que crea

👉 permitido:

Doctor
Nutriólogo
Fisioterapeuta
Entrenador
Admin
🟢 3. Auto-vinculación obligatoria
createdBy SIEMPRE queda vinculado al paciente
🎨 5. FRONTEND — FLUJO UX
📌 /patients/add.astro
🟢 Flujo recomendado
🧩 Paso 1: Usuario escribe:
matrícula
nombre
email
🟢 Paso 2: Búsqueda automática (AJAX)
GET /api/patients/search?q=...
🟢 Resultado:
✔️ SI EXISTE

Mostrar:

Paciente encontrado:
[Nombre completo]
[Botón: Vincular a mi lista]
❌ SI NO EXISTE

Mostrar:

No encontrado
[Botón: Crear nuevo paciente]
🔥 6. UX CLAVE (esto hace la diferencia)
🧠 NO hagas esto:
❌ crear directo sin buscar
❌ confiar solo en backend
✅ SÍ haz esto:
✔️ búsqueda previa en tiempo real
✔️ sugerir coincidencias
✔️ confirmar antes de crear
🧩 7. ENDPOINT EXTRA
📌 /api/patients/search
SELECT u.userId, u.firstName, u.lastName
FROM Users u
WHERE u.matricula LIKE ?
OR u.email LIKE ?
OR u.firstName LIKE ?

👉 excluir ya vinculados:

AND u.userId NOT IN (
  SELECT patientId FROM User_Patient WHERE userId = ?
)
🔒 8. SEGURIDAD (MUY IMPORTANTE)
✔️ Validar siempre en backend

Aunque frontend filtre:

👉 backend debe evitar duplicados sí o sí

🚀 9. BONUS (muy recomendado)
🧩 Índices
CREATE INDEX idx_users_matricula ON Users(matricula);
CREATE INDEX idx_users_email ON Users(email);
🧩 Normalizar texto

Antes de comparar:

trim()
toLowerCase()
🧠 CONCLUSIÓN FINAL

Con este plan:

✔️ evitas duplicados
✔️ reutilizas pacientes existentes
✔️ mantienes integridad
✔️ mejoras UX
✔️ mantienes coherencia con RBAC