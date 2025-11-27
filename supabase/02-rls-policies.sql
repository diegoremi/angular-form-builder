-- =====================================================
-- Angular Form Builder - Row Level Security Policies
-- File: 02-rls-policies.sql
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SCHEMAS TABLE POLICIES
-- =====================================================

-- Policy: Users can read their own schemas
DROP POLICY IF EXISTS "Users can read own schemas" ON public.schemas;
CREATE POLICY "Users can read own schemas"
  ON public.schemas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Anyone can read public schemas
DROP POLICY IF EXISTS "Anyone can read public schemas" ON public.schemas;
CREATE POLICY "Anyone can read public schemas"
  ON public.schemas
  FOR SELECT
  TO authenticated, anon
  USING (is_public = true);

-- Policy: Users can insert their own schemas
DROP POLICY IF EXISTS "Users can insert own schemas" ON public.schemas;
CREATE POLICY "Users can insert own schemas"
  ON public.schemas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own schemas
DROP POLICY IF EXISTS "Users can update own schemas" ON public.schemas;
CREATE POLICY "Users can update own schemas"
  ON public.schemas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own schemas
DROP POLICY IF EXISTS "Users can delete own schemas" ON public.schemas;
CREATE POLICY "Users can delete own schemas"
  ON public.schemas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- TEMPLATES TABLE POLICIES
-- =====================================================

-- Policy: Templates are publicly readable
DROP POLICY IF EXISTS "Templates are publicly readable" ON public.templates;
CREATE POLICY "Templates are publicly readable"
  ON public.templates
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Note: Only admins can insert/update/delete templates
-- This is handled by not creating INSERT/UPDATE/DELETE policies
-- You would need to use service_role key for template management

-- =====================================================
-- FORKS TABLE POLICIES
-- =====================================================

-- Policy: Users can read their own forks
DROP POLICY IF EXISTS "Users can read own forks" ON public.forks;
CREATE POLICY "Users can read own forks"
  ON public.forks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can read forks of their public schemas
DROP POLICY IF EXISTS "Users can read forks of public schemas" ON public.forks;
CREATE POLICY "Users can read forks of public schemas"
  ON public.forks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.schemas
      WHERE schemas.id = forks.original_schema_id
      AND schemas.is_public = true
    )
  );

-- Policy: Users can create forks
DROP POLICY IF EXISTS "Users can create forks" ON public.forks;
CREATE POLICY "Users can create forks"
  ON public.forks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own forks
DROP POLICY IF EXISTS "Users can delete own forks" ON public.forks;
CREATE POLICY "Users can delete own forks"
  ON public.forks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
