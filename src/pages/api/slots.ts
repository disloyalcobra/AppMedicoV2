import type { APIRoute } from 'astro';
import { db } from '../../turso';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const dateStr = url.searchParams.get('date'); // Expected YYYY-MM-DD

    if (!doctorId || !dateStr) {
        return new Response(JSON.stringify({ error: 'doctorId and date are required' }), { status: 400 });
    }

    try {
        const date = new Date(dateStr);
        // JS getDay(): 0 (Dom), 1 (Lun), ..., 6 (Sab)
        const dayOfWeek = date.getDay();

        // 1. Get doctor's availability for this day
        const availRes = await db.execute({
            sql: `SELECT * FROM Doctor_Availability WHERE doctorId = ? AND dayOfWeek = ? AND isActive = 1`,
            args: [doctorId, dayOfWeek]
        });

        if (availRes.rows.length === 0) {
            return new Response(JSON.stringify({ slots: [], message: 'El doctor no tiene disponibilidad configurada para este día.' }), { status: 200 });
        }

        const avail = availRes.rows[0];
        const { startTime, endTime, slotDuration } = avail as any;

        // 2. Get existing appointments for this doctor on this date
        // Note: we need to filter status 'Pendiente' and 'Confirmada'
        const apptRes = await db.execute({
            sql: `SELECT dateTime FROM Appointments 
                  WHERE doctorId = ? 
                  AND DATE(dateTime) = DATE(?) 
                  AND status IN ('Pendiente', 'Confirmada')`,
            args: [doctorId, dateStr]
        });

        const takenSlots = apptRes.rows.map(r => {
            const dt = new Date(r.dateTime as string);
            return dt.toTimeString().substring(0, 5); // HH:mm
        });

        // 3. Generate slots
        const slots: string[] = [];
        let current = new Date(`${dateStr}T${startTime}`);
        const end = new Date(`${dateStr}T${endTime}`);

        while (current < end) {
            const timeStr = current.toTimeString().substring(0, 5);
            if (!takenSlots.includes(timeStr)) {
                slots.push(timeStr);
            }
            current = new Date(current.getTime() + slotDuration * 60000);
        }

        return new Response(JSON.stringify({ slots }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
