# 🔐 Configuración de Supabase

## ✅ Ya Completado

- [x] Proyecto Supabase creado
- [x] Dependencias instaladas (`@supabase/supabase-js`)
- [x] SupabaseService implementado
- [x] Archivos de environment creados

## 📝 Paso Final: Añadir tus Credenciales

### 1. Copia tus credenciales de Supabase

Ve a tu proyecto en Supabase:
- Dashboard > Settings > API
- Copia el **Project URL** y **anon public key**

### 2. Actualiza el archivo de environment

Abre el archivo:
```
src/environments/environment.ts
```

Y reemplaza con tus valores reales:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://xxxxxxxxxxxxx.supabase.co',  // TU URL AQUÍ
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // TU KEY AQUÍ
  }
};
```

### 3. Actualiza también el environment de producción

Abre el archivo:
```
src/environments/environment.prod.ts
```

Y usa los **mismos valores** (por ahora, más adelante podrías usar un proyecto separado para producción):

```typescript
export const environment = {
  production: true,
  supabase: {
    url: 'https://xxxxxxxxxxxxx.supabase.co',  // MISMA URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // MISMA KEY
  }
};
```

### 4. Verifica que funciona

Ejecuta el servidor de desarrollo:
```bash
ng serve
```

Abre la consola del navegador (F12) y verifica que no hay errores de Supabase.

## 🔒 Seguridad

**IMPORTANTE:**
- ✅ Los archivos `environment.ts` y `environment.prod.ts` están en `.gitignore`
- ✅ Tus credenciales NO se subirán a GitHub
- ✅ La `anonKey` es pública (segura de compartir)
- ⚠️ NUNCA compartas la `service_role` key (esa sí es privada)

## 🎯 Próximo Paso

Una vez que añadas las credenciales, puedes:
1. Testear que funciona
2. Pasar al Issue #2: Crear el schema de base de datos
3. Commitear estos cambios

---

**Archivo creado:** 2025-11-27
**Issue relacionado:** #1
