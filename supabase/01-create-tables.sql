-- =====================================================
-- Angular Form Builder - Database Schema
-- File: 01-create-tables.sql
-- =====================================================

-- Table: schemas
-- Stores user-generated form schemas
CREATE TABLE IF NOT EXISTS public.schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  view_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,

  -- Constraints
  CONSTRAINT name_not_empty CHECK (char_length(name) > 0),
  CONSTRAINT valid_json CHECK (jsonb_typeof(schema_json) = 'object')
);

-- Indexes for schemas table
CREATE INDEX IF NOT EXISTS idx_schemas_user_id ON public.schemas(user_id);
CREATE INDEX IF NOT EXISTS idx_schemas_public ON public.schemas(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_schemas_created ON public.schemas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_schemas_updated ON public.schemas(updated_at DESC);

-- Table: templates
-- Predefined form templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('contact', 'registration', 'payment', 'business', 'survey', 'other')),
  schema_json JSONB NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT template_name_not_empty CHECK (char_length(name) > 0),
  CONSTRAINT valid_template_json CHECK (jsonb_typeof(schema_json) = 'object')
);

-- Indexes for templates table
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON public.templates(is_featured) WHERE is_featured = true;

-- Table: forks
-- Tracks when users fork/copy schemas from others
CREATE TABLE IF NOT EXISTS public.forks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_schema_id UUID REFERENCES public.schemas(id) ON DELETE CASCADE NOT NULL,
  forked_schema_id UUID REFERENCES public.schemas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT different_schemas CHECK (original_schema_id != forked_schema_id)
);

-- Indexes for forks table
CREATE INDEX IF NOT EXISTS idx_forks_original ON public.forks(original_schema_id);
CREATE INDEX IF NOT EXISTS idx_forks_user ON public.forks(user_id);
CREATE INDEX IF NOT EXISTS idx_forks_created ON public.forks(created_at DESC);

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on schemas
DROP TRIGGER IF EXISTS update_schemas_updated_at ON public.schemas;
CREATE TRIGGER update_schemas_updated_at
  BEFORE UPDATE ON public.schemas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Increment view count
CREATE OR REPLACE FUNCTION increment_view_count(schema_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.schemas
  SET view_count = view_count + 1
  WHERE id = schema_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment fork count
CREATE OR REPLACE FUNCTION increment_fork_count(schema_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.schemas
  SET fork_count = fork_count + 1
  WHERE id = schema_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (public schemas are readable by anon users)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.templates TO anon, authenticated;
GRANT ALL ON public.schemas TO authenticated;
GRANT ALL ON public.forks TO authenticated;
