---
description: Auditoría de rendimiento enterprise completa - Analiza, reporta y aplica optimizaciones automáticamente
---

# 🚀 Performance Audit - Auditoría de Rendimiento Enterprise

Este workflow realiza una auditoría completa de rendimiento a nivel enterprise, analiza el código, genera reportes en español y **aplica fixes automáticamente**.

---

## Fase 0: Verificación de Auditorías Previas

Antes de comenzar, verificar si ya existe una auditoría SEO previa:

1. Buscar archivo de reporte SEO existente en el proyecto:

   - Buscar archivos como `SEO_AUDIT_REPORT.md`, `seo-report.md` o similares
   - Verificar si existe `.agent/workflows/seo.md` y si fue ejecutado recientemente

2. **Si NO existe auditoría SEO previa**:

   - Ejecutar primero el workflow `/seo` si existe
   - Si no existe el workflow, realizar análisis SEO básico como parte de esta auditoría

3. **Si YA existe auditoría SEO**:
   - Saltar la sección de SEO
   - Referenciar el reporte SEO existente en el reporte final

---

## Fase 1: Descubrimiento del Proyecto

// turbo-all

### 1.1 Detectar tipo de proyecto

Analizar la raíz del proyecto para identificar:

- `package.json` → Proyecto Node.js/npm
- `vite.config.*` → Proyecto Vite
- `next.config.*` → Proyecto Next.js
- `webpack.config.*` → Proyecto Webpack
- `tsconfig.json` → Proyecto TypeScript
- `tailwind.config.*` → Usa TailwindCSS
- Estructura de carpetas (`src/`, `app/`, `pages/`, `public/`)

### 1.2 Mapear estructura de archivos

Ejecutar:

```bash
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.css" -o -name "*.html" -o -name "*.vue" -o -name "*.svelte" \) | head -100
```

### 1.3 Identificar configuraciones de build

Leer archivos de configuración:

- `vite.config.ts/js`
- `next.config.js/mjs`
- `webpack.config.js`
- `rollup.config.js`
- `tsconfig.json`
- `package.json` (scripts de build)

---

## Fase 2: Análisis de Bundle y Assets

### 2.1 Analizar tamaño de bundle

Si es proyecto Node.js:

```bash
# Verificar si existe build
ls -la dist/ build/ .next/ out/ 2>/dev/null || echo "No build encontrado"

# Si no hay build, ejecutar build de producción
npm run build 2>/dev/null || yarn build 2>/dev/null || pnpm build 2>/dev/null
```

### 2.2 Analizar tamaños de archivos de salida

```bash
# Listar archivos de build con tamaños
find dist/ build/ .next/static/ out/ -type f \( -name "*.js" -o -name "*.css" \) -exec ls -lh {} \; 2>/dev/null | sort -k5 -h -r | head -20
```

### 2.3 Detectar assets sin optimizar

```bash
# Buscar imágenes grandes (>100KB)
find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" \) -size +100k 2>/dev/null | head -20

# Buscar imágenes que deberían ser WebP/AVIF
find public/ src/ assets/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) 2>/dev/null | wc -l
```

---

## Fase 3: Análisis de Compresión y Minificación

### 3.1 Verificar configuración de compresión

Buscar en `vite.config.ts/js`:

- Plugin `vite-plugin-compression` para Gzip/Brotli
- Configuración de `build.minify`
- Configuración de `build.cssMinify`

### 3.2 Verificar minificación de HTML

Buscar uso de:

- `html-minifier-terser`
- `vite-plugin-html`
- Configuración de minificación en el bundler

### 3.3 Verificar CSS optimization

Buscar:

- PurgeCSS configuration
- TailwindCSS purge settings
- CSS modules usage
- PostCSS configuration

---

## Fase 4: Análisis de Código

### 4.1 Detectar código muerto

```bash
# Buscar exports no utilizados (básico)
grep -r "export const\|export function\|export class" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l
```

### 4.2 Analizar imports pesados

Buscar imports problemáticos:

- `import _ from 'lodash'` (debería ser `import { specific } from 'lodash'`)
- `import moment from 'moment'` (considerar day.js o date-fns)
- `import * as` statements innecesarios

### 4.3 Verificar lazy loading

Buscar uso de:

- `React.lazy()` y `Suspense`
- Dynamic imports `import()`
- Route-based code splitting

### 4.4 Analizar dependencias

```bash
# Listar dependencias de producción
cat package.json | grep -A 100 '"dependencies"' | head -50
```

---

## Fase 5: Análisis de Performance Web

### 5.1 Verificar Core Web Vitals optimizations

Buscar en el código:

- `loading="lazy"` en imágenes
- `fetchpriority="high"` en recursos críticos
- `rel="preload"` para assets críticos
- `rel="preconnect"` para dominios externos

### 5.2 Verificar configuración de caché

Buscar:

- Service Worker implementation
- Cache headers configuration
- Static asset versioning

### 5.3 Analizar render-blocking resources

Buscar:

- CSS inline critical
- Scripts con `defer` o `async`
- Font loading strategy (`font-display: swap`)

---

## Fase 6: Aplicar Fixes Automáticos

> [!IMPORTANT]
> Esta fase aplica optimizaciones automáticamente. Cada fix será documentado.

### 6.1 Optimizaciones de Vite/Build Config

Si no existe, agregar:

- Plugin de compresión Brotli/Gzip
- Configuración óptima de minificación
- Manualchunks para vendor splitting

### 6.2 Optimizaciones de Imágenes

- Agregar `loading="lazy"` a imágenes que no lo tengan
- Sugerir conversión a WebP/AVIF

### 6.3 Optimizaciones de Código

- Agregar dynamic imports donde sea apropiado
- Optimizar imports de librerías pesadas

### 6.4 Optimizaciones de CSS

- Agregar configuración de purge si no existe
- Optimizar font loading

### 6.5 Optimizaciones de HTML

- Agregar preconnect/preload hints
- Optimizar meta tags de performance

---

## Fase 7: Generación del Reporte

Crear archivo `PERFORMANCE_AUDIT_REPORT.md` en la raíz del proyecto con:

### Estructura del Reporte

```markdown
# 📊 Reporte de Auditoría de Performance

## 📋 Resumen Ejecutivo

- Score general: X/100
- Fecha de auditoría: [fecha]
- Tipo de proyecto: [tipo]

## 🔴 Issues Críticos Encontrados

[Lista de issues críticos]

## 🟡 Issues de Prioridad Media

[Lista de issues medios]

## 🟢 Issues de Prioridad Baja

[Lista de issues bajos]

## ✅ Optimizaciones Aplicadas

[Lista de fixes aplicados automáticamente]

## 📈 Métricas

- Bundle size total: X KB
- Archivos JS: X (X KB)
- Archivos CSS: X (X KB)
- Imágenes: X (X KB)

## 📝 Recomendaciones Adicionales

[Recomendaciones que requieren cambios manuales]

## 🔗 Referencias

- [Link a auditoría SEO si existe]
- [Documentación relevante]
```

---

## Fase 8: Verificación Final

### 8.1 Ejecutar build de verificación

```bash
npm run build
```

### 8.2 Comparar métricas antes/después

- Documentar reducción de tamaño
- Documentar optimizaciones aplicadas

### 8.3 Generar resumen de cambios

Listar todos los archivos modificados y qué optimización se aplicó.

---

## Notas de Uso

- **Idioma**: Todos los reportes se generan en **español**
- **Automatización**: El agente aplica fixes automáticamente
- **SEO**: Si ya existe `/seo`, no se repite el análisis SEO
- **Compatibilidad**: Funciona con React, Vue, Next.js, Vite, y proyectos vanilla
