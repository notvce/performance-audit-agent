---
description: Auditoría SEO completa - Analiza meta tags, structured data, accesibilidad y optimización para buscadores
---

# 🔍 SEO Audit - Auditoría SEO Completa

Este workflow realiza una auditoría SEO exhaustiva y aplica optimizaciones automáticamente.

---

## Fase 1: Análisis de Meta Tags

// turbo-all

### 1.1 Verificar meta tags básicos

Buscar en archivos HTML/componentes:

- `<title>` - Debe existir y ser único por página
- `<meta name="description">` - 150-160 caracteres
- `<meta name="viewport">` - Para responsive
- `<meta charset="UTF-8">`

### 1.2 Verificar Open Graph

Buscar:

- `og:title`
- `og:description`
- `og:image`
- `og:url`
- `og:type`

### 1.3 Verificar Twitter Cards

Buscar:

- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

---

## Fase 2: Análisis de Structured Data

### 2.1 Verificar JSON-LD

Buscar scripts de tipo `application/ld+json`:

```bash
grep -r "application/ld+json" src/ public/ --include="*.html" --include="*.tsx" --include="*.jsx" 2>/dev/null
```

### 2.2 Schemas recomendados

Verificar existencia de:

- Organization
- WebSite
- WebPage
- BreadcrumbList
- FAQPage (si aplica)
- Product (si es e-commerce)

---

## Fase 3: Análisis de Accesibilidad SEO

### 3.1 Verificar heading hierarchy

- Solo un `<h1>` por página
- Jerarquía correcta (h1 > h2 > h3...)
- Headings descriptivos

### 3.2 Verificar alt text en imágenes

```bash
# Buscar imágenes sin alt
grep -r "<img" src/ --include="*.tsx" --include="*.jsx" --include="*.html" | grep -v "alt=" 2>/dev/null | head -20
```

### 3.3 Verificar links

- Links con texto descriptivo (no "click aquí")
- `rel="noopener noreferrer"` en links externos
- Links internos funcionando

---

## Fase 4: Análisis de URLs y Navegación

### 4.1 Verificar estructura de URLs

- URLs limpias y descriptivas
- Sin parámetros innecesarios
- Uso de slugs semánticos

### 4.2 Verificar sitemap

Buscar:

- `sitemap.xml` en public/
- Generación automática de sitemap

### 4.3 Verificar robots.txt

Buscar:

- `robots.txt` en public/
- Configuración correcta de Allow/Disallow

---

## Fase 5: Análisis de Performance SEO

### 5.1 Verificar canonical URLs

```bash
grep -r "canonical" src/ public/ --include="*.html" --include="*.tsx" --include="*.jsx" 2>/dev/null
```

### 5.2 Verificar hreflang (si es multiidioma)

Buscar tags `hreflang` para diferentes idiomas

### 5.3 Verificar lazy loading

- Imágenes con `loading="lazy"`
- Contenido crítico visible sin JavaScript

---

## Fase 6: Aplicar Fixes Automáticos

### 6.1 Agregar meta tags faltantes

Si no existen, crear/agregar:

- Meta description
- Open Graph tags
- Twitter Cards

### 6.2 Agregar structured data básico

Si no existe, agregar JSON-LD para:

- Organization
- WebSite

### 6.3 Agregar sitemap.xml

Si no existe, crear sitemap básico o agregar dependencia para generación automática

### 6.4 Agregar robots.txt

Si no existe, crear con configuración estándar

### 6.5 Optimizar imágenes para SEO

- Agregar alt text genérico donde falte
- Agregar loading="lazy"

---

## Fase 7: Generación del Reporte

Crear archivo `SEO_AUDIT_REPORT.md` con:

```markdown
# 🔍 Reporte de Auditoría SEO

## 📋 Resumen

- Score SEO: X/100
- Fecha: [fecha]
- Páginas analizadas: X

## ✅ Elementos Correctos

[Lista de elementos SEO implementados correctamente]

## ⚠️ Elementos Faltantes

[Lista de elementos SEO que faltan]

## ✅ Optimizaciones Aplicadas

[Lista de fixes aplicados automáticamente]

## 📝 Recomendaciones

[Recomendaciones adicionales]
```

---

## Notas

- **Idioma**: Reportes en español
- **Automatización**: Aplica fixes automáticamente
- **Integración**: Se puede invocar desde `/performance-audit` o independientemente
