-- ─── MÓDULO 1: USUARIOS Y ACCESO ────────────────────────────────────
CREATE TABLE IF NOT EXISTS Roles (  
  roleId   INTEGER PRIMARY KEY AUTOINCREMENT,  
  roleName TEXT NOT NULL  
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

-- ─── MÓDULO 2: PACIENTES Y PERFILES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS Patients (  
  patientId   INTEGER PRIMARY KEY,  
  dateOfBirth DATE,  
  gender      TEXT    CHECK(length(gender) = 1),  
  bloodType   TEXT,  
  allergies   TEXT,  
  weight      DECIMAL,  
  height      DECIMAL,  
  isAthlete   INTEGER NOT NULL DEFAULT 0, -- 0 = No, 1 = Sí  
  schoolLevel TEXT,  -- 'Primaria','Secundaria','Preparatoria','Universidad'  
  FOREIGN KEY (patientId) REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS Coach_Athlete (  
  coachId   INTEGER NOT NULL,  
  patientId INTEGER NOT NULL,  
  PRIMARY KEY (coachId, patientId),  
  FOREIGN KEY (coachId)   REFERENCES Users(userId),  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)  
);

-- ─── MÓDULO 3: CLÍNICO ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Appointments (  
  appointmentId INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId     INTEGER NOT NULL,  
  doctorId      INTEGER NOT NULL,  
  dateTime      DATETIME NOT NULL,  
  status        TEXT NOT NULL DEFAULT 'Pendiente',  
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
  fileUrl        TEXT    NOT NULL,  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId)  
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

-- ─── MÓDULO 4: LESIONES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Injuries (  
  injuryId          INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId         INTEGER NOT NULL,  
  consultationId    INTEGER NOT NULL,  
  coachId           INTEGER, 
  campusLocation    TEXT    NOT NULL,  
  sport             TEXT,    
  injuryType        TEXT    NOT NULL,  
  bodyZone          TEXT    NOT NULL,  
  severity          TEXT    NOT NULL CHECK(severity IN ('Leve', 'Moderada', 'Grave')),  
  injuryDate        DATE    NOT NULL,  
  estimatedRecovery DATE,   
  requiresInsurance INTEGER NOT NULL DEFAULT 0, 
  insuranceNotes    TEXT,   
  treatment         TEXT,  
  observations      TEXT,  
  status            TEXT    NOT NULL DEFAULT 'Activa' CHECK(status IN ('Activa', 'En recuperación', 'Recuperada')),  
  createdAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (patientId)      REFERENCES Patients(patientId),  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId),  
  FOREIGN KEY (coachId)        REFERENCES Users(userId)  
);

-- ─── MÓDULO 5: INVENTARIO ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Medications (  
  medicationId    INTEGER PRIMARY KEY AUTOINCREMENT,  
  brandName       TEXT    NOT NULL,  
  activeIngredient TEXT,  
  presentation    TEXT,   
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

-- ─── MÓDULO 6: NUTRICIÓN ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS NutritionalProfiles (  
  profileId              INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId              INTEGER NOT NULL UNIQUE, 
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
  metabolicRisk          TEXT,  
  nutritionalObjective   TEXT,  
  createdAt              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId)  
);

CREATE TABLE IF NOT EXISTS NutritionalPlans (  
  planId                  INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId               INTEGER NOT NULL,  
  nutritionistId          INTEGER NOT NULL,  
  caloricRequirement      INTEGER,  
  macrosDistribution      TEXT,  
  weeklyMenu              TEXT,   
  equivalencesList        TEXT,  
  generalRecommendations  TEXT,  
  pdfUrl                  TEXT,  
  patientAccepted         INTEGER NOT NULL DEFAULT 0, 
  creationDate            DATE    NOT NULL DEFAULT CURRENT_DATE,  
  FOREIGN KEY (patientId)      REFERENCES Patients(patientId),  
  FOREIGN KEY (nutritionistId) REFERENCES Users(userId)  
);

CREATE TABLE IF NOT EXISTS NutritionalFollowUps (  
  followUpId           INTEGER PRIMARY KEY AUTOINCREMENT,  
  planId               INTEGER NOT NULL,  
  consultationId       INTEGER NOT NULL,  
  currentWeight        DECIMAL,  
  currentBmi           DECIMAL,  
  bodyMeasurements     TEXT,    
  compliancePercentage DECIMAL,  
  adjustmentsMade      TEXT,  
  newGoals             TEXT,  
  followUpDate         DATE    NOT NULL,  
  FOREIGN KEY (planId)         REFERENCES NutritionalPlans(planId),  
  FOREIGN KEY (consultationId) REFERENCES Consultations(consultationId)  
);

CREATE TABLE IF NOT EXISTS NutritionalDischarges (  
  dischargeId                INTEGER PRIMARY KEY AUTOINCREMENT,  
  planId                     INTEGER NOT NULL UNIQUE, 
  goalReached                INTEGER, 
  targetWeightAchieved       DECIMAL,  
  treatmentDurationDays      INTEGER,  
  maintenanceRecommendations TEXT,  
  dischargeReason            TEXT,    
  dischargeDate              DATE    NOT NULL,  
  FOREIGN KEY (planId) REFERENCES NutritionalPlans(planId)  
);

-- ─── MÓDULO 7: INTEGRACIÓN Y ALERTAS ────────────────────────────────
CREATE TABLE IF NOT EXISTS CollaborativeNotes (  
  noteId      INTEGER PRIMARY KEY AUTOINCREMENT,  
  patientId   INTEGER NOT NULL,  
  authorId    INTEGER NOT NULL,  
  noteContent TEXT    NOT NULL,  
  isAlert     INTEGER NOT NULL DEFAULT 0, 
  alertTags   TEXT,  
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (patientId) REFERENCES Patients(patientId),  
  FOREIGN KEY (authorId)  REFERENCES Users(userId)  
);

INSERT INTO Roles (roleName) VALUES  
  ('Administrador'),  
  ('Jefe Médico'),  
  ('Doctor'),  
  ('Nutriólogo'),  
  ('Estudiante'),  
  ('Staff'),  
  ('Entrenador');
