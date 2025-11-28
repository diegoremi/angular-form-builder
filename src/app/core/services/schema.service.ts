import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  SavedSchema,
  CreateSchemaDto,
  UpdateSchemaDto,
  Template
} from '../models/saved-schema.model';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Guarda un nuevo schema
   */
  async createSchema(dto: CreateSchemaDto): Promise<{ data: SavedSchema | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error } = await supabaseClient
      .from('schemas')
      .insert([dto])
      .select()
      .single();

    return { data, error };
  }

  /**
   * Obtiene todos los schemas del usuario actual
   */
  async getUserSchemas(): Promise<{ data: SavedSchema[] | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error} = await supabaseClient
      .from('schemas')
      .select('*')
      .order('updated_at', { ascending: false });

    return { data, error };
  }

  /**
   * Obtiene un schema por ID
   */
  async getSchemaById(id: string): Promise<{ data: SavedSchema | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error } = await supabaseClient
      .from('schemas')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  /**
   * Actualiza un schema existente
   */
  async updateSchema(
    id: string,
    dto: UpdateSchemaDto
  ): Promise<{ data: SavedSchema | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error } = await supabaseClient
      .from('schemas')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  /**
   * Elimina un schema
   */
  async deleteSchema(id: string): Promise<{ error: any }> {
    const supabaseClient = this.supabase.client;
    const { error } = await supabaseClient.from('schemas').delete().eq('id', id);

    return { error };
  }

  /**
   * Obtiene schemas públicos (templates de la comunidad)
   */
  async getPublicSchemas(): Promise<{ data: SavedSchema[] | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error } = await supabaseClient
      .from('schemas')
      .select('*')
      .eq('is_public', true)
      .order('view_count', { ascending: false });

    return { data, error };
  }

  /**
   * Obtiene templates predefinidos
   */
  async getTemplates(): Promise<{ data: Template[] | null; error: any }> {
    const supabaseClient = this.supabase.client;
    const { data, error } = await supabaseClient
      .from('templates')
      .select('*')
      .order('is_featured', { ascending: false });

    return { data, error };
  }

  /**
   * Incrementa el contador de vistas de un schema
   */
  async incrementViewCount(schemaId: string): Promise<{ error: any }> {
    const supabaseClient = this.supabase.client;
    const { error } = await supabaseClient.rpc('increment_view_count', {
      schema_id: schemaId
    });

    return { error };
  }

  /**
   * Incrementa el contador de forks de un schema
   */
  async incrementForkCount(schemaId: string): Promise<{ error: any }> {
    const supabaseClient = this.supabase.client;
    const { error } = await supabaseClient.rpc('increment_fork_count', {
      schema_id: schemaId
    });

    return { error };
  }
}
