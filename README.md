# Prueba de concepto — Payload / Payway

## Desarrollo local (PowerShell)

```powershell
cd C:\Users\cbrai\Documents\laburo\payload\prueba-payload
npm install
npm run dev
```

Web: http://localhost:3000 — Administración: http://localhost:3000/admin.
Usar el `.env` existente. Para otra instalación, copiar `.env.example` a `.env` y completar PostgreSQL y S3/MinIO. No publicar credenciales en Git.
La aplicación local comparte base y almacenamiento con la POC de Vercel. `push: false` impide sincronizaciones automáticas del esquema. El Docker Compose heredado de MongoDB no se usa.

## Editar la landing

1. Entrar en `/admin` con tu usuario y abrir **Pages → inicio**.
2. En la pestaña **Portada**, editar el título enriquecido y la imagen del **Banner**.
3. Abrir la pestaña **Secciones** y elegir una sección con los botones superiores. Solo aparece el bloque seleccionado; cambiar de sección conserva las ediciones sin guardar. Cada bloque contiene campos normales para textos, imágenes y enlaces, con listas para tarjetas, beneficios, cifras, navegación y columnas del footer. **Ordenar / agregar secciones** muestra la vista general compacta para organizar los bloques.
4. Subir o seleccionar imágenes desde Media. Si no hay archivo, se muestra el placeholder. El logo cargado reemplaza el logo de texto.
5. Configurar destinos con `/ruta`, `#seccion`, `https://...`, `mailto:...` o `tel:...`. Sin destino se muestra texto deshabilitado.
6. Guardar borrador para seguir trabajando y usar la previsualización con sesión iniciada. **Publicar** hace visibles los cambios en la landing. **Salir de previsualización** vuelve al contenido público.

Los bloques centrales se pueden agregar, reordenar, eliminar u ocultar con **Mostrar sección**. Se permite un encabezado y un footer, que siempre se muestran en sus posiciones fijas. Los elementos de cada lista también se pueden agregar, reordenar o quitar.

La página pública muestra solo la versión publicada de `inicio`; no hay textos de secciones fijos que reemplacen cambios o listas vacías. Los textos iniciales de la referencia se cargaron con la migración. La definición del editor está en `src/landing/blocks.ts`, los valores para páginas nuevas en `src/landing/defaults.ts` y la presentación en `LandingSection.tsx`.

Los cambios de contenido no requieren deploy una vez desplegado este código. Vercel seguirá usando su frontend anterior hasta que se desplieguen estos cambios de código.

## Migraciones

Se usa `blocksAsJSON: true`: el editor ofrece bloques y listas nativos de Payload, almacenados en JSONB con sus versiones. Agregar estos bloques a la POC requirió solo `pages.layout` y `_pages_v.version_layout`.

- `20260914_121053_baseline`: esquema inicial para bases vacías.
- `20260914_121251_editable_landing`: agrega las columnas y carga el contenido de `inicio`, conservando el banner, estado y versiones previas.
- En el droplet existente se verificó y registró el baseline con `scripts/adopt-existing-schema.mjs` antes de migrar. Ese script es para adoptar la POC anterior, no para bases nuevas. Respaldó páginas, versiones y registro de migraciones en `.local/backups` (ignorado por Git).

```powershell
npm run payload -- migrate:status
npm run payload -- migrate
```

Aplicar las migraciones antes de arrancar el nuevo código contra otra base. Para una base vacía, `migrate` crea todo desde el baseline. No ejecutar `migrate:fresh` en la base compartida. Exportar el contenido editado antes de cualquier rollback deliberado de la migración de landing.

## Verificación

```powershell
npx tsc --noEmit
npm run lint
node --import tsx scripts/verify-landing.ts
```

La prueba de integración requiere el servidor local, acceso a PostgreSQL y Chrome. Crea una página y un usuario temporales, verifica persistencia de bloques e imágenes, aislamiento de borradores, publicación, validación de URLs y el formulario de administración, y los elimina al terminar. Las capturas se guardan en `.local`.

