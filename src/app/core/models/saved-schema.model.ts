import { FormSchema } from './form-schema.model';

/**
 * Representa un schema guardado en la base de datos
 */
export interface SavedSchema {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  schema_json: FormSchema;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  view_count: number;
  fork_count: number;
}

/**
 * DTO para crear un nuevo schema
 */
export interface CreateSchemaDto {
  name: string;
  description?: string;
  schema_json: FormSchema;
  is_public: boolean;
}

/**
 * DTO para actualizar un schema existente
 */
export interface UpdateSchemaDto {
  name?: string;
  description?: string;
  schema_json?: FormSchema;
  is_public?: boolean;
}

/**
 * Representa un template predefinido
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: 'contact' | 'registration' | 'payment' | 'business' | 'survey' | 'other';
  schema_json: FormSchema;
  thumbnail_url?: string;
  is_featured: boolean;
  created_at: string;
}

/**
 * Representa un fork (copia) de un schema
 */
export interface Fork {
  id: string;
  original_schema_id: string;
  forked_schema_id: string;
  user_id: string;
  created_at: string;
}
