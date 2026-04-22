🧱 1. Crear la nueva tabla User_Patient
CREATE TABLE IF NOT EXISTS User_Patient (
  userId    INTEGER NOT NULL,
  patientId INTEGER NOT NULL,
  roleType  TEXT NOT NULL CHECK (roleType IN ('Doctor','Nutritionist','Coach')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, patientId, roleType),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)
);
🔄 2. Migrar datos desde Coach_Athlete
INSERT INTO User_Patient (userId, patientId, roleType)
SELECT coachId, patientId, 'Coach'
FROM Coach_Athlete;
🔄 3. Migrar relaciones desde citas médicas (doctores)

Esto evita que empieces con listas vacías.

INSERT INTO User_Patient (userId, patientId, roleType)
SELECT DISTINCT doctorId, patientId, 'Doctor'
FROM Appointments;
🔄 4. Migrar relaciones desde planes nutricionales
INSERT INTO User_Patient (userId, patientId, roleType)
SELECT DISTINCT nutritionistId, patientId, 'Nutritionist'
FROM NutritionalPlans;
🧹 5. Eliminar duplicados (por seguridad)

SQLite no falla con PK, pero esto asegura limpieza si hiciste pruebas antes:

INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType)
SELECT userId, patientId, roleType FROM User_Patient;

👉 (esto reinsertará ignorando duplicados si ya existían)

🔍 6. Verificar que todo migró correctamente

Antes de borrar nada, revisa:

SELECT roleType, COUNT(*) as total
FROM User_Patient
GROUP BY roleType;

Y también:

SELECT * FROM User_Patient LIMIT 20;
💣 7. Eliminar tabla antigua

Solo cuando confirmes que TODO está bien:

DROP TABLE Coach_Athlete;
⚙️ 8. (MUY IMPORTANTE) Actualizar queries en tu app

Ahora TODOS tus queries deben usar:

SELECT p.*
FROM Patients p
JOIN User_Patient up ON p.patientId = up.patientId
WHERE up.userId = ?;
➕ 9. Insertar relación automáticamente al crear/vincular

Cada vez que:

creas paciente
vinculas paciente
creas cita / plan / lesión

usa:

INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType)
VALUES (?, ?, ?);

Ejemplo:

Doctor → 'Doctor'
Nutriólogo → 'Nutritionist'
Coach → 'Coach'
🔐 10. Query para validar acceso (clave para seguridad)

Antes de mostrar un paciente:

SELECT 1
FROM User_Patient
WHERE userId = ? AND patientId = ?;

👉 Si no devuelve nada → acceso denegado

🧠 Resultado final

Con esto logras:

✔️ Relaciones muchos a muchos
✔️ Un solo punto de control
✔️ Migración sin perder datos
✔️ Escalabilidad (puedes agregar más roles después)
✔️ Seguridad real (no solo frontend)