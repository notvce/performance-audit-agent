# Performance Audit Agent - Integración con Google Antigravity

## 📋 Resumen de Instalación en Antigravity

Este archivo contiene instrucciones específicas para integrar el Performance Audit Agent con Google Antigravity usando MCP (Model Context Protocol).

## 🔧 Método 1: Usando NPX (Más Simple)

### Configuración en Antigravity

```javascript
// antigravity.config.js
export default {
  mcpServers: {
    'performance-audit-agent': {
      command: 'npx',
      args: ['-y', '@universal/performance-audit-agent'],
      env: {
        // Variables de entorno opcionales
        // NODE_ENV: 'production'
      },
      timeout: 60000, // 60 segundos para auditorías grandes
      description: 'Universal performance audit agent with enterprise-grade analysis'
    }
  }
}
```

**Ventajas:**
- ✅ No requiere instalación previa
- ✅ Siempre usa la última versión
- ✅ Fácil de mantener

## 📦 Método 2: Instalación Global

### Paso 1: Instalar globalmente

```bash
npm install -g @universal/performance-audit-agent
```

### Paso 2: Configuración en Antigravity

```javascript
// antigravity.config.js
export default {
  mcpServers: {
    'performance-audit-agent': {
      command: 'performance-audit',
      args: ['mcp'],
      env: {
        // Opcional: personalizar rutas o thresholds
        PERFORMANCE_AUDIT_CONFIG: '/path/to/custom-config.json'
      },
      timeout: 60000,
      description: 'Universal performance audit agent with enterprise-grade analysis'
    }
  }
}
```

**Ventajas:**
- ✅ Ejecución rápida sin descargar cada vez
- ✅ Funciona offline
- ✅ Mejor rendimiento

## 🛠️ Método 3: Desarrollo Local (Para Desarrolladores)

### Paso 1: Enlazar proyecto local

```bash
cd /ruta/a/performance-audit-agent
npm link
```

### Paso 2: Configuración en Antigravity

```javascript
// antigravity.config.js
export default {
  mcpServers: {
    'performance-audit-agent': {
      command: 'node',
      args: ['/ruta/a/performance-audit-agent/dist/mcp-server.js'],
      env: {
        DEBUG: 'true' // Para ver logs de depuración
      },
      timeout: 60000,
      description: 'Universal performance audit agent with enterprise-grade analysis'
    }
  }
}
```

**Ventajas:**
- ✅ Pruebas rápidas de cambios
- ✅ Depuración en tiempo real
- ✅ Desarrollo iterativo

## 🚀 Uso en Antigravity

Una vez configurado, el agente estará disponible como herramientas MCP en Antigravity.

### Ejemplos de Comandos

#### 1. Detectar Proyecto
```
Analiza este repositorio y detecta el lenguaje, framework y herramientas de build
```

#### 2. Auditoría Completa
```
Realiza una auditoría completa de performance de este repositorio incluyendo:
- Lighthouse audit
- Bundle analysis
- Compression analysis
- Minification analysis
- Image optimization

Genera un reporte HTML con todas las visualizaciones.
```

#### 3. Análisis Específico de Bundles
```
Analiza el tamaño y composición de los bundles de este proyecto. 
Identifica oportunidades de code splitting y dependencias duplicadas.
```

#### 4. Optimización de Imágenes
```
Optimiza todas las imágenes en el directorio public/images:
- Convierte a formato WebP
- Aplica compresión con calidad 85
- Agrega lazy loading para imágenes below the fold
```

#### 5. Recomendaciones de Performance
```
Genera recomendaciones de optimización priorizadas para este proyecto.
Enfócate en items críticos y de alto impacto con estimación de mejora.
```

## 📊 Herramientas MCP Disponibles

### `detect_project()`
**Propósito:** Detectar configuración del proyecto
**Parámetros:**
- `path` (opcional): Ruta al directorio del proyecto

**Retorna:**
- `language`: JavaScript/TypeScript, Python, Java, etc.
- `framework`: React, Vue, Angular, Django, etc.
- `buildTool`: npm, webpack, vite, gradle, maven, etc.
- `confidence`: Porcentaje de confianza en la detección

### `audit_repository()`
**Propósito:** Ejecutar auditoría completa de performance
**Parámetros:**
- `url` (opcional): URL para auditoría Lighthouse
- `format` (opcional): 'html' | 'json' | 'markdown' (default: html)
- `outputPath` (opcional): Ruta para guardar reportes
- `includeLighthouse` (opcional): Incluir audit Lighthouse (default: true)
- `includeBundleAnalysis` (opcional): Incluir análisis de bundles (default: true)
- `includeCompression` (opcional): Incluir análisis de compresión (default: true)
- `includeMinification` (opcional): Incluir minificación (default: true)
- `includeImageOptimization` (opcional): Incluir optimización de imágenes (default: true)

**Retorna:** Resultados completos de auditoría con métricas y recomendaciones

### `analyze_bundle()`
**Propósito:** Analizar tamaño y composición de bundles
**Parámetros:**
- `path` (opcional): Ruta al proyecto
- `outputPath` (opcional): Ruta para guardar análisis

**Retorna:**
- Tamaños original, minificado, gzip, brotli
- Largest chunks
- Oportunidades de code splitting
- Dependencias duplicadas
- Potencial de tree shaking

### `compress_assets()`
**Propósito:** Aplicar compresión Gzip y Brotli
**Parámetros:**
- `path` (opcional): Ruta de assets (default: dist/build)
- `apply` (opcional): Aplicar compresión a archivos (default: false - solo análisis)
- `outputPath` (opcional): Ruta para guardar archivos comprimidos

**Retorna:**
- Ratios de compresión por archivo
- Promedio Gzip vs Brotli
- Formato recomendado

### `minify_code()`
**Propósito:** Minificar JavaScript, CSS y HTML
**Parámetros:**
- `path` (opcional): Ruta de archivos (default: dist)
- `apply` (opcional): Aplicar minificación (default: false - solo análisis)
- `outputPath` (opcional): Ruta para guardar archivos minificados

**Retorna:**
- Estadísticas por tipo (JS, CSS, HTML)
- Porcentajes de reducción
- Número de archivos procesados

### `optimize_images()`
**Propósito:** Optimizar imágenes con formatos modernos
**Parámetros:**
- `path` (opcional): Ruta de imágenes
- `apply` (opcional): Aplicar optimizaciones (default: false)
- `outputPath` (opcional): Ruta para guardar imágenes optimizadas
- `formats` (opcional): Formatos objetivo (default: ["webp"])

**Retorna:**
- Número total de imágenes
- Tamaño original vs optimizado
- Porcentaje de reducción
- Conversiones de formato realizadas

### `generate_report()`
**Propósito:** Generar reporte profesional
**Parámetros:**
- `auditResults` (requerido): JSON con resultados de auditoría
- `format` (opcional): 'html' | 'json' | 'markdown' (default: html)
- `outputPath` (opcional): Ruta para guardar reporte
- `includeVisualizations` (opcional): Incluir charts y gráficas (default: true)

**Retorna:**
- Ruta del archivo de reporte
- Tamaño del reporte
- Timestamp de generación

### `suggest_optimizations()`
**Propósito:** Generar recomendaciones optimizadas
**Parámetros:**
- `auditResults` (requerido): JSON con resultados de auditoría
- `priority` (opcional): Filtrar por prioridad ('all', 'critical', 'high', 'medium', 'low')
- `category` (opcional): Filtrar por categoría

**Retorna:**
- Lista de recomendaciones agrupadas por prioridad
- Impacto estimado por recomendación
- Código de ejemplo para cada recomendación

## 🔧 Configuración Avanzada

### Personalizar Thresholds

Crea un archivo `performance-audit.config.json` en tu proyecto:

```json
{
  "lighthouse": {
    "thresholds": {
      "performance": 90,
      "accessibility": 90,
      "best-practices": 90,
      "seo": 90
    }
  },
  "bundle": {
    "maxSize": 500000,
    "maxInitialChunks": 3
  },
  "compression": {
    "preferBrotli": true,
    "gzipLevel": 9,
    "brotliQuality": 11
  },
  "images": {
    "formats": ["webp", "avif"],
    "quality": 85,
    "lazyLoading": true
  }
}
```

Luego configura Antigravity para usarlo:

```javascript
// antigravity.config.js
export default {
  mcpServers: {
    'performance-audit-agent': {
      command: 'npx',
      args: ['-y', '@universal/performance-audit-agent'],
      env: {
        PERFORMANCE_AUDIT_CONFIG: './performance-audit.config.json'
      },
      timeout: 60000
    }
  }
}
```

## 🚨 Solución de Problemas

### El servidor MCP no se inicia

**Síntoma:** Mensaje de error al conectar con el agente

**Soluciones:**
1. Verificar que `@universal/performance-audit-agent` está instalado
2. Comprobar que el comando `node` está disponible
3. Revisar logs de Antigravity para errores específicos

### Errores de permisos

**Síntoma:** "Permission denied" o "EACCES"

**Soluciones:**
1. Asegurar que el proyecto tiene permisos de ejecución
2. Usar `npm link` con permisos de administrador si es necesario

### Timeout en auditorías grandes

**Síntoma:** Auditoría se corta antes de terminar

**Soluciones:**
1. Aumentar el valor de `timeout` en la configuración
2. Ejecutar auditorías parciales (solo bundles, solo imágenes, etc.)

## 📈 Mejores Prácticas en Antigravity

### Workflow Recomendado

1. **Detectar proyecto primero:**
   ```
   "Detecta el tipo de este proyecto y sugiere las herramientas MCP apropiadas"
   ```

2. **Auditoría inicial:**
   ```
   "Ejecuta auditoría completa de performance en este repositorio"
   ```

3. **Iterar por categorías:**
   ```
   "Primero optimiza los bundles, luego las imágenes, y finalmente genera el reporte final"
   ```

4. **Implementar recomendaciones:**
   ```
   "Usa las recomendaciones del agente para mejorar el código paso a paso"
   ```

### Tips de Productividad

- **Usar prompts específicos:** Más específico es el prompt, mejor el resultado
- **Iterar con el agente:** No intentar hacer todo en una sola solicitud
- **Guardar resultados:** Guardar los reportes generados para referencia futura
- **Configurar thresholds:** Personalizar los objetivos según necesidades del proyecto

## 📞 Recursos de Soporte

- Documentación principal: `README.md` en el proyecto del agente
- Guía para agentes AI: `AGENTS.md` en el proyecto del agente
- Problemas conocidos: Revisar `PROJECT_STATUS.md`
- Configuración de ejemplo: `config/default-config.json`

---

**Última actualización:** Enero 2026  
**Versión del agente:** 1.0.0  
**Compatibilidad:** Antigravity con soporte MCP