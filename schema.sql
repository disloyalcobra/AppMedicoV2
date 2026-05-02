-- ─── MÓDULO 1: USUARIOS Y ACCESO ────────────────────────────────────
CREATE TABLE IF NOT EXISTS Roles (  
  roleId   INTEGER PRIMARY KEY AUTOINCREMENT,  
  roleName TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Users (  
  userId    INTEGER PRIMARY KEY AUTOINCREMENT,  
  firstName TEXT    NOT NULL,  
  lastName  TEXT    NOT NULL,  
  email     TEXT    UNIQUE,  
  password  TEXT,  
  roleId    INTEGER NOT NULL,  
  matricula TEXT    UNIQUE,
  FOREIGN KEY (roleId) REFERENCES Roles(roleId)  
);

-- ─── MÓDULO 2: PACIENTES Y RELACIONES ────────────────────────────────
CREATE TABLE IF NOT EXISTS Patients (  
  patientId   INTEGER PRIMARY KEY,  
  dateOfBirth DATE,  
  gender      TEXT CHECK(length(gender) = 1),  
  bloodType   TEXT,  
  allergies   TEXT,  
  weight      DECIMAL,  
  height      DECIMAL,  
  isAthlete   INTEGER NOT NULL DEFAULT 0,  
  schoolLevel TEXT,
  FOREIGN KEY (patientId) REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS EmergencyContacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)
);

-- 🔥 RELACIÓN UNIFICADA RBAC
CREATE TABLE IF NOT EXISTS User_Patient (
  userId    INTEGER NOT NULL,
  patientId INTEGER NOT NULL,
  roleType  TEXT NOT NULL CHECK (
    roleType IN ('Doctor','Nutritionist','Coach','Physiotherapist')
  ),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, patientId, roleType),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)
);

-- ─── MÓDULO 3: DISPONIBILIDAD MÉDICA ────────────────────────────────
CREATE TABLE IF NOT EXISTS Doctor_Availability (
  availabilityId INTEGER PRIMARY KEY AUTOINCREMENT,
  doctorId INTEGER NOT NULL,
  dayOfWeek INTEGER NOT NULL CHECK (dayOfWeek BETWEEN 0 AND 6),
  startTime TEXT NOT NULL,
  endTime   TEXT NOT NULL,
  slotDuration INTEGER NOT NULL DEFAULT 30,
  isActive INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (doctorId) REFERENCES Users(userId)
);

-- ─── MÓDULO 4: CITAS (CORE) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Appointments (  
  appointmentId INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId     INTEGER NOT NULL,  
  doctorId      INTEGER NOT NULL,  
  dateTime      DATETIME NOT NULL,  

  appointmentType TEXT CHECK (
    appointmentType IN ('Medica','Nutricion','Entrenamiento','Fisioterapia')
  ) DEFAULT 'Medica',

  status TEXT NOT NULL CHECK (
    status IN ('Pendiente','Confirmada','Reagendada','Cancelada','Rechazada')
  ) DEFAULT 'Pendiente',

  reason TEXT,
  proposedDateTime DATETIME, 
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId),  
  FOREIGN KEY (doctorId)  REFERENCES Users(userId)  
);

-- 🔥 EVITA DOBLE RESERVA
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_slot
ON Appointments(doctorId, dateTime)
WHERE status IN ('Pendiente','Confirmada');

-- ─── MÓDULO 5: CLÍNICO ──────────────────────────────────────────────
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
  fileType       TEXT NOT NULL,  
  fileUrl        TEXT NOT NULL,  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId)  
);

CREATE TABLE IF NOT EXISTS Medications (  
  medicationId     INTEGER PRIMARY KEY AUTOINCREMENT,  
  brandName        TEXT NOT NULL,  
  activeIngredient TEXT,  
  presentation     TEXT,  
  currentStock     INTEGER NOT NULL DEFAULT 0,  
  reorderPoint     INTEGER NOT NULL DEFAULT 0  
);

CREATE TABLE IF NOT EXISTS Prescriptions (  
  prescriptionId INTEGER PRIMARY KEY AUTOINCREMENT,  
  consultationId INTEGER NOT NULL,  
  medicationId   INTEGER NOT NULL,  
  dosage         TEXT, 
  frequency      TEXT, 
  duration       TEXT, 
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),  
  FOREIGN KEY (medicationId)   REFERENCES Medications(medicationId)  
);

-- ─── MÓDULO 6: LESIONES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Injuries (  
  injuryId          INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId         INTEGER NOT NULL,  
  consultationId    INTEGER NOT NULL,  
  coachId           INTEGER, 
  campusLocation    TEXT NOT NULL,  
  sport             TEXT,    
  injuryType        TEXT NOT NULL,  
  bodyZone          TEXT NOT NULL,  
  severity          TEXT NOT NULL CHECK(severity IN ('Leve','Moderada','Grave')),  
  injuryDate        DATE NOT NULL,  
  estimatedRecovery DATE,   
  requiresInsurance INTEGER NOT NULL DEFAULT 0, 
  insuranceNotes    TEXT,   
  treatment         TEXT,  
  observations      TEXT,  
  status            TEXT NOT NULL DEFAULT 'Activa' CHECK(status IN ('Activa','En recuperación','Recuperada')),  
  createdAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (patientId)      REFERENCES Patients(patientId),  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),  
  FOREIGN KEY (coachId)        REFERENCES Users(userId)  
);

-- ─── MÓDULO 7: INVENTARIO ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Batches (  
  batchId        INTEGER PRIMARY KEY AUTOINCREMENT,  
  medicationId   INTEGER NOT NULL,  
  quantity       INTEGER NOT NULL,  
  entryDate      DATE NOT NULL,  
  expirationDate DATE NOT NULL,  
  FOREIGN KEY (medicationId) REFERENCES Medications(medicationId)  
);

-- ─── MÓDULO 8: NUTRICIÓN ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS NutritionalProfiles (...);
CREATE TABLE IF NOT EXISTS NutritionalPlans (...);
CREATE TABLE IF NOT EXISTS NutritionalFollowUps (...);
CREATE TABLE IF NOT EXISTS NutritionalDischarges (...);

-- ─── MÓDULO 9: NOTAS Y ALERTAS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS CollaborativeNotes (...);

-- ─── MÓDULO 10: FISIOTERAPIA ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PhysiotherapyPlans (
  planId INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  physiotherapistId INTEGER NOT NULL,
  injuryId INTEGER NULL,
  goals TEXT,
  startDate DATE NOT NULL,
  endDate DATE,
  status TEXT NOT NULL DEFAULT 'Activo'
         CHECK(status IN ('Activo','Completado','Cancelado')),
  createdBy INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES Patients(patientId),
  FOREIGN KEY (physiotherapistId) REFERENCES Users(userId),
  FOREIGN KEY (injuryId) REFERENCES Injuries(injuryId)
);

CREATE TABLE IF NOT EXISTS PhysiotherapySessions (
  sessionId INTEGER PRIMARY KEY AUTOINCREMENT,
  planId INTEGER NOT NULL,
  appointmentId INTEGER NULL,
  sessionDate DATE NOT NULL,
  therapyType TEXT NOT NULL,
  durationMinutes INTEGER NOT NULL,
  painLevel INTEGER CHECK(painLevel BETWEEN 0 AND 10),
  rangeOfMotion TEXT,
  strengthLevel TEXT,
  progressNotes TEXT,
  status TEXT NOT NULL DEFAULT 'Programada'
         CHECK(status IN ('Programada','Completada','Cancelada')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (planId) REFERENCES PhysiotherapyPlans(planId),
  FOREIGN KEY (appointmentId) REFERENCES Appointments(appointmentId)
);

CREATE TABLE IF NOT EXISTS PhysiotherapyDischarges (
  dischargeId INTEGER PRIMARY KEY AUTOINCREMENT,
  planId INTEGER NOT NULL UNIQUE,
  dischargeDate DATE NOT NULL,
  outcome TEXT,
  recommendations TEXT,
  FOREIGN KEY (planId) REFERENCES PhysiotherapyPlans(planId)
);

-- ─── ROLES INICIALES ────────────────────────────────────────────────
INSERT INTO Roles (roleName) VALUES  
  ('Administrador'),  
  ('Jefe Médico'),  
  ('Doctor'),  
  ('Nutriólogo'),  
  ('Estudiante'),  
  ('Staff'),  
  ('Entrenador'),  
  ('Fisioterapeuta');
