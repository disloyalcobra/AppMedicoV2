# Resolución de Errores de Build (Vercel) - Bitácora Técnica

Este documento registra los problemas estructurales de tipado e infraestructura que impedían el despliegue de **AppMedicoV2** en Vercel y las acciones tomadas para resolverlos con cero errores (0 errors, 0 warnings) de Astro.

## 1. Colisión de Enrutamiento (SSR Hard Error)
**El Problema:**
Vercel y Astro lanzaban un error fatal en tiempo de construcción al detectar la ruta `/patients/[id].astro` y `/patients/[patientId].astro` existiendo en el mismo directorio simultáneamente. Astro, en modo Server-Side Rendering (SSR), no puede tener dos archivos dinámicos compitiendo bajo el mismo formato en la misma jerarquía.

**La Solución:**
- Eliminación definitiva del archivo duplicado y obsoleto `src/pages/patients/[patientId].astro`.
- El sistema de expedientes se unificó correctamente para funcionar únicamente sobre la ruta estándar `/patients/[id]`.

## 2. Incompatibilidad de Tipos entre Turso y HTML (InValue Mismatch)
**El Problema:**
La base de datos Turso devuelve (y recibe) ciertos valores identificadores numéricos y llaves primarias en formato `bigint`. Sin embargo, TypeScript y la capa frontend (etiquetas HTML como `<input value={...}>`, `<option value={...}>` y argumentos de URL) requieren primitivos de tipo `string` enteros.

Esto producía más de 30 errores simultáneos del tipo:
> *Type 'Value' / 'bigint' is not assignable to type 'string | number | string[] | null | undefined'.*
> *Type 'string | undefined' is not assignable to type 'InValue'.*

**La Solución:**
- **Inyección SQL con `args`:** Todos los envíos de ID's hacia las tablas de Turso a través de `db.execute({ args: [...] })` fueron envueltos en `String(id)`. Esto incluye el alta de recetas médicas, pacientes, consultas y formularios nutricionales.
- **Formularios Dinámicos (FormData):** Se aplicaron *castings* estrictos `(data.get('algo') as string)` en lugar de envíos directos de los punteros hacia Turso, resolviendo las validaciones en `src/pages/nutrition/profiles/add.astro` y otros archivos parecidos.
- **Renderizado de Astro:** En archivos como `AppointmentForm.astro`, `prescriptions/[id].astro`, y perfiles de usuario, se forzó a texto la inyección al DOM de los valores: `<option value={String(valorId)}>` o `<input value={String(p.weight)}>`.

## 3. Tipado Estricto de Propiedades (Props) en Dashboards
**El Problema:**
El compilador bloqueaba los Dashboards (Admin, Doctor, Student, Nutritionist y Coach) alegando que la propiedad visual `colorClass` "no existía" al llamar al componente base `<StatsCard />`.

**La Solución:**
- El archivo `StatsCard.astro` no publicaba formalmente sus requerimientos. Se integró `export interface Props { ... }` detallando todos los valores visuales opcionales y el `trendLabel`.
- Se flexibilizó explícitamente el origen de `value: any` dentro de dicha Interface, para que tanto enteros locales (Astro) como conteos traídos de Turso (`Total: 10`) procesen limpiamente en las tarjetas sin arrojar conflictos.

## 4. Protección contra Variables Nulas y Fugas en TS (ts-6133)
**El Problema:**
Había errores potenciales de ejecución y advertencias acumuladas que en un entorno remoto en Vercel son riesgosas:
1. Validaciones o comparaciones asumiendo la existencia segura de `user.userId`, lo que rompería la UX (arroja *User is undefined*) si la petición ocurre mientras expiró la variable de sesión en caché (ej. ruta `users/index.astro`).
2. Declaración e importación de utilidades o variables internas nunca llamadas ni renderizadas produciendo reportes basura de compilación.

**La Solución:**
- Aplicación extensa del Operador de Encadenamiento Opcional `user?.userId` a largo y ancho del proyecto.
- Retiro ordenado de código "muerto" y variables estáticas (`let success = false`, utilidades temporales `newPlanRes`) en `register.astro`, `[id].astro` de usuarios, pacientes y nutrición.

## Estado Final
Al terminar la limpieza en profundidad, la orden de compilación emite:
`Result: - 0 errors`
`Exit code: 0`

El código de la rama principal (`main`) actualmente posee estabilidad absoluta en tipos, haciendo de cada despliegue posterior un proceso confiable y automático.
