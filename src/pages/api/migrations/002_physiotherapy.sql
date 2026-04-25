-- ─── MIGRACIÓN 002: MÓDULO FISIOTERAPIA ────────────────────────────
-- Ejecutar UNA SOLA VEZ en la base de datos de producción (Turso)

-- 1. Agregar columna appointmentType a Appointments (si no existe)
ALTER TABLE Appointments ADD COLUMN appointmentType TEXT
  CHECK(appointmentType IN ('Medica','Nutricion','Entrenamiento','Fisioterapia'))
  DEFAULT 'Medica';

-- 2. Agregar rol Fisioterapeuta (si no existe)
INSERT OR IGNORE INTO Roles (roleName) VALUES ('Fisioterapeuta');

-- 3. Actualizar roleType check en User_Patient para incluir Physiotherapist
-- SQLite no permite ALTER TABLE para modificar constraints, la tabla ya fue
-- creada con el nuevo check en el schema actualizado. Si la DB es nueva, OK.
-- Si la DB ya existe con el check anterior, esta migración no puede cambiarla.
-- En ese caso, los nuevos registros con roleType='Physiotherapist' serán
-- rechazados. Solución: recrear la tabla (ver comentario al final).

-- 4. Crear tabla de Planes de Fisioterapia
CREATE TABLE IF NOT EXISTS PhysiotherapyPlans (
  planId            INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId         INTEGER NOT NULL,
  physiotherapistId INTEGER NOT NULL,
  injuryId          INTEGER NULL,
  goals             TEXT,
  startDate         DATE NOT NULL DEFAULT CURRENT_DATE,
  endDate           DATE,
  status            TEXT NOT NULL DEFAULT 'Activo'
                    CHECK(status IN ('Activo','Completado','Cancelado')),
  createdBy         INTEGER NOT NULL,
  createdAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId)         REFERENCES Patients(patientId),
  FOREIGN KEY (physiotherapistId) REFERENCES Users(userId),
  FOREIGN KEY (injuryId)          REFERENCES Injuries(injuryId),
  FOREIGN KEY (createdBy)         REFERENCES Users(userId)
);

-- 5. Crear tabla de Sesiones de Fisioterapia
CREATE TABLE IF NOT EXISTS PhysiotherapySessions (
  sessionId       INTEGER PRIMARY KEY AUTOINCREMENT,
  planId          INTEGER NOT NULL,
  appointmentId   INTEGER NULL,
  sessionDate     DATE NOT NULL,
  therapyType     TEXT NOT NULL,
  durationMinutes INTEGER NOT NULL DEFAULT 60,
  painLevel       INTEGER CHECK(painLevel BETWEEN 0 AND 10),
  rangeOfMotion   TEXT,
  strengthLevel   TEXT,
  progressNotes   TEXT,
  status          TEXT NOT NULL DEFAULT 'Programada'
                  CHECK(status IN ('Programada','Completada','Cancelada')),
  createdBy       INTEGER NOT NULL,
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (planId)        REFERENCES PhysiotherapyPlans(planId),
  FOREIGN KEY (appointmentId) REFERENCES Appointments(appointmentId),
  FOREIGN KEY (createdBy)     REFERENCES Users(userId)
);

-- 6. Crear tabla de Altas de Fisioterapia
CREATE TABLE IF NOT EXISTS PhysiotherapyDischarges (
  dischargeId     INTEGER PRIMARY KEY AUTOINCREMENT,
  planId          INTEGER NOT NULL UNIQUE,
  dischargeDate   DATE NOT NULL DEFAULT CURRENT_DATE,
  outcome         TEXT,
  recommendations TEXT,
  createdBy       INTEGER NOT NULL,
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (planId)    REFERENCES PhysiotherapyPlans(planId),
  FOREIGN KEY (createdBy) REFERENCES Users(userId)
);

-- 7. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_physio_plans_patient
  ON PhysiotherapyPlans(patientId);

CREATE INDEX IF NOT EXISTS idx_physio_plans_physio
  ON PhysiotherapyPlans(physiotherapistId);

CREATE INDEX IF NOT EXISTS idx_physio_sessions_plan
  ON PhysiotherapySessions(planId);

CREATE INDEX IF NOT EXISTS idx_physio_sessions_date
  ON PhysiotherapySessions(sessionDate);

-- ─── NOTA: User_Patient constraint ──────────────────────────────────
-- Si la BD ya existe y el check de roleType NO incluye 'Physiotherapist',
-- ejecuta esto manualmente en Turso Shell para recrear la tabla:
--
-- CREATE TABLE User_Patient_new (...) con el nuevo check;
-- INSERT INTO User_Patient_new SELECT * FROM User_Patient;
-- DROP TABLE User_Patient;
-- ALTER TABLE User_Patient_new RENAME TO User_Patient;
