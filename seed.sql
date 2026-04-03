-- ═══════════════════════════════════════════════════════════════════
-- MedApp — Datos de Prueba (Seed)
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO Users (userId, firstName, lastName, email, password, roleId) VALUES
  (1,  'Carlos',    'Ramírez',    'admin@medapp.com',         'password123', 1),
  (2,  'Sofía',     'Mendoza',    'jefe.medico@medapp.com',   'password123', 2),
  (3,  'Andrés',    'Torres',     'dr.torres@medapp.com',     'password123', 3),
  (4,  'Lucía',     'Hernández',  'dra.hernandez@medapp.com', 'password123', 3),
  (5,  'Pablo',     'Vargas',     'nutriologo@medapp.com',    'password123', 4),
  (6,  'Miguel',    'Ángel Ruiz', 'estudiante1@medapp.com',   'password123', 5),
  (7,  'Valeria',   'Castillo',   'estudiante2@medapp.com',   'password123', 5),
  (8,  'Diego',     'Morales',    'estudiante3@medapp.com',   'password123', 5),
  (9,  'Fernanda',  'López',      'estudiante4@medapp.com',   'password123', 5),
  (10, 'Roberto',   'Jiménez',    'staff@medapp.com',         'password123', 6),
  (11, 'Eduardo',   'Sánchez',    'entrenador1@medapp.com',   'password123', 7),
  (12, 'Claudia',   'Peña',       'entrenador2@medapp.com',   'password123', 7);

INSERT INTO Patients (patientId, dateOfBirth, gender, bloodType, allergies, weight, height, isAthlete, schoolLevel) VALUES
  (6,  '2003-04-15', 'M', 'O+',  'Ninguna',       72.5, 1.75, 1, 'Universidad'),
  (7,  '2004-08-22', 'F', 'A+',  'Penicilina',    58.0, 1.62, 1, 'Universidad'),
  (8,  '2002-11-03', 'M', 'B+',  'Polen',         80.0, 1.80, 0, 'Universidad'),
  (9,  '2005-01-30', 'F', 'AB-', 'Lactosa',       54.5, 1.60, 0, 'Preparatoria');

INSERT INTO Coach_Athlete (coachId, patientId) VALUES
  (11, 6), (11, 7), (12, 7);

INSERT INTO Medications (medicationId, brandName, activeIngredient, presentation, currentStock, reorderPoint) VALUES
  (1, 'Tempra',       'Paracetamol',    'Tabletas',   45,  20),
  (2, 'Voltaren',     'Diclofenaco',    'Tabletas',   30,  15),
  (3, 'Amoxil',       'Amoxicilina',    'Tabletas',   8,   20),
  (4, 'Omeprazol Gen','Omeprazol',      'Tabletas',   60,  25),
  (5, 'Clonazepam',   'Clonazepam',     'Tabletas',   12,  10),
  (6, 'Fluimucil',    'Acetilcisteína', 'Jarabe',      5,  15),
  (7, 'Betadine',     'Povidona Yodada','Pomada',     20,  10),
  (8, 'Ibuprofeno Gen','Ibuprofeno',    'Tabletas',   55,  20);

INSERT INTO Batches (batchId, medicationId, quantity, entryDate, expirationDate) VALUES
  (1, 1, 100, '2025-01-10', '2027-01-10'),
  (2, 1,  50, '2025-06-01', '2027-06-01'),
  (3, 2,  80, '2025-02-15', '2026-12-15'),
  (4, 3,  30, '2024-11-01', '2026-11-01'),
  (5, 4, 120, '2025-03-20', '2027-03-20'),
  (6, 5,  40, '2025-05-10', '2026-05-10'),
  (7, 6,  20, '2025-01-05', '2026-07-05'),
  (8, 7,  50, '2025-07-01', '2027-07-01'),
  (9, 8, 100, '2025-04-15', '2027-04-15');

INSERT INTO Appointments (appointmentId, patientId, doctorId, dateTime, status) VALUES
  (1,  6, 3, '2026-01-10 09:00:00', 'Completada'),
  (2,  6, 3, '2026-02-14 10:30:00', 'Completada'),
  (3,  6, 3, '2026-03-20 09:00:00', 'Pendiente'),
  (4,  7, 4, '2026-01-18 11:00:00', 'Completada'),
  (5,  7, 4, '2026-02-25 12:00:00', 'Completada'),
  (6,  7, 4, '2026-03-25 11:00:00', 'Pendiente'),
  (7,  8, 3, '2026-01-22 08:30:00', 'Completada'),
  (8,  8, 3, '2026-03-12 08:30:00', 'Completada'),
  (9,  9, 4, '2026-02-05 14:00:00', 'Completada'),
  (10, 9, 4, '2026-03-18 14:00:00', 'Pendiente');

INSERT INTO Consultations (consultationId, appointmentId, diagnosis, symptoms, consultationDate) VALUES
  (1, 1, 'Faringitis aguda', 'Dolor de garganta, fiebre 38.5°C, dificultad para deglutir', '2026-01-10'),
  (2, 2, 'Esguince de tobillo grado II', 'Dolor e inflamación en tobillo derecho tras caída en práctica de futbol', '2026-02-14'),
  (3, 4, 'Contusión en hombro izquierdo', 'Dolor localizado en hombro izquierdo tras impacto en práctica de natación', '2026-01-18'),
  (4, 5, 'Seguimiento contusión hombro — evolución favorable', 'Dolor reducido al 40%, amplitud de movimiento recuperándose', '2026-02-25'),
  (5, 7, 'Gastritis leve', 'Dolor epigástrico, náuseas, ardor estomacal', '2026-01-22'),
  (6, 8, 'Control gastritis — mejoría notable', 'Síntomas reducidos, tolera bien la dieta indicada', '2026-03-12'),
  (7, 9, 'Cefalea tensional recurrente', 'Dolor de cabeza frontal, tensión cervical, estrés académico', '2026-02-05');

INSERT INTO ClinicalFiles (fileId, consultationId, fileType, fileUrl) VALUES
  (1, 2, 'Rayos X', '/files/miguel-tobillo-rx-feb2026.jpg'),
  (2, 2, 'PDF Receta', '/files/miguel-receta-feb2026.pdf'),
  (3, 3, 'Resultados de Laboratorio','/files/valeria-lab-ene2026.pdf'),
  (4, 5, 'Resultados de Laboratorio','/files/diego-lab-ene2026.pdf'),
  (5, 7, 'PDF Receta', '/files/fernanda-receta-feb2026.pdf');

INSERT INTO Prescriptions (prescriptionId, consultationId, medicationId, dosage, frequency, duration) VALUES
  (1, 1, 3, '500mg', 'Cada 8 horas',  '7 días'),
  (2, 1, 1, '500mg', 'Cada 6 horas',  '5 días'),
  (3, 2, 2, '50mg',  'Cada 12 horas', '5 días'),
  (4, 2, 1, '500mg', 'Cada 8 horas',  '3 días'),
  (5, 3, 8, '400mg', 'Cada 8 horas',  '5 días'),
  (6, 3, 7, 'Aplicación tópica', '2 veces al día', '7 días'),
  (7, 5, 4, '20mg',  'Cada 24 horas', '14 días'),
  (8, 7, 1, '500mg', 'Cada 8 horas si dolor', '5 días'),
  (9, 7, 5, '0.5mg', 'Antes de dormir', '15 días');

INSERT INTO Injuries (
  injuryId, patientId, consultationId, coachId,
  campusLocation, sport,
  injuryType, bodyZone, severity,
  injuryDate, estimatedRecovery,
  requiresInsurance, insuranceNotes,
  treatment, observations, status
) VALUES
  (1, 6, 2, 11, 'Cancha de Futbol', 'Futbol', 'Esguince', 'Tobillo', 'Moderada', '2026-02-14', '2026-03-14', 1, 'Póliza #AXA-2024-00781', 'Reposo relativo 2 semanas', 'Caída en disputa de balón.', 'En recuperación'),
  (2, 7, 3, 11, 'Alberca', 'Natación', 'Contusión', 'Hombro', 'Leve', '2026-01-18', '2026-02-18', 0, NULL, 'Reposo de hombro izquierdo 1 semana', 'Impacto contra el borde de la alberca', 'Recuperada'),
  (3, 8, 5, NULL, 'Laboratorio', NULL, 'Contusión', 'Muñeca', 'Leve', '2026-01-22', '2026-02-05', 0, NULL, 'Hielo local, reposo de muñeca 5 días', 'Golpe accidental con equipo', 'Recuperada');

INSERT INTO NutritionalProfiles (
  profileId, patientId, waistCircumference, bodyFatPercentage, physicalActivityLevel,
  familyHistory, dietaryRecall24h, consumptionFrequency, dietaryHabits, mealSchedule,
  waterConsumptionLiters, nutritionalDiagnosis, metabolicRisk, nutritionalObjective
) VALUES
  (1, 6, 78.0, 14.5, 'Muy activo', 'Padre hipertenso', 'Avena, pollo, arroz', 'Frutas 3x/semana', 'Come rápido', '7:00, 14:00, 21:00', 1.8, 'Normal', 'Bajo', 'Optimizar rendimiento'),
  (2, 9, 86.5, 31.2, 'Sedentario', 'Madre diabetes', 'Pan dulce, torta', 'Verduras 2x/semana', 'Saltea desayuno', 'Tarde', 1.0, 'Sobrepeso', 'Moderado', 'Reducción de peso');

INSERT INTO NutritionalPlans (
  planId, patientId, nutritionistId, caloricRequirement, macrosDistribution,
  weeklyMenu, equivalencesList, generalRecommendations, pdfUrl, patientAccepted, creationDate
) VALUES
  (1, 6, 5, 3200, '55% C, 25% P, 20% G', '{}', 'Prot: 30g', 'Agua 2.5L', '/plan.pdf', 1, '2026-01-20'),
  (2, 9, 5, 1600, '45% C, 25% P, 30% G', '{}', 'Fruta: 1 pieza', 'Agua natural', '/plan2.pdf', 0, '2026-02-10');

INSERT INTO NutritionalFollowUps (
  followUpId, planId, consultationId, currentWeight, currentBmi, bodyMeasurements,
  compliancePercentage, adjustmentsMade, newGoals, followUpDate
) VALUES
  (1, 1, 2, 71.0, 23.2, '{"cintura": 77.5}', 75.0, 'Aumentó proteína', 'Mantener hidratación', '2026-02-14');

INSERT INTO NutritionalDischarges (
  dischargeId, planId, goalReached, targetWeightAchieved, treatmentDurationDays,
  maintenanceRecommendations, dischargeReason, dischargeDate
) VALUES
  (1, 1, 1, 70.5, 60, 'Mantener ingesta proteica', 'Cumplimiento', '2026-03-10');

INSERT INTO CollaborativeNotes (noteId, patientId, authorId, noteContent, isAlert, alertTags, createdAt) VALUES
  (1, 6, 3, 'ALERTA LESIÓN: Miguel Ángel', 1, 'lesión', '2026-02-14 10:45:00'),
  (2, 6, 3, 'Paciente con esguince grado II', 0, 'nutrición', '2026-02-14 11:00:00'),
  (3, 7, 4, 'ALERTA LESIÓN: Valeria', 1, 'lesión', '2026-01-18 11:30:00'),
  (4, 6, 11, 'Miguel ha mostrado buena recuperación', 0, 'rendimiento', '2026-03-05 09:00:00'),
  (5, 9, 5, 'ALERTA NUTRICIONAL: Fernanda', 1, 'riesgo nutricional', '2026-02-10 15:30:00'),
  (6, 7, 4, 'Paciente con alergia a Penicilina', 1, 'alergia', '2026-01-18 12:00:00');
