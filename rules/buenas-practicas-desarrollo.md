---
trigger: always_on
---

Nomenclatura y estructura

Usa snake_case para nombres de tablas y columnas en PostgreSQL (ej. patient_id, no patientId)
Nunca guardes contraseñas en texto plano; delega siempre a Supabase Auth
Define índices en todas las claves foráneas y en columnas que uses frecuentemente en filtros (status, dateTime, patientId)
Usa TIMESTAMPTZ (con zona horaria) en lugar de TIMESTAMP para todos los campos de fecha/hora

Seguridad con RLS

Activa RLS en todas las tablas desde el inicio, nunca lo dejes para el final
Escribe políticas separadas para SELECT, INSERT, UPDATE y DELETE
Nunca uses USING (true) en producción — siempre filtra por rol o por el auth.uid()
Prueba tus políticas RLS cambiando de sesión entre roles antes de hacer deploy

Integridad de datos

Define siempre NOT NULL en campos obligatorios; no lo dejes al frontend
Usa CHECK constraints para valores acotados (ej. estado de cita, género)
Los triggers de descuento de inventario deben ser atómicos (dentro de una transacción)


🧑‍💻 Código (Frontend / React)
Organización del proyecto

Estructura por módulo/feature, no por tipo de archivo:

  /features
    /appointments
    /patients
    /inventory

Un componente = un archivo; máximo ~200 líneas por componente
Separa la lógica de negocio de la UI: usa custom hooks (useAppointments, useInventory) para llamadas a Supabase

Buenas prácticas de React

Usa TypeScript desde el inicio — evita errores de tipos en runtime
Define interfaces para cada tabla de la BD y reutilízalas en toda la app
No hagas llamadas a Supabase directamente desde componentes UI; centraliza en servicios o hooks
Maneja siempre los tres estados: loading, error y success

Formularios y validación

Valida en el frontend y en la base de datos (nunca solo en uno)
Usa librerías como react-hook-form + zod para validación tipada
Deshabilita el botón de submit mientras se ejecuta una petición (evita doble envío)


🔐 Seguridad

Nunca expongas claves de Supabase en el código del cliente (usa solo la anon key pública, nunca la service_role key)
Guarda variables sensibles en .env y agrégalas al .gitignore
Sanitiza todo input del usuario antes de enviarlo a la BD
Los endpoints de Supabase Storage deben tener políticas de bucket: los archivos clínicos solo deben ser accesibles por el Doctor y Administrador, nunca públicos
Implementa expiración de sesión y redirect al login automático


📁 Control de Versiones (Git)

Trabaja con ramas: main (producción), develop (desarrollo), feature/nombre-modulo
Commits pequeños y descriptivos en español:

✅ feat: agregar formulario de nueva cita
❌ cambios varios


Nunca hagas commit directo a main
Usa Pull Requests con revisión antes de integrar cambios importantes
Agrega un .gitignore desde el día 1 (excluir .env, node_modules, archivos de build)


🧪 Pruebas

Prueba cada módulo antes de integrarlo con los demás
Crea al menos un usuario de cada rol y verifica que las restricciones RLS funcionen correctamente
Prueba los triggers de inventario con casos borde: stock en 0, medicamento vencido
Usa datos de prueba realistas (nombres, fechas, diagnósticos ficticios pero coherentes)


🚀 Despliegue

Usa variables de entorno distintas para development y production en Supabase (dos proyectos separados)
No apliques migraciones de base de datos en producción sin respaldar primero
Documenta cada migración con comentarios explicando el cambio
Activa los backups automáticos de Supabase en el plan de producción