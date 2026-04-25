import type { APIRoute } from "astro";
import { db } from "../../turso";
import { ROLES } from "../../functions/checkRole";

let cache = new Map();

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    
    const roleId = Number(user.roleId);
    if (roleId === ROLES.ESTUDIANTE || roleId === ROLES.STAFF) {
      return new Response(JSON.stringify({ error: "Sin permisos" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "month"; // week, month, year
    const doctorIdParam = url.searchParams.get("doctorId");

    const isAdmin = roleId === ROLES.ADMINISTRADOR || roleId === ROLES.JEFE_MEDICO;
    
    // Si no es admin, filtramos por su propio ID
    const filterUserId = isAdmin ? (doctorIdParam ? Number(doctorIdParam) : null) : user.userId;

    const cacheKey = `${filterUserId || "all"}_${range}`;

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      // Cache por 60s
      if (Date.now() - cachedData.timestamp < 60000) {
        return new Response(JSON.stringify(cachedData.data), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Date modifiers for SQLite
    let dateModifier = "'-30 days'";
    if (range === "week") dateModifier = "'-7 days'";
    if (range === "year") dateModifier = "'-1 year'";

    // --- FILTROS GLOBALES ---
    let appointmentsFilter = `WHERE dateTime >= datetime('now', ${dateModifier})`;
    let appointmentsArgs: any[] = [];
    let userPatientFilter = ``;
    let userPatientArgs: any[] = [];

    if (filterUserId) {
        appointmentsFilter += ` AND specialistId = ?`;
        appointmentsArgs.push(filterUserId);
        userPatientFilter = `JOIN User_Patient up ON p.patientId = up.patientId WHERE up.userId = ?`;
        userPatientArgs.push(filterUserId);
    } else if (roleId === ROLES.NUTRIOLOGO || roleId === ROLES.ENTRENADOR || roleId === ROLES.FISIOTERAPEUTA) {
        // Para roles específicos que filtran por sus propios pacientes
        userPatientFilter = `JOIN User_Patient up ON p.patientId = up.patientId WHERE up.userId = ?`;
        userPatientArgs.push(user.userId);
    }

    // Construir filtro de pacientes (para queries que usan Patients)
    let patientsWhereClause = userPatientFilter || `WHERE 1=1`;
    let patientsArgs = userPatientArgs.length > 0 ? userPatientArgs : [];

    // --- 1. GENERAL ---
    // Citas totales y por estado
    const appointmentsStatusRes = await db.execute({
      sql: `SELECT status, COUNT(*) as count FROM Appointments ${appointmentsFilter} GROUP BY status`,
      args: appointmentsArgs
    });
    
    const statusCounts = appointmentsStatusRes.rows.reduce((acc: any, row) => {
        acc[row.status as string] = Number(row.count);
        return acc;
    }, { 'Pendiente': 0, 'Confirmada': 0, 'Reagendada': 0, 'Cancelada': 0, 'Rechazada': 0 });
    
    const totalAppointments = Object.values(statusCounts).reduce((a: any, b: any) => a + b, 0);

    // Carga semanal (Heatmap/Bar chart approx)
    const workloadRes = await db.execute({
        sql: `SELECT strftime('%w', dateTime) as dayOfWeek, COUNT(*) as count 
              FROM Appointments 
              ${appointmentsFilter} 
              GROUP BY dayOfWeek`,
        args: appointmentsArgs
    });

    const totalPatientsRes = await db.execute({
        sql: `SELECT COUNT(DISTINCT p.patientId) as count FROM Patients p ${patientsWhereClause}`,
        args: patientsArgs
    });

    const activeUsersRes = await db.execute(`
        SELECT r.roleName, COUNT(u.userId) as count 
        FROM Users u 
        JOIN Roles r ON u.roleId = r.roleId 
        WHERE r.roleName IN ('Doctor', 'Nutriólogo', 'Entrenador', 'Jefe Medico', 'Fisioterapeuta') 
        GROUP BY r.roleName
    `);

    // --- 2. CLINICAL ---
    let clinicalJoin = filterUserId ? `JOIN Appointments a ON c.appointmentId = a.appointmentId WHERE a.specialistId = ? AND c.consultationDate >= date('now', ${dateModifier})` : `WHERE c.consultationDate >= date('now', ${dateModifier})`;
    let clinicalArgs = filterUserId ? [filterUserId] : [];

    const diagnosisRes = await db.execute({
        sql: `SELECT diagnosis, COUNT(*) as count FROM Consultations c ${clinicalJoin} AND diagnosis IS NOT NULL AND diagnosis != '' GROUP BY diagnosis ORDER BY count DESC LIMIT 10`,
        args: clinicalArgs
    });

    const symptomsRes = await db.execute({
        sql: `SELECT symptoms FROM Consultations c ${clinicalJoin} AND symptoms IS NOT NULL AND symptoms != ''`,
        args: clinicalArgs
    });
    
    // Simplificación para nube de palabras o barras de síntomas
    const symptomsWords: Record<string, number> = {};
    symptomsRes.rows.forEach(row => {
        if(row.symptoms) {
            const words = String(row.symptoms).toLowerCase().split(/\\W+/).filter(w => w.length > 3);
            words.forEach(w => {
                symptomsWords[w] = (symptomsWords[w] || 0) + 1;
            });
        }
    });
    const topSymptoms = Object.entries(symptomsWords).sort((a, b) => b[1] - a[1]).slice(0, 10).map(x => ({ name: x[0], count: x[1] }));

    let medsJoin = filterUserId ? `JOIN Consultations c ON p.consultationId = c.consultationId JOIN Appointments a ON c.appointmentId = a.appointmentId WHERE a.specialistId = ? AND c.consultationDate >= date('now', ${dateModifier})` : `JOIN Consultations c ON p.consultationId = c.consultationId WHERE c.consultationDate >= date('now', ${dateModifier})`;
    
    const medsRes = await db.execute({
        sql: `SELECT m.brandName, COUNT(*) as count 
              FROM Prescriptions p
              JOIN Medications m ON p.medicationId = m.medicationId
              ${medsJoin}
              GROUP BY m.brandName ORDER BY count DESC LIMIT 5`,
        args: clinicalArgs
    });

    const treatmentDurationRes = await db.execute({
        sql: `SELECT p.duration, c.consultationDate
              FROM Prescriptions p
              ${medsJoin}`,
        args: clinicalArgs
    });

    // --- 3. PATIENTS ---
    const agesRes = await db.execute({
        sql: `SELECT dateOfBirth, gender FROM Patients p ${patientsWhereClause}`,
        args: patientsArgs
    });
    
    const agesData = {
        '0-18': { M: 0, F: 0, Other: 0 },
        '19-25': { M: 0, F: 0, Other: 0 },
        '26-35': { M: 0, F: 0, Other: 0 },
        '36+': { M: 0, F: 0, Other: 0 }
    };
    const currentYear = new Date().getFullYear();
    agesRes.rows.forEach(r => {
        if(r.dateOfBirth) {
            const yob = parseInt(String(r.dateOfBirth).split('-')[0]);
            const age = currentYear - yob;
            const g = r.gender === 'M' ? 'M' : (r.gender === 'F' ? 'F' : 'Other');
            let bin = '36+';
            if (age <= 18) bin = '0-18';
            else if (age <= 25) bin = '19-25';
            else if (age <= 35) bin = '26-35';
            agesData[bin as keyof typeof agesData][g as keyof typeof agesData['19-25']]++;
        }
    });

    const allergiesRes = await db.execute({
        sql: `SELECT allergies FROM Patients p ${patientsWhereClause} AND allergies IS NOT NULL AND allergies != ''`,
        args: patientsArgs
    });

    const weightEvolutionRes = await db.execute({
        sql: `SELECT nf.followUpDate, nf.currentWeight, nf.currentBmi
              FROM NutritionalFollowUps nf
              JOIN NutritionalPlans np ON nf.planId = np.planId
              JOIN Patients p ON np.patientId = p.patientId
              ${patientsWhereClause.replace('WHERE', 'AND')}
              ORDER BY nf.followUpDate ASC`,
        args: patientsArgs
    });

    // --- 4. INJURIES ---
    let injuriesFilter = `WHERE createdAt >= datetime('now', ${dateModifier})`;
    let injuriesArgs: any[] = [];
    if(filterUserId && roleId === ROLES.ENTRENADOR) {
         injuriesFilter += ` AND coachId = ?`;
         injuriesArgs.push(filterUserId);
    } else if (filterUserId && (roleId === ROLES.DOCTOR || roleId === ROLES.JEFE_MEDICO)) {
         // Si es doctor viendo lesiones, filtrar por sus consultas
         injuriesFilter += ` AND consultationId IN (SELECT consultationId FROM Consultations c JOIN Appointments a ON c.appointmentId = a.appointmentId WHERE a.specialistId = ?)`;
         injuriesArgs.push(filterUserId);
    }

    const injuriesTypeRes = await db.execute({
        sql: `SELECT injuryType, COUNT(*) as count FROM Injuries ${injuriesFilter} GROUP BY injuryType ORDER BY count DESC`,
        args: injuriesArgs
    });

    const bodyZoneRes = await db.execute({
        sql: `SELECT bodyZone, COUNT(*) as count FROM Injuries ${injuriesFilter} GROUP BY bodyZone ORDER BY count DESC`,
        args: injuriesArgs
    });

    const severityRes = await db.execute({
        sql: `SELECT severity, COUNT(*) as count FROM Injuries ${injuriesFilter} GROUP BY severity`,
        args: injuriesArgs
    });

    const recoveryRes = await db.execute({
        sql: `SELECT injuryDate, estimatedRecovery 
              FROM Injuries ${injuriesFilter} AND estimatedRecovery IS NOT NULL`,
        args: injuriesArgs
    });

    // --- 5. NUTRITION ---
    let nutFilter = `WHERE creationDate >= date('now', ${dateModifier})`;
    let nutArgs: any[] = [];
    if (filterUserId && roleId === ROLES.NUTRIOLOGO) {
        nutFilter += ` AND nutritionistId = ?`;
        nutArgs.push(filterUserId);
    }
    
    // Cumplimiento
    let followupsFilter = `WHERE followUpDate >= date('now', ${dateModifier})`;
    let followupsArgs: any[] = [];
    if (filterUserId && roleId === ROLES.NUTRIOLOGO) {
        followupsFilter += ` AND planId IN (SELECT planId FROM NutritionalPlans WHERE nutritionistId = ?)`;
        followupsArgs.push(filterUserId);
    }

    const complianceRes = await db.execute({
        sql: `SELECT AVG(compliancePercentage) as avgCompliance FROM NutritionalFollowUps ${followupsFilter}`,
        args: followupsArgs
    });

    const nutDiagnosesRes = await db.execute({
        sql: `SELECT nutritionalDiagnosis, COUNT(*) as count 
              FROM NutritionalProfiles 
              WHERE nutritionalDiagnosis IS NOT NULL 
              GROUP BY nutritionalDiagnosis ORDER BY count DESC LIMIT 5`,
        args: []
    });

    const dischargesRes = await db.execute({
        sql: `SELECT goalReached, COUNT(*) as count
              FROM NutritionalDischarges nd
              JOIN NutritionalPlans np ON nd.planId = np.planId
              ${nutFilter}
              GROUP BY goalReached`,
        args: nutArgs
    });

    // --- 6. ALERTS & NOTES ---
    let notesFilter = `WHERE c.createdAt >= datetime('now', ${dateModifier})`;
    let notesArgs: any[] = [];
    if (filterUserId) {
        notesFilter += ` AND c.patientId IN (SELECT patientId FROM User_Patient WHERE userId = ?)`;
        notesArgs.push(filterUserId);
    }

    const alertsRes = await db.execute({
        sql: `SELECT isAlert, COUNT(*) as count FROM CollaborativeNotes c ${notesFilter} GROUP BY isAlert`,
        args: notesArgs
    });

    const alertsPerPatientRes = await db.execute({
        sql: `SELECT u.firstName || ' ' || u.lastName as patientName, COUNT(*) as count
              FROM CollaborativeNotes c
              JOIN Patients p ON c.patientId = p.patientId
              JOIN Users u ON p.patientId = u.userId
              ${notesFilter.replace('WHERE', 'AND')} AND c.isAlert = 1
              GROUP BY c.patientId
              ORDER BY count DESC LIMIT 5`,
        args: notesArgs
    });

    const notesPerUserRes = await db.execute({
        sql: `SELECT u.firstName || ' ' || u.lastName as authorName, r.roleName, COUNT(*) as count
              FROM CollaborativeNotes c
              JOIN Users u ON c.authorId = u.userId
              JOIN Roles r ON u.roleId = r.roleId
              ${notesFilter.replace('WHERE', 'AND')}
              GROUP BY c.authorId
              ORDER BY count DESC LIMIT 5`,
        args: notesArgs
    });

    // --- 7. FISIOTERAPIA ---
    const isFisio = roleId === ROLES.FISIOTERAPEUTA;
    let physioFilter = `WHERE ps.sessionDate >= date('now', ${dateModifier})`;
    let physioArgs: any[] = [];
    // Fisioterapeuta solo ve sus propios planes; admin/doctor ven todo (o filtrado)
    if (isFisio) {
        physioFilter += ` AND pp.physiotherapistId = ?`;
        physioArgs.push(user.userId);
    } else if (filterUserId && !isAdmin) {
        physioFilter += ` AND pp.physiotherapistId = ?`;
        physioArgs.push(filterUserId);
    }

    const therapyTypesRes = await db.execute({
        sql: `SELECT ps.therapyType, COUNT(*) as count
              FROM PhysiotherapySessions ps
              JOIN PhysiotherapyPlans pp ON ps.planId = pp.planId
              ${physioFilter}
              GROUP BY ps.therapyType ORDER BY count DESC LIMIT 8`,
        args: physioArgs
    });

    const physioAdherenceRes = await db.execute({
        sql: `SELECT
               COUNT(*) as totalSessions,
               SUM(CASE WHEN ps.status = 'Completada' THEN 1 ELSE 0 END) as completedSessions
              FROM PhysiotherapySessions ps
              JOIN PhysiotherapyPlans pp ON ps.planId = pp.planId
              ${physioFilter}`,
        args: physioArgs
    });
    const adRow = physioAdherenceRes.rows[0] as any;
    const physioAdherence = adRow?.totalSessions > 0
        ? Math.round((Number(adRow.completedSessions) / Number(adRow.totalSessions)) * 100)
        : 0;

    const painEvolutionRes = await db.execute({
        sql: `SELECT strftime('%Y-%m', ps.sessionDate) as month,
               ROUND(AVG(ps.painLevel), 1) as avgPain
              FROM PhysiotherapySessions ps
              JOIN PhysiotherapyPlans pp ON ps.planId = pp.planId
              ${physioFilter} AND ps.painLevel IS NOT NULL
              GROUP BY month ORDER BY month ASC`,
        args: physioArgs
    });

    const physioPlansCountRes = await db.execute({
        sql: `SELECT status, COUNT(*) as count
              FROM PhysiotherapyPlans pp
              ${isFisio ? 'WHERE physiotherapistId = ?' : (filterUserId && !isAdmin) ? 'WHERE physiotherapistId = ?' : 'WHERE 1=1'}
              GROUP BY status`,
        args: isFisio ? [user.userId] : (filterUserId && !isAdmin) ? [filterUserId] : []
    });

    const responseData = {
        general: {
            statusCounts,
            totalAppointments,
            workload: workloadRes.rows,
            totalPatients: totalPatientsRes.rows[0].count,
            activeUsers: activeUsersRes.rows
        },
        clinical: {
            diagnoses: diagnosisRes.rows,
            symptoms: topSymptoms,
            medications: medsRes.rows,
            treatments: treatmentDurationRes.rows
        },
        patients: {
            ages: agesData,
            allergiesCount: allergiesRes.rows.length,
            weightEvolution: weightEvolutionRes.rows
        },
        injuries: {
            types: injuriesTypeRes.rows,
            zones: bodyZoneRes.rows,
            severities: severityRes.rows,
            recoveryTimes: recoveryRes.rows
        },
        nutrition: {
            compliance: complianceRes.rows[0]?.avgCompliance || 0,
            diagnoses: nutDiagnosesRes.rows,
            discharges: dischargesRes.rows
        },
        alerts: {
            distribution: alertsRes.rows,
            alertsPerPatient: alertsPerPatientRes.rows,
            notesPerUser: notesPerUserRes.rows
        },
        physiotherapy: {
            therapyTypes: therapyTypesRes.rows,
            adherence: physioAdherence,
            painEvolution: painEvolutionRes.rows,
            plansByStatus: physioPlansCountRes.rows
        }
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: responseData });

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in reports API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
