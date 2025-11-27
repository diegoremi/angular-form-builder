import { Injectable } from '@angular/core';
import {
  FormSchema,
  FieldSchema,
  InputJsonSchema,
  FieldType,
  isValidFieldType
} from '../models';

/**
 * Errores personalizados para el parsing
 */
export class ParseError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

/**
 * Resultado del parsing (success o error)
 */
export interface ParseResult {
  success: boolean;
  data?: FormSchema;
  error?: ParseError;
}

/**
 * Servicio encargado de parsear y validar JSON Schemas de entrada
 */
@Injectable({
  providedIn: 'root'
})
export class SchemaParserService {

  /**
   * Parsea un JSON string a FormSchema validado
   * @param jsonString - JSON pegado por el usuario
   * @returns ParseResult con el schema o error
   */
  parse(jsonString: string): ParseResult {
    try {
      // 1. Validar que no esté vacío
      if (!jsonString || jsonString.trim() === '') {
        return this.errorResult('EMPTY_INPUT', 'El JSON no puede estar vacío');
      }

      // 2. Parsear JSON
      let rawJson: unknown;
      try {
        rawJson = JSON.parse(jsonString);
      } catch (e) {
        return this.errorResult(
          'INVALID_JSON',
          `JSON inválido: ${e instanceof Error ? e.message : 'Error desconocido'}`
        );
      }

      // 3. Validar estructura básica
      if (!this.isInputJsonSchema(rawJson)) {
        return this.errorResult(
          'INVALID_STRUCTURE',
          'El JSON debe tener un array "fields" con al menos un campo'
        );
      }

      // 4. Validar y convertir a FormSchema
      const schema = this.validateAndConvert(rawJson);

      return {
        success: true,
        data: schema
      };

    } catch (error) {
      if (error instanceof ParseError) {
        return this.errorResult(error.code, error.message);
      }
      return this.errorResult(
        'UNKNOWN_ERROR',
        `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Type guard para validar estructura mínima del JSON
   */
  private isInputJsonSchema(obj: unknown): obj is InputJsonSchema {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'fields' in obj &&
      Array.isArray(obj.fields) &&
      obj.fields.length > 0
    );
  }

  /**
   * Valida y convierte InputJsonSchema a FormSchema tipado
   */
  private validateAndConvert(input: InputJsonSchema): FormSchema {
    const fields: FieldSchema[] = [];

    // Validar cada campo
    for (let i = 0; i < input.fields.length; i++) {
      const rawField = input.fields[i];

      // Validar que tenga nombre
      if (!rawField.name || typeof rawField.name !== 'string' || rawField.name.trim() === '') {
        throw new ParseError(
          `Campo en posición ${i} no tiene un nombre válido`,
          'INVALID_FIELD_NAME'
        );
      }

      // Validar que tenga tipo válido
      if (!rawField.type || !isValidFieldType(rawField.type)) {
        throw new ParseError(
          `Campo "${rawField.name}" tiene un tipo inválido. Tipos soportados: string, number, boolean`,
          'INVALID_FIELD_TYPE'
        );
      }

      // Crear FieldSchema validado
      const field: FieldSchema = {
        name: rawField.name.trim(),
        type: rawField.type as FieldType,
        required: rawField.required ?? false,
        label: rawField.label?.trim(),
        placeholder: rawField.placeholder?.trim()
      };

      fields.push(field);
    }

    // Validar nombres duplicados
    const names = fields.map(f => f.name.toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      throw new ParseError(
        `Nombres de campos duplicados: ${duplicates.join(', ')}`,
        'DUPLICATE_FIELD_NAMES'
      );
    }

    return {
      fields,
      formName: input.formName?.trim(),
      modelName: input.modelName?.trim()
    };
  }

  /**
   * Helper para crear resultados de error
   */
  private errorResult(code: string, message: string): ParseResult {
    return {
      success: false,
      error: new ParseError(message, code)
    };
  }
}
