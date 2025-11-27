/**
 * Tipos de campos soportados en el formulario generado
 * En el MVP solo soportamos tipos primitivos básicos
 */
export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

/**
 * Type guard para validar si un string es un FieldType válido
 */
export function isValidFieldType(type: string): type is FieldType {
  return Object.values(FieldType).includes(type as FieldType);
}
