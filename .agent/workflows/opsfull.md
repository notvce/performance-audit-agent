---
description: Auditoría completa + verificación + deploy - Ejecuta /perf, /seo, /sec, verifica localhost y producción, corrige problemas y despliega
---

# 🚀 OpsFull - Auditoría Completa y Despliegue

Este workflow orquesta los 3 agentes de auditoría, verifica que todo funcione correctamente en localhost y producción, corrige problemas encontrados, y despliega a GitHub o Vercel.

---

## Fase 0: Verificación de Estado Actual

// turbo-all

### 0.1 Verificar auditorías existentes

```bash
# Verificar qué auditorías ya se han realizado
ls -la PERFORMANCE_AUDIT_REPORT.md SEO_AUDIT_REPORT.md SECURITY_AUDIT_REPORT.md .security-audit-state.json 2>/dev/null
```

### 0.2 Determinar auditorías pendientes

Revisar los archivos de estado:

- Si existe `PERFORMANCE_AUDIT_REPORT.md` → `/perf` ya ejecutado
- Si existe `SEO_AUDIT_REPORT.md` → `/seo` ya ejecutado
- Si existe `SECURITY_AUDIT_REPORT.md` → `/sec` ya ejecutado

Solo ejecutar las auditorías que **faltan**.

---

## Fase 1: Ejecutar Auditorías Pendientes

> [!IMPORTANT]
> Solo ejecutar las auditorías que NO se hayan realizado previamente.

### 1.1 Auditoría de Rendimiento (/perf)

Si NO existe `PERFORMANCE_AUDIT_REPORT.md`:

- Ejecutar el workflow completo de `/perf`
- Aplicar optimizaciones automáticas
- Generar reporte

### 1.2 Auditoría SEO (/seo)

Si NO existe `SEO_AUDIT_REPORT.md`:

- Ejecutar el workflow completo de `/seo`
- Aplicar fixes de SEO
- Generar reporte

### 1.3 Auditoría de Seguridad (/sec)

Si NO existe `SECURITY_AUDIT_REPORT.md`:

- Ejecutar el workflow completo de `/sec`
- Documentar vulnerabilidades y fixes aplicados
- Generar reporte

---

## Fase 2: Verificación en Localhost

### 2.1 Verificar instalación de dependencias

```bash
# Verificar e instalar dependencias
npm install 2>/dev/null || yarn install 2>/dev/null || pnpm install 2>/dev/null
```

### 2.2 Ejecutar build de producción

```bash
# Build de producción
npm run build 2>&1 || yarn build 2>&1 || pnpm build 2>&1
```

Si el build falla:

1. Analizar el error
2. Identificar si es problema de /perf, /seo o /sec
3. Aplicar fix y reintentar build

### 2.3 Iniciar servidor de desarrollo

```bash
# Iniciar servidor
npm run dev &
# Esperar a que inicie
sleep 5
```

### 2.4 Verificar que la aplicación responde

```bash
# Verificar respuesta HTTP
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321
```

### 2.5 Verificar funcionalidad básica

Usar el browser_subagent para:

1. Navegar a localhost
2. Verificar que la página carga correctamente
3. Probar navegación principal
4. Verificar que no hay errores en consola
5. Capturar screenshot de verificación

---

## Fase 3: Análisis de Problemas de Producción

### 3.1 Verificar configuración de producción

```bash
# Verificar variables de entorno de producción
cat .env.production .env.local 2>/dev/null | grep -v "^#" | head -20

# Verificar configuración de build
cat vite.config.* next.config.* webpack.config.* 2>/dev/null | head -50
```

### 3.2 Verificar bundle de producción

```bash
# Analizar tamaño del bundle de producción
du -sh dist/ build/ .next/ out/ 2>/dev/null

# Listar archivos críticos
find dist/ build/ .next/static/ out/ -name "*.js" -o -name "*.css" 2>/dev/null | head -20
```

### 3.3 Verificar assets estáticos

```bash
# Verificar que los assets están correctamente referenciados
grep -rn "src=\|href=" dist/ build/ out/ 2>/dev/null | grep -E "\.(js|css|png|jpg|svg)" | head -20
```

---

## Fase 4: Resolución Colaborativa de Problemas

> [!WARNING]
> Si se detectan problemas que bloquean producción, los 3 agentes colaboran para resolverlos.

### 4.1 Clasificar el problema

Determinar si el problema es de:

- **Rendimiento** → Aplicar solución tipo `/perf`
- **SEO** → Aplicar solución tipo `/seo`
- **Seguridad** → Aplicar solución tipo `/sec`
- **Build/Config** → Solución específica de configuración

### 4.2 Aplicar fix

1. Implementar la corrección necesaria
2. Re-ejecutar build de producción
3. Verificar que el problema está resuelto

### 4.3 Documentar la corrección

Agregar al reporte correspondiente:

- Problema encontrado
- Solución aplicada
- Archivos modificados

### 4.4 Re-verificar en localhost

Repetir Fase 2 para confirmar que todo funciona.

---

## Fase 5: Verificación Final Pre-Deploy

### 5.1 Ejecutar tests (si existen)

```bash
npm run test 2>/dev/null || yarn test 2>/dev/null || echo "No tests configurados"
npm run test:e2e 2>/dev/null || echo "No e2e tests configurados"
```

### 5.2 Verificar linting

```bash
npm run lint 2>/dev/null || yarn lint 2>/dev/null || echo "No linting configurado"
```

### 5.3 Verificar build final

```bash
# Build final de producción
npm run build
echo "✅ Build de producción exitoso"
```

### 5.4 Resumen de cambios

```bash
# Listar archivos modificados
git status --short
git diff --stat HEAD~1 2>/dev/null || git diff --stat
```

---

## Fase 6: Consulta de Deploy

> [!IMPORTANT] > **PAUSAR Y PREGUNTAR AL USUARIO:**
> "La auditoría completa ha finalizado y el proyecto está listo para deploy.
>
> ¿Dónde deseas desplegar?
>
> 1. **GitHub** - Push a repositorio remoto
> 2. **Vercel** - Deploy a Vercel
>
> Por favor indica tu preferencia."

**NO PROCEDER SIN RESPUESTA DEL USUARIO.**

---

## Fase 7A: Deploy a GitHub

Si el usuario elige GitHub:

### 7A.1 Verificar estado de git

```bash
git status
git remote -v
```

### 7A.2 Preparar commit

```bash
# Stage todos los cambios
git add -A

# Crear commit con mensaje descriptivo
git commit -m "🚀 Deploy: Auditoría completa (perf + seo + sec)

- Optimizaciones de rendimiento aplicadas
- SEO mejorado
- Vulnerabilidades corregidas
- Build de producción verificado"
```

### 7A.3 Push a GitHub

```bash
# Push a rama principal
git push origin main 2>/dev/null || git push origin master
```

### 7A.4 Verificar deploy

Verificar que el push fue exitoso y si hay CI/CD configurado, esperar a que complete.

---

## Fase 7B: Deploy a Vercel

Si el usuario elige Vercel:

### 7B.1 Verificar CLI de Vercel

```bash
# Verificar si Vercel CLI está instalado
vercel --version 2>/dev/null || npx vercel --version
```

### 7B.2 Ejecutar deploy

```bash
# Deploy a Vercel (producción)
npx vercel --prod
```

### 7B.3 Verificar deploy

Capturar la URL de producción y verificar que la aplicación está online.

---

## Fase 8: Generación de Reporte Final

Crear archivo `DEPLOY_REPORT.md`:

```markdown
# 🚀 Reporte de Deploy

## Fecha

[FECHA_ISO]

## Auditorías Ejecutadas

- [x] /perf - Rendimiento
- [x] /seo - SEO
- [x] /sec - Seguridad

## Verificaciones

- [x] Build de producción exitoso
- [x] Localhost funcionando
- [x] Tests pasando (si aplica)
- [x] Linting limpio (si aplica)

## Problemas Corregidos

[Lista de problemas encontrados y corregidos]

## Deploy

- **Destino**: [GitHub/Vercel]
- **URL**: [URL de producción]
- **Fecha**: [FECHA]

## Archivos Modificados

[Lista de archivos con cambios]

## Próximos Pasos Recomendados

[Recomendaciones de mejora continua]
```

---

## Notas de Uso

- **Incremental**: Solo ejecuta auditorías que no se han realizado
- **Colaborativo**: Los 3 agentes trabajan juntos para resolver problemas
- **Interactivo**: Pregunta antes de deploy
- **Documentado**: Genera reportes de todo el proceso
- **Seguro**: Verifica todo antes de desplegar

---

## Dependencias

Este workflow utiliza:

- `/perf` - Auditoría de rendimiento
- `/seo` - Auditoría SEO
- `/sec` - Auditoría de seguridad

Todos los workflows deben estar instalados en `.agent/workflows/`.
