import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { getSession } from '../../functions/getSession';
import { ROLES } from '../../functions/checkRole';

/**
 * ENDPOINT TEMPORAL DE MIGRACIÓN
 * GET /api/run-migration → Ejecuta la migración 002 (solo Admin)
 * IMPORTANTE: Eliminar o proteger después de su uso en producción.
 */
export const GET: APIRoute = async ({ cookies }) => {
  const user = getSession(cookies);
  if (!user || Number(user.roleId) !== ROLES.ADMINISTRADOR) {
    return new Response(JSON.stringify({ error: 'Solo administradores' }), { status: 403 });
  }

  const results: string[] = [];
  const errors: string[] = [];

  const statements = [
    // appointmentType column
    `ALTER TABLE Appointments ADD COLUMN appointmentType TEXT CHECK(appointmentType IN ('Medica','Nutricion','Entrenamiento','Fisioterapia')) DEFAULT 'Medica'`,
    // Rol Fisioterapeuta
    `INSERT OR IGNORE INTO Roles (roleName) VALUES ('Fisioterapeuta')`,
    // PhysiotherapyPlans
    `CREATE TABLE IF NOT EXISTS PhysiotherapyPlans (
      planId INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      physiotherapistId INTEGER NOT NULL,
      injuryId INTEGER NULL,
      goals TEXT,
      startDate DATE NOT NULL DEFAULT CURRENT_DATE,
      endDate DATE,
      status TEXT NOT NULL DEFAULT 'Activo' CHECK(status IN ('Activo','Completado','Cancelado')),
      createdBy INTEGER NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES Patients(patientId),
      FOREIGN KEY (physiotherapistId) REFERENCES Users(userId),
      FOREIGN KEY (injuryId) REFERENCES Injuries(injuryId),
      FOREIGN KEY (createdBy) REFERENCES Users(userId)
    )`,
    // PhysiotherapySessions
    `CREATE TABLE IF NOT EXISTS PhysiotherapySessions (
      sessionId INTEGER PRIMARY KEY AUTOINCREMENT,
      planId INTEGER NOT NULL,
      appointmentId INTEGER NULL,
      sessionDate DATE NOT NULL,
      therapyType TEXT NOT NULL,
      durationMinutes INTEGER NOT NULL DEFAULT 60,
      painLevel INTEGER CHECK(painLevel BETWEEN 0 AND 10),
      rangeOfMotion TEXT,
      strengthLevel TEXT,
      progressNotes TEXT,
      status TEXT NOT NULL DEFAULT 'Programada' CHECK(status IN ('Programada','Completada','Cancelada')),
      createdBy INTEGER NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planId) REFERENCES PhysiotherapyPlans(planId),
      FOREIGN KEY (appointmentId) REFERENCES Appointments(appointmentId),
      FOREIGN KEY (createdBy) REFERENCES Users(userId)
    )`,
    // PhysiotherapyDischarges
    `CREATE TABLE IF NOT EXISTS PhysiotherapyDischarges (
      dischargeId INTEGER PRIMARY KEY AUTOINCREMENT,
      planId INTEGER NOT NULL UNIQUE,
      dischargeDate DATE NOT NULL DEFAULT CURRENT_DATE,
      outcome TEXT,
      recommendations TEXT,
      createdBy INTEGER NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planId) REFERENCES PhysiotherapyPlans(planId),
      FOREIGN KEY (createdBy) REFERENCES Users(userId)
    )`,
    // Índices
    `CREATE INDEX IF NOT EXISTS idx_physio_plans_patient ON PhysiotherapyPlans(patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_physio_plans_physio ON PhysiotherapyPlans(physiotherapistId)`,
    `CREATE INDEX IF NOT EXISTS idx_physio_sessions_plan ON PhysiotherapySessions(planId)`,
    `CREATE INDEX IF NOT EXISTS idx_physio_sessions_date ON PhysiotherapySessions(sessionDate)`,
  ];

  for (const sql of statements) {
    try {
      await db.execute(sql);
      results.push(`OK: ${sql.slice(0, 60)}...`);
    } catch (e: any) {
      // ALTER TABLE falla si la columna ya existe — se ignora ese error
      if (e.message?.includes('duplicate column')) {
        results.push(`SKIP (already exists): ${sql.slice(0, 60)}...`);
      } else {
        errors.push(`ERROR: ${e.message} | SQL: ${sql.slice(0, 60)}...`);
      }
    }
  }

  return new Response(JSON.stringify({ success: errors.length === 0, results, errors }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
