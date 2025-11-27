# 🗺️ Backend Roadmap

## 📊 Estado del Proyecto

- **Fase Actual:** MVP 1.0 Frontend ✅
- **Próxima Fase:** Backend + Auth + Persistencia
- **Timeline Estimado:** 7-10 días

---

## 🏗️ Arquitectura Backend

### Stack Tecnológico

| Componente | Tecnología | Razón |
|------------|------------|-------|
| **Backend Platform** | Supabase | Auth + DB + API en uno, setup rápido |
| **Base de Datos** | PostgreSQL | Incluido con Supabase |
| **API** | PostgREST | Auto-generado por Supabase |
| **Auth** | Supabase Auth | JWT, OAuth, Magic Links |
| **Storage** | Supabase Storage | Para thumbnails de templates |
| **Hosting Backend** | Supabase Cloud | Incluido, no deploy adicional |

### Frontend Updates

| Librería | Versión | Uso |
|----------|---------|-----|
| `@supabase/supabase-js` | ^2.x | Cliente Supabase |
| `@angular/router` | Existente | Guards para auth |

---

## 🗄️ Esquema de Base de Datos

### Tabla: `schemas`

```sql
CREATE TABLE schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_schemas_user_id ON schemas(user_id);
CREATE INDEX idx_schemas_public ON schemas(is_public) WHERE is_public = true;
CREATE INDEX idx_schemas_created ON schemas(created_at DESC);

-- RLS Policies
ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own schemas
CREATE POLICY "Users can read own schemas"
  ON schemas FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can read public schemas
CREATE POLICY "Anyone can read public schemas"
  ON schemas FOR SELECT
  USING (is_public = true);

-- Policy: Users can insert their own schemas
CREATE POLICY "Users can insert own schemas"
  ON schemas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own schemas
CREATE POLICY "Users can update own schemas"
  ON schemas FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own schemas
CREATE POLICY "Users can delete own schemas"
  ON schemas FOR DELETE
  USING (auth.uid() = user_id);
```

### Tabla: `templates`

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('contact', 'registration', 'payment', 'business', 'survey', 'other')),
  schema_json JSONB NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_featured ON templates(is_featured) WHERE is_featured = true;

-- RLS: Templates son públicos (read-only para usuarios)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are public"
  ON templates FOR SELECT
  TO authenticated, anon
  USING (true);
```

### Tabla: `forks`

```sql
CREATE TABLE forks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_schema_id UUID REFERENCES schemas(id) ON DELETE CASCADE,
  forked_schema_id UUID REFERENCES schemas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_forks_original ON forks(original_schema_id);
CREATE INDEX idx_forks_user ON forks(user_id);

-- RLS
ALTER TABLE forks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own forks"
  ON forks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create forks"
  ON forks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔐 Autenticación

### Flujo de Auth

```
1. Usuario visita app
2. Click "Login" → Redirect a /login
3. Usuario ingresa email/password
4. Supabase Auth valida credenciales
5. Retorna JWT token
6. Frontend guarda token en localStorage
7. Todas las requests incluyen token en headers
8. Backend valida token con RLS policies
```

### Endpoints de Auth (Supabase built-in)

```typescript
// Signup
POST https://{project}.supabase.co/auth/v1/signup
{
  email: "user@example.com",
  password: "secure-password"
}

// Login
POST https://{project}.supabase.co/auth/v1/token?grant_type=password
{
  email: "user@example.com",
  password: "secure-password"
}

// Logout
POST https://{project}.supabase.co/auth/v1/logout

// Get Session
GET https://{project}.supabase.co/auth/v1/user
```

---

## 📡 API Endpoints

### Schemas

```http
# Crear schema
POST /rest/v1/schemas
Authorization: Bearer {jwt}
Content-Type: application/json
{
  "name": "My Form",
  "description": "Contact form",
  "schema_json": {...},
  "is_public": false
}

# Listar mis schemas
GET /rest/v1/schemas?user_id=eq.{user_id}
Authorization: Bearer {jwt}

# Listar schemas públicos
GET /rest/v1/schemas?is_public=eq.true&order=created_at.desc&limit=20

# Obtener schema por ID
GET /rest/v1/schemas?id=eq.{schema_id}&limit=1
Authorization: Bearer {jwt} (solo si es privado)

# Actualizar schema
PATCH /rest/v1/schemas?id=eq.{schema_id}
Authorization: Bearer {jwt}
{
  "name": "Updated name",
  "is_public": true
}

# Eliminar schema
DELETE /rest/v1/schemas?id=eq.{schema_id}
Authorization: Bearer {jwt}

# Incrementar view count
POST /rest/v1/rpc/increment_view_count
{
  "schema_id": "{uuid}"
}
```

### Templates

```http
# Listar todos los templates
GET /rest/v1/templates?order=is_featured.desc,created_at.desc

# Templates por categoría
GET /rest/v1/templates?category=eq.contact

# Templates destacados
GET /rest/v1/templates?is_featured=eq.true
```

### Forks

```http
# Crear fork
POST /rest/v1/forks
Authorization: Bearer {jwt}
{
  "original_schema_id": "{uuid}",
  "forked_schema_id": "{uuid}",
  "user_id": "{user_uuid}"
}

# Contar forks de un schema
GET /rest/v1/forks?original_schema_id=eq.{uuid}&select=count
```

---

## 🎯 Plan de Implementación

### Sprint 1: Setup + Auth (3 días)

**Día 1: Setup**
- [ ] Issue #1: Crear proyecto Supabase
- [ ] Configurar API keys
- [ ] Instalar `@supabase/supabase-js`
- [ ] Crear `SupabaseService`

**Día 2: Database**
- [ ] Issue #2: Crear tablas SQL
- [ ] Configurar RLS policies
- [ ] Seed de templates iniciales

**Día 3: Auth UI**
- [ ] Issue #3: Crear LoginComponent
- [ ] Crear RegisterComponent
- [ ] AuthGuard para rutas protegidas
- [ ] Navbar con usuario logueado

### Sprint 2: CRUD Schemas (3 días)

**Día 4: Guardar**
- [ ] Issue #4: Botón "Guardar Schema"
- [ ] Modal de guardar
- [ ] Integración con Supabase

**Día 5: Listar**
- [ ] Issue #5: Página "Mis Schemas"
- [ ] Cards con schemas guardados
- [ ] Editar/Eliminar schemas

**Día 6: Compartir**
- [ ] Issue #6: Ruta `/schema/:id`
- [ ] Botón "Share" con URL
- [ ] Botón "Fork"
- [ ] View counter

### Sprint 3: Templates + Polish (2 días)

**Día 7: Templates**
- [ ] Issue #7: Galería de templates
- [ ] Seed 5 templates predefinidos
- [ ] Categorías y búsqueda

**Día 8: UI/UX**
- [ ] Issue #8: Mejorar navbar
- [ ] Loading states
- [ ] Toast notifications
- [ ] Responsive fixes

---

## 💰 Costos

### Desarrollo (0€)
- Supabase Free Tier
- Vercel Hobby Plan
- GitHub Free

### Producción (~45€/mes cuando escales)
- Supabase Pro: 25€/mes
- Vercel Pro: 20€/mes
- Domain: ~10€/año

---

## 🔗 Referencias

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Angular Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/angular)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgREST API](https://postgrest.org/en/stable/)

---

## 📝 Notas

- **RLS es crítico**: Sin RLS, cualquiera puede leer/escribir toda la DB
- **JWT en headers**: Supabase client los añade automáticamente
- **Migraciones**: Guardar SQL scripts para reproducir DB
- **Backups**: Supabase hace backups automáticos (plan Pro)

---

Última actualización: 2025-11-27
