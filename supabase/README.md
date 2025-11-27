# 🗄️ Supabase Database Setup

## 📋 Archivos SQL

| Orden | Archivo | Descripción |
|-------|---------|-------------|
| 1️⃣ | `01-create-tables.sql` | Crea las tablas: schemas, templates, forks |
| 2️⃣ | `02-rls-policies.sql` | Configura Row Level Security (permisos) |
| 3️⃣ | `03-seed-templates.sql` | Inserta 5 templates predefinidos |

## 🚀 Cómo Ejecutar

### Paso 1: Ir a Supabase SQL Editor

1. Abre tu proyecto en Supabase: https://supabase.com/dashboard
2. En el menú lateral, click en **"SQL Editor"**
3. Click en **"+ New query"**

### Paso 2: Ejecutar Scripts en Orden

**Ejecuta cada script UNO POR UNO en este orden:**

#### 1️⃣ Crear Tablas

```sql
-- Copia TODO el contenido de 01-create-tables.sql
-- Pégalo en el SQL Editor
-- Click en "Run" o presiona Cmd+Enter (Mac) / Ctrl+Enter (Windows)
```

Deberías ver: **"Success. No rows returned"**

#### 2️⃣ Configurar RLS

```sql
-- Copia TODO el contenido de 02-rls-policies.sql
-- Pégalo en el SQL Editor
-- Click en "Run"
```

Deberías ver: **"Success. No rows returned"**

#### 3️⃣ Seed de Templates

```sql
-- Copia TODO el contenido de 03-seed-templates.sql
-- Pégalo en el SQL Editor
-- Click en "Run"
```

Deberías ver: **"Success. 5 rows affected"**

### Paso 3: Verificar

Ve a **"Table Editor"** en Supabase y verifica:

- ✅ Tabla `schemas` existe (vacía)
- ✅ Tabla `templates` existe (5 filas)
- ✅ Tabla `forks` existe (vacía)

---

## 🔐 Políticas de Seguridad (RLS)

### Tabla: schemas

| Acción | Quién | Condición |
|--------|-------|-----------|
| **SELECT** | Authenticated | Solo sus propios schemas |
| **SELECT** | Anyone | Solo schemas públicos (is_public=true) |
| **INSERT** | Authenticated | Solo puede crear con su user_id |
| **UPDATE** | Authenticated | Solo sus propios schemas |
| **DELETE** | Authenticated | Solo sus propios schemas |

### Tabla: templates

| Acción | Quién | Condición |
|--------|-------|-----------|
| **SELECT** | Anyone | Todos pueden leer |
| **INSERT/UPDATE/DELETE** | Admin only | Requiere service_role key |

### Tabla: forks

| Acción | Quién | Condición |
|--------|-------|-----------|
| **SELECT** | Authenticated | Sus propios forks + forks de schemas públicos |
| **INSERT** | Authenticated | Puede crear forks |
| **DELETE** | Authenticated | Solo sus propios forks |

---

## 🔍 Queries Útiles para Testing

### Ver todos los templates
```sql
SELECT * FROM templates ORDER BY is_featured DESC, name;
```

### Ver schemas públicos
```sql
SELECT * FROM schemas WHERE is_public = true;
```

### Contar schemas por usuario
```sql
SELECT user_id, COUNT(*) as total
FROM schemas
GROUP BY user_id;
```

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Asegúrate de ejecutar `01-create-tables.sql` primero

### Error: "permission denied"
- Verifica que ejecutaste `02-rls-policies.sql`
- Asegúrate de estar logueado en la app

### Tablas no aparecen en Table Editor
- Refresca la página de Supabase
- Verifica que no hubo errores al ejecutar los scripts

---

## 📝 Notas

- Los scripts son **idempotentes**: puedes ejecutarlos múltiples veces sin problemas
- Usan `IF NOT EXISTS` y `DROP POLICY IF EXISTS`
- Si necesitas resetear todo: ve a Table Editor y elimina las tablas manualmente

---

**Creado:** 2025-11-27
**Issue:** #2
