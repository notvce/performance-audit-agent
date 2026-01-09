---
description: Auditoría de seguridad enterprise - Análisis profundo de vulnerabilidades, arquitectura, cumplimiento y reporte profesional
---

# 🔐 Security Audit - Auditoría de Seguridad Enterprise

Este workflow realiza una auditoría integral de seguridad a nivel enterprise, analizando código, arquitectura, infraestructura, cumplimiento y superficie de ataque. Genera un reporte profesional con hallazgos priorizados y recomendaciones accionables.

---

## Fase 0: Verificación de Auditorías Previas

Antes de comenzar, verificar si ya existe una auditoría de seguridad previa:

1. Buscar archivo de reporte de seguridad existente:

   - Buscar archivos como `SECURITY_AUDIT_REPORT.md`, `security-report.md` o similares
   - Verificar si existe un archivo `.security-audit-state.json` con el estado de auditorías completadas

2. **Si existe auditoría previa incompleta**:

   - Leer `.security-audit-state.json` para identificar fases ya completadas
   - Saltar fases ya ejecutadas exitosamente
   - Continuar solo con las fases pendientes

3. **Si NO existe auditoría previa o se solicita auditoría completa**:

   - Ejecutar todas las fases de auditoría
   - Crear archivo de estado para tracking de progreso

4. Crear/actualizar archivo de estado:

   ```json
   {
     "lastAuditDate": "ISO_DATE",
     "completedPhases": [],
     "findings": { "critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0 },
     "version": "1.0"
   }
   ```

---

## Fase 1: Reconocimiento y Descubrimiento

// turbo-all

### 1.1 Detectar tipo de proyecto y stack tecnológico

Analizar la raíz del proyecto para identificar:

- Lenguaje principal (TypeScript, JavaScript, Python, Go, Java, etc.)
- Framework web (React, Next.js, Express, Django, FastAPI, Spring, etc.)
- Configuraciones de base de datos
- Configuraciones de autenticación/autorización
- Archivos de configuración de infraestructura

### 1.2 Mapear estructura de archivos sensibles

```bash
# Archivos de configuración sensibles
find . -type f \( -name "*.env*" -o -name "*config*" -o -name "*secret*" -o -name "*.pem" -o -name "*.key" -o -name "*.crt" -o -name "docker-compose*" -o -name "Dockerfile*" -o -name "*.yml" -o -name "*.yaml" \) 2>/dev/null | grep -v node_modules | head -50
```

### 1.3 Inventario de endpoints y APIs

```bash
# Buscar definiciones de rutas/endpoints
grep -rn "app\.\(get\|post\|put\|delete\|patch\)\|router\.\|@app\.\|@Get\|@Post\|@Put\|@Delete\|@RequestMapping\|@GetMapping\|@PostMapping" . --include="*.ts" --include="*.js" --include="*.py" --include="*.java" --include="*.go" 2>/dev/null | grep -v node_modules | head -100
```

### 1.4 Identificar dependencias y versiones

```bash
# Node.js
cat package.json 2>/dev/null | grep -A 200 '"dependencies"'
cat package-lock.json 2>/dev/null | head -100

# Python
cat requirements.txt 2>/dev/null
cat Pipfile 2>/dev/null
cat pyproject.toml 2>/dev/null

# Go
cat go.mod 2>/dev/null

# Java
cat pom.xml 2>/dev/null | head -100
cat build.gradle 2>/dev/null | head -100
```

Actualizar `.security-audit-state.json` marcando Fase 1 como completada.

---

## Fase 2: Análisis de Código y Vulnerabilidades

> [!IMPORTANT]
> Esta fase identifica vulnerabilidades críticas según OWASP Top 10 y CWE Top 25.

### 2.1 Detección de Secretos Expuestos

```bash
# Buscar patrones de secretos comunes
grep -rniE "(api[_-]?key|apikey|secret[_-]?key|secretkey|password|passwd|pwd|token|bearer|auth[_-]?token|access[_-]?token|private[_-]?key|credentials?)\s*[:=]\s*['\"][^'\"]{8,}['\"]" . --include="*.ts" --include="*.js" --include="*.py" --include="*.java" --include="*.go" --include="*.json" --include="*.yml" --include="*.yaml" --include="*.env*" 2>/dev/null | grep -v node_modules | grep -v ".git" | head -50

# Buscar claves AWS/GCP/Azure
grep -rniE "(AKIA[A-Z0-9]{16}|AIza[0-9A-Za-z\-_]{35}|[0-9a-f]{32}-us[0-9]{1,2}|sk_live_[0-9a-zA-Z]{24})" . 2>/dev/null | grep -v node_modules | grep -v ".git" | head -20

# Buscar archivos .env no ignorados
cat .gitignore 2>/dev/null | grep -E "\.env"
ls -la .env* 2>/dev/null
```

### 2.2 Inyección SQL y NoSQL

```bash
# Patrones de inyección SQL
grep -rniE "(query|execute|raw|exec)\s*\([^)]*(\$|`|\+|%s|{)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.java" --include="*.go" 2>/dev/null | grep -v node_modules | head -30

# Concatenación de strings en queries
grep -rniE "SELECT.*FROM.*WHERE.*\+" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20

# NoSQL injection patterns
grep -rniE "\{\s*\\\$where|\$regex|\$ne|\$gt|\$lt" . --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -20
```

### 2.3 Cross-Site Scripting (XSS)

```bash
# Uso de innerHTML y dangerouslySetInnerHTML sin sanitización
grep -rniE "(innerHTML|dangerouslySetInnerHTML|v-html|document\.write|eval\()" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.vue" 2>/dev/null | grep -v node_modules | head -30

# Renderizado de variables sin escape
grep -rniE "(\{\{|\$\{)[^}]*(user|input|param|query|body|data)" . --include="*.html" --include="*.ejs" --include="*.pug" --include="*.hbs" 2>/dev/null | grep -v node_modules | head -20
```

### 2.4 Ejecución Remota de Código (RCE) y Command Injection

```bash
# Funciones peligrosas de ejecución de comandos
grep -rniE "(exec|spawn|execSync|spawnSync|child_process|os\.system|subprocess|shell_exec|popen|system\()" . --include="*.ts" --include="*.js" --include="*.py" --include="*.php" 2>/dev/null | grep -v node_modules | head -30

# Uso de eval
grep -rniE "eval\s*\(|new Function\s*\(" . --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -20
```

### 2.5 Server-Side Request Forgery (SSRF)

```bash
# Patrones de SSRF
grep -rniE "(fetch|axios|request|http\.get|urllib|requests\.get|http\.request)\s*\([^)]*\$" . --include="*.ts" --include="*.js" --include="*.py" --include="*.go" 2>/dev/null | grep -v node_modules | head -20

# URLs construidas con input de usuario
grep -rniE "(https?://.*\$|url\s*[:=].*req\.|baseURL.*\+)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20
```

### 2.6 Deserialización Insegura

```bash
# Patrones de deserialización peligrosa
grep -rniE "(pickle\.loads|yaml\.load\(|unserialize|JSON\.parse.*user|ObjectInputStream|readObject\(\))" . --include="*.py" --include="*.php" --include="*.js" --include="*.ts" --include="*.java" 2>/dev/null | grep -v node_modules | head -20
```

### 2.7 Path Traversal y File Inclusion

```bash
# Acceso a archivos con input de usuario
grep -rniE "(readFile|readFileSync|open\(|file_get_contents|include|require)\s*\([^)]*(\$|req\.|user|param|query)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.php" 2>/dev/null | grep -v node_modules | head -20

# Patrones de path traversal
grep -rniE "\.\./|\.\.\\\\|%2e%2e" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -10
```

### 2.8 Cross-Site Request Forgery (CSRF)

```bash
# Buscar protección CSRF
grep -rniE "(csrf|xsrf|csrfToken|_token)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.html" --include="*.config*" 2>/dev/null | grep -v node_modules | head -20

# Formularios sin token CSRF
grep -rniE "<form[^>]*method=[\"']post[\"']" . --include="*.html" --include="*.jsx" --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v node_modules | head -20
```

### 2.9 Validación de Entrada Insuficiente

```bash
# Buscar validaciones de input
grep -rniE "(validate|sanitize|escape|zod|yup|joi|express-validator)" . --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -30

# Uso directo de req.body/params sin validación
grep -rniE "req\.(body|params|query)\[?['\"]?\w+['\"]?\]?" . --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -30
```

Actualizar `.security-audit-state.json` marcando Fase 2 como completada.

---

## Fase 3: Análisis de Dependencias y Supply Chain

### 3.1 Auditoría de Dependencias Node.js

```bash
# Auditoría de vulnerabilidades npm
npm audit --json 2>/dev/null || echo "npm audit no disponible"

# Verificar dependencias desactualizadas
npm outdated 2>/dev/null || echo "npm outdated no disponible"
```

### 3.2 Auditoría de Dependencias Python

```bash
# Verificar vulnerabilidades con pip-audit o safety
pip-audit 2>/dev/null || safety check 2>/dev/null || echo "Herramientas de auditoría Python no disponibles"
```

### 3.3 Análisis de Lock Files

```bash
# Verificar integridad de lock files
ls -la package-lock.json yarn.lock pnpm-lock.yaml Pipfile.lock poetry.lock 2>/dev/null

# Buscar versiones fijadas vs ranges
grep -E "\"version\":" package-lock.json 2>/dev/null | head -20
```

### 3.4 Verificar Dependencias de Alto Riesgo

Analizar `package.json` o equivalente para identificar:

- Dependencias abandonadas (sin actualizaciones en >2 años)
- Dependencias con muy pocos mantenedores
- Dependencias con vulnerabilidades conocidas sin parche
- Typosquatting potencial

Actualizar `.security-audit-state.json` marcando Fase 3 como completada.

---

## Fase 4: Arquitectura y Configuración de Seguridad

### 4.1 Autenticación y Autorización

```bash
# Buscar implementaciones de auth
grep -rniE "(jwt|jsonwebtoken|passport|auth0|firebase\.auth|cognito|session|cookie|bcrypt|argon2|pbkdf2)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -40

# Verificar configuración de sesiones
grep -rniE "(session|cookie)\s*[:=]\s*\{" . --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -20

# Buscar hardcoded credentials
grep -rniE "(admin|root|password|secret)\s*[:=]\s*['\"][^'\"]+['\"]" . --include="*.ts" --include="*.js" --include="*.py" --include="*.json" --include="*.yml" 2>/dev/null | grep -v node_modules | grep -v ".git" | head -20
```

### 4.2 Configuración de CORS

```bash
# Buscar configuración de CORS
grep -rniE "(cors|Access-Control-Allow-Origin|credentials:\s*true)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.yml" --include="*.yaml" 2>/dev/null | grep -v node_modules | head -30

# CORS permisivo (origen: *)
grep -rniE "origin:\s*['\"]?\*['\"]?|Access-Control-Allow-Origin:\s*\*" . 2>/dev/null | grep -v node_modules | head -10
```

### 4.3 Cifrado en Tránsito y Reposo

```bash
# Verificar configuración HTTPS/TLS
grep -rniE "(https|ssl|tls|cert|certificate)" . --include="*.ts" --include="*.js" --include="*.yml" --include="*.yaml" --include="*.json" 2>/dev/null | grep -v node_modules | head -30

# Buscar cifrado de datos
grep -rniE "(encrypt|decrypt|crypto|aes|cipher|hash)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -30

# Verificar algoritmos débiles
grep -rniE "(md5|sha1|des|rc4|ecb)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20
```

### 4.4 Configuración de Rate Limiting

```bash
# Buscar rate limiting
grep -rniE "(rate[-_]?limit|throttle|express-rate-limit|slowDown)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20
```

### 4.5 Configuración de Logging y Monitoreo

```bash
# Buscar implementación de logging
grep -rniE "(winston|pino|bunyan|morgan|logging|logger|console\.(log|error|warn))" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -30

# Datos sensibles en logs
grep -rniE "log.*(password|token|secret|key|credential)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20
```

Actualizar `.security-audit-state.json` marcando Fase 4 como completada.

---

## Fase 5: Infraestructura y Configuración de Despliegue

### 5.1 Configuración de Docker

```bash
# Analizar Dockerfile
cat Dockerfile 2>/dev/null || cat */Dockerfile 2>/dev/null

# Verificar imagen base
grep -i "^FROM" Dockerfile */Dockerfile 2>/dev/null

# Buscar secrets en Dockerfile
grep -iE "(ENV|ARG).*(SECRET|PASSWORD|KEY|TOKEN)" Dockerfile */Dockerfile 2>/dev/null

# Usuario no-root
grep -i "USER" Dockerfile */Dockerfile 2>/dev/null
```

### 5.2 Configuración de Docker Compose

```bash
# Analizar docker-compose
cat docker-compose*.yml 2>/dev/null | head -100

# Buscar exposición de puertos
grep -i "ports:" docker-compose*.yml 2>/dev/null -A 5

# Verificar variables de entorno sensibles
grep -iE "environment:" docker-compose*.yml 2>/dev/null -A 20 | head -40
```

### 5.3 Configuración de CI/CD

```bash
# GitHub Actions
cat .github/workflows/*.yml 2>/dev/null | head -100

# GitLab CI
cat .gitlab-ci.yml 2>/dev/null | head -100

# Buscar secretos expuestos en CI/CD
grep -rniE "(secret|password|token|key)" .github/workflows/ .gitlab-ci.yml 2>/dev/null | head -20
```

### 5.4 Configuración de Cloud (AWS/GCP/Azure)

```bash
# Terraform
find . -name "*.tf" -type f 2>/dev/null | head -20
cat *.tf 2>/dev/null | head -100

# CloudFormation
cat *cloudformation*.yml *cloudformation*.json template*.yml 2>/dev/null | head -100

# Kubernetes
cat *k8s*.yml *.deployment.yml *service.yml 2>/dev/null | head -100
kubectl get secrets 2>/dev/null || echo "kubectl no disponible"
```

Actualizar `.security-audit-state.json` marcando Fase 5 como completada.

---

## Fase 6: Seguridad de Aplicación Web

### 6.1 Security Headers

Verificar implementación de headers de seguridad:

```bash
# Buscar configuración de headers
grep -rniE "(helmet|Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|X-XSS-Protection|Referrer-Policy|Permissions-Policy)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.conf" 2>/dev/null | grep -v node_modules | head -40
```

Headers requeridos a verificar:

- `Content-Security-Policy` (CSP)
- `X-Frame-Options` (DENY o SAMEORIGIN)
- `X-Content-Type-Options` (nosniff)
- `Strict-Transport-Security` (HSTS)
- `X-XSS-Protection` (1; mode=block)
- `Referrer-Policy`
- `Permissions-Policy`

### 6.2 Seguridad de Cookies

```bash
# Configuración de cookies
grep -rniE "cookie\s*[:(]|Set-Cookie|httpOnly|secure|sameSite" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -30
```

Verificar atributos de cookies:

- `HttpOnly` - Prevenir acceso desde JavaScript
- `Secure` - Solo HTTPS
- `SameSite` - Protección CSRF
- Tiempo de expiración apropiado

### 6.3 Protección contra Ataques Comunes

```bash
# Protección DoS/DDoS
grep -rniE "(ddos|dos|rate-limit|throttle|captcha|recaptcha)" . --include="*.ts" --include="*.js" --include="*.py" --include="*.yml" 2>/dev/null | grep -v node_modules | head -20

# Protección fuerza bruta
grep -rniE "(brute|attempts|lockout|failed.login|max.attempts)" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | grep -v node_modules | head -20
```

### 6.4 Exposure de Información Sensible

```bash
# Stack traces en producción
grep -rniE "(stack|stackTrace|debug:\s*true|NODE_ENV.*development)" . --include="*.ts" --include="*.js" --include="*.json" 2>/dev/null | grep -v node_modules | head -20

# Archivos sensibles expuestos
ls -la .env* .git/ .gitignore .dockerignore *.log *.sql backup/ 2>/dev/null

# Metadatos en imágenes
ls -la public/*.jpg public/*.png public/*.jpeg 2>/dev/null | head -10
```

Actualizar `.security-audit-state.json` marcando Fase 6 como completada.

---

## Fase 7: Evaluación de Cumplimiento

### 7.1 OWASP Top 10 Checklist

Verificar protección contra:

1. **A01:2021 - Broken Access Control**
2. **A02:2021 - Cryptographic Failures**
3. **A03:2021 - Injection**
4. **A04:2021 - Insecure Design**
5. **A05:2021 - Security Misconfiguration**
6. **A06:2021 - Vulnerable and Outdated Components**
7. **A07:2021 - Identification and Authentication Failures**
8. **A08:2021 - Software and Data Integrity Failures**
9. **A09:2021 - Security Logging and Monitoring Failures**
10. **A10:2021 - Server-Side Request Forgery (SSRF)**

### 7.2 SDLC Security Practices

Verificar:

```bash
# Pre-commit hooks de seguridad
cat .pre-commit-config.yaml 2>/dev/null
cat .husky/pre-commit 2>/dev/null

# GitHub security features
cat .github/dependabot.yml 2>/dev/null
cat .github/SECURITY.md 2>/dev/null
cat SECURITY.md 2>/dev/null

# Code scanning
cat .github/workflows/*codeql*.yml .github/workflows/*security*.yml 2>/dev/null
```

### 7.3 Documentación de Seguridad

Verificar existencia de:

- `SECURITY.md` - Política de reporte de vulnerabilidades
- Documentación de prácticas de seguridad
- Guías de hardening
- Runbooks de respuesta a incidentes

Actualizar `.security-audit-state.json` marcando Fase 7 como completada.

---

## Fase 8: Generación del Reporte de Seguridad

Crear archivo `SECURITY_AUDIT_REPORT.md` en la raíz del proyecto:

### Estructura del Reporte

```markdown
# 🔐 Reporte de Auditoría de Seguridad Enterprise

## 📋 Resumen Ejecutivo

| Métrica                      | Valor     |
| ---------------------------- | --------- |
| Fecha de Auditoría           | [FECHA]   |
| Versión del Proyecto         | [VERSION] |
| Score de Seguridad           | X/100     |
| Hallazgos Críticos           | X         |
| Hallazgos de Alta Prioridad  | X         |
| Hallazgos de Media Prioridad | X         |
| Hallazgos de Baja Prioridad  | X         |
| Hallazgos Informativos       | X         |

---

## 🔴 Hallazgos Críticos (CVSS 9.0-10.0)

> [!CAUTION]
> Estos hallazgos requieren atención inmediata. Representan riesgos de explotación activa.

### [SEC-001] [Título del Hallazgo]

- **Severidad**: 🔴 CRÍTICA
- **CVSS Score**: X.X
- **CWE**: CWE-XXX
- **Ubicación**: `path/to/file.ts:123`
- **Descripción**: [Descripción detallada]
- **Impacto Potencial**: [Descripción del impacto]
- **Prueba de Concepto**: [Evidencia/código]
- **Recomendación**: [Pasos de remediación]

---

## 🟠 Hallazgos de Alta Prioridad (CVSS 7.0-8.9)

> [!WARNING]
> Estos hallazgos deben remediarse en el próximo sprint.

### [SEC-XXX] [Título del Hallazgo]

[Mismo formato que críticos]

---

## 🟡 Hallazgos de Media Prioridad (CVSS 4.0-6.9)

> [!IMPORTANT]
> Planificar remediación en los próximos 30 días.

[Hallazgos]

---

## 🔵 Hallazgos de Baja Prioridad (CVSS 0.1-3.9)

> [!NOTE]
> Mejoras recomendadas para fortalecer la postura de seguridad.

[Hallazgos]

---

## ⚪ Hallazgos Informativos

[Observaciones y recomendaciones de mejora]

---

## ✅ Controles de Seguridad Verificados

Lista de controles que se validaron correctamente:

- [x] [Control verificado]
- [ ] [Control ausente o incompleto]

---

## 📊 Métricas de Seguridad

### Cobertura por Categoría OWASP

| Categoría OWASP                 | Estado   | Riesgo |
| ------------------------------- | -------- | ------ |
| A01 - Broken Access Control     | ✅/⚠️/❌ | X      |
| A02 - Cryptographic Failures    | ✅/⚠️/❌ | X      |
| A03 - Injection                 | ✅/⚠️/❌ | X      |
| A04 - Insecure Design           | ✅/⚠️/❌ | X      |
| A05 - Security Misconfiguration | ✅/⚠️/❌ | X      |
| A06 - Vulnerable Components     | ✅/⚠️/❌ | X      |
| A07 - Auth Failures             | ✅/⚠️/❌ | X      |
| A08 - Integrity Failures        | ✅/⚠️/❌ | X      |
| A09 - Logging Failures          | ✅/⚠️/❌ | X      |
| A10 - SSRF                      | ✅/⚠️/❌ | X      |

### Resumen de Dependencias

- Total de dependencias: X
- Vulnerabilidades conocidas: X
- Dependencias desactualizadas: X

---

## 🛠️ Plan de Remediación Priorizado

### Inmediato (0-7 días)

1. [Acción 1]
2. [Acción 2]

### Corto Plazo (7-30 días)

1. [Acción 1]
2. [Acción 2]

### Mediano Plazo (30-90 días)

1. [Acción 1]
2. [Acción 2]

---

## 📚 Referencias

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## 📝 Metodología

Esta auditoría fue realizada utilizando:

- Análisis estático de código (SAST)
- Revisión de configuraciones
- Análisis de dependencias (SCA)
- Verificación manual de controles
- Frameworks: OWASP ASVS, NIST CSF, CIS Controls

---

_Generado por Security Audit Agent v1.0_
_Fecha: [FECHA]_
```

---

## Fase 9: Actualización de Estado Final

Actualizar `.security-audit-state.json`:

```json
{
  "lastAuditDate": "FECHA_ISO",
  "completedPhases": [1, 2, 3, 4, 5, 6, 7, 8],
  "findings": {
    "critical": X,
    "high": X,
    "medium": X,
    "low": X,
    "info": X
  },
  "securityScore": X,
  "nextAuditRecommended": "FECHA_ISO_30_DIAS",
  "version": "1.0"
}
```

---

## Notas de Uso

- **Idioma**: Todos los reportes se generan en **español**
- **Auditoría Incremental**: Si existe `.security-audit-state.json`, solo se ejecutan las fases pendientes
- **Forzar Auditoría Completa**: Eliminar `.security-audit-state.json` o ejecutar con flag `--full`
- **Compatibilidad**: Node.js, Python, Go, Java, y proyectos web modernos
- **Frameworks**: React, Next.js, Express, Django, FastAPI, Spring Boot, etc.
- **Integración**: Compatible con `/perf` y `/seo` - referencia reportes existentes

---

## Dependencias con Otros Workflows

- Si existe reporte de `/perf`, referenciar hallazgos de seguridad relacionados
- Si existe reporte de `/seo`, verificar que las optimizaciones no introduzcan riesgos
- Recomendar ejecución de `/security-audit` después de cambios significativos
