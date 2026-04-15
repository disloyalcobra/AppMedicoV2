# Medinote — Guía de Uso

> Esta guía te explica cómo usar tu aplicación paso a paso.

---

## Cómo Acceder

**URL:** [https://app-medico-v2.vercel.app/login](https://app-medico-v2.vercel.app/login)

**Para iniciar sesión:**
1. Ve a la URL de arriba
2. Ingresa tu correo electrónico registrado
3. Ingresa tu contraseña
4. Haz clic en "Ingresar al Sistema"

**Nota:** Si no tienes una cuenta, contacta al administrador del sistema para que te cree una.

---

## Funcionalidades por Rol

### Para Médicos y Jefes Médicos

**Qué es:** Como médico tienes acceso a la gestión completa de pacientes, citas y consultas.

**Cómo usar el Dashboard:**
1. Al iniciar sesión verás tu panel con:
   - Pacientes totales en el sistema
   - Citas programadas para hoy
   - Citas de la semana
   - Alertas activas (lesiones, stock bajo, notas importantes)

**Gestión de Pacientes:**
1. En el menú lateral izquierdo, haz clic en "Pacientes"
2. Verás la lista de todos tus pacientes registrados
3. Para agregar uno nuevo: haz clic en "Agregar Paciente" (botón azul arriba a la derecha)
4. Para ver detalles de un paciente: haz clic en su nombre
5. En la ficha del paciente podrás:
   - Ver su información personal
   - Registrar nuevas consultas
   - Ver historial médico
   - Asignar notas o alertas

**Agenda de Citas:**
1. Haz clic en "Agenda" en el menú lateral
2. Verás el calendario con citas programadas
3. Para crear una nueva cita:
   - Haz clic en "Nueva Cita"
   - Selecciona el paciente
   - Elige fecha y hora
   - Guarda

**Consultas Médicas:**
1. Ve a "Consultas" en el menú
2. Aquí registras las visitas de los pacientes
3. Cada consulta queda vinculada al historial del paciente

**Lesiones Deportivas:**
1. Accede a "Lesiones" desde el menú
2. Registra lesiones de pacientes deportistas
3. Puedes hacer seguimiento del estado (Activa, En recuperación, Curada)
4. Asigna planes de rehabilitación

---

### Para Nutriólogos

**Qué es:** Módulo especializado para gestión nutricional de pacientes.

**Cómo usarlo:**
1. Desde el dashboard verás tus planes nutricionales activos
2. En el menú lateral, selecciona "Nutrición"
3. **Perfiles Nutricionales:**
   - Crea perfiles para cada paciente
   - Registra medidas antropométricas (peso, altura, IMC)
   - Define objetivos (subir/bajar peso, mantenimiento)
4. **Planes Alimenticios:**
   - Diseña planes personalizados
   - Asigna a pacientes específicos
   - Los pacientes pueden aceptar los planes desde su cuenta
5. **Seguimientos:**
   - Registra visitas de seguimiento
   - Compara evolución entre citas

---

### Para Entrenadores

**Qué es:** Acceso a pacientes deportistas y seguimiento de su condición física.

**Cómo usarlo:**
1. Tu dashboard muestra el estado físico de tus atletas asignados
2. En "Pacientes" ves solo a los deportistas que te asignaron
3. Puedes:
   - Ver su condición física actual
   - Registrar lesiones deportivas
   - Consultar sus planes nutricionales
   - Ver notas de médicos y nutriólogos

---

### Para Estudiantes

**Qué es:** Vista personal donde el estudiante ve su propio expediente médico.

**Cómo acceder:**
1. Al iniciar sesión serás redirigido automáticamente a "Mi Expediente"
2. Aquí podrás ver:
   - Tu información personal
   - Citas médicas programadas
   - Historial de consultas
   - Planes nutricionales asignados (si aplica)
   - Notas de los médicos sobre tu caso

**Tips:**
- No puedes editar tu información directamente
- Para actualizar datos, contacta al personal médico

---

### Para Staff (Administrativo)

**Qué es:** Gestión del inventario de medicamentos y suministros.

**Cómo usarlo:**
1. Al iniciar sesión serás redirigido directamente al "Inventario"
2. Aquí podrás:
   - Ver medicamentos en stock
   - Registrar entradas de nuevos medicamentos
   - Registrar salidas (dispensación)
   - Configurar puntos de reorden (alertas cuando el stock es bajo)
   - Ver alertas de medicamentos por agotarse

---

### Para Administradores

**Qué es:** Panel global con estadísticas y gestión completa del sistema.

**Cómo usarlo:**
1. El dashboard muestra estadísticas globales:
   - Total de pacientes en el sistema
   - Citas de hoy y de la semana
   - Alertas activas del sistema
2. En "Usuarios" puedes:
   - Crear nuevos usuarios
   - Asignar roles (médico, nutriólogo, entrenador, etc.)
   - Activar o desactivar cuentas
3. En "Reportes" accedes a reportes globales del sistema

---

## Alertas y Notas

**Qué son:** Sistema de comunicación entre profesionales de la salud sobre pacientes.

**Cómo usarlo:**
1. Ve a "Alertas y Notas" en el menú lateral
2. Aquí verás:
   - Notas de otros médicos sobre pacientes
   - Alertas de stock bajo (si eres Staff)
   - Alertas de lesiones activas
3. Para crear una nota:
   - Haz clic en "Nueva Nota"
   - Selecciona el paciente
   - Escribe la nota
   - Marca como "Alerta" si es urgente
   - Guarda

---

## Preguntas Frecuentes

**¿Qué hago si no puedo entrar?**
- Verifica que estés escribiendo correctamente tu correo y contraseña
- Asegúrate de que tu cuenta esté activa (contacta al administrador si fue desactivada)
- Si olvidaste tu contraseña, contacta al administrador para que te la restablezca

**¿Puedo cambiar mi contraseña?**
- Sí, contacta al administrador para actualizar tu contraseña

**¿Puedo acceder desde mi celular?**
- Sí, la aplicación es responsive y funciona en dispositivos móviles. Solo necesitas un navegador web.

**¿Los datos están seguros?**
- Sí. La aplicación utiliza:
  - Conexión segura HTTPS
  - Base de datos encriptada en Turso
  - Contraseñas encriptadas con bcrypt
  - Control de acceso basado en roles

**¿Qué pasa si hay un error?**
- Toma captura de pantalla del error
- Contacta a soporte indicando qué estabas haciendo cuando ocurrió
- El sistema guarda logs de errores para diagnóstico

**¿Quién tiene acceso a mi información?**
- Solo los profesionales de salud autorizados que están tratando tu caso
- Los administradores del sistema
- Tú (si eres estudiante, solo ves tu propia información)

**¿Puedo compartir mi cuenta?**
- No. Cada usuario debe tener su propia cuenta. Compartir cuentas viola las políticas de privacidad del sistema.

---

## Soporte

Si tienes algún problema o pregunta:

- **Contacto:** josepablomateosgamboa@gmail.com
- **Desarrollador:** José Pablo Mateos Gamboa
- **Institución:** Universidad Madero (UMAD)

---

## Glosario

| Término | Significado |
|---------|-------------|
| Dashboard | Panel principal con resumen de información |
| Paciente | Persona registrada en el sistema que recibe atención médica |
| Cita | Programación de una consulta médica en fecha y hora específicas |
| Consulta | Visita médica registrada con diagnóstico y tratamiento |
| Expediente | Historial médico completo de un paciente |
| Perfil Nutricional | Datos de composición corporal y objetivos nutricionales |
| Plan Alimenticio | Dieta personalizada diseñada por el nutriólogo |
| Lesión Activa | Lesión deportiva que está siendo tratada actualmente |
| Stock | Cantidad de medicamentos disponibles en inventario |
| Alerta | Notificación importante que requiere atención |
| RBAC | Sistema de control de acceso basado en roles (quién puede ver qué) |

---

*Documentación generada el 4 de abril, 2026*
*Desarrollado por José Pablo Mateos Gamboa - Estudiante UMAD*
