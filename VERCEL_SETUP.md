# Configuración de Variables de Entorno en Vercel

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

## Variables Requeridas

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto `angular-form-builder`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

| Variable Name | Value |
|--------------|-------|
| `SUPABASE_URL` | `https://ngnbbdzlfyrfaursresu.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmJiZHpsZnlyZmF1cnNyZXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODAyMDQsImV4cCI6MjA3OTg1NjIwNH0.P5CuPG4nOXYIQev7YfEvqhwJS_1hZKgQVZ0unp4JGHU` |

## Importante

- Asegúrate de marcar estas variables para todos los entornos: **Production**, **Preview**, y **Development**
- Después de agregar las variables, haz un nuevo deploy o redeploy el proyecto

## Cómo funciona

El script `scripts/generate-env.js` se ejecuta automáticamente antes del build (via `prebuild` en package.json) y genera el archivo `src/environments/environment.ts` usando estas variables de entorno.
