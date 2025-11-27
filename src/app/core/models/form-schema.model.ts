import { FieldType } from './field-type.enum';

/**
 * Representa un campo individual en el formulario
 */
export interface FieldSchema {
  /** Nombre del campo (usado como key en el FormGroup) */
  name: string;

  /** Tipo de dato del campo */
  type: FieldType;

  /** Si el campo es obligatorio (se traduce a Validators.required) */
  required: boolean;

  /** Label opcional para mostrar en el template (si no se provee, usa name) */
  label?: string;

  /** Placeholder opcional para el input */
  placeholder?: string;
}

/**
 * Representa el esquema completo del formulario a generar
 */
export interface FormSchema {
  /** Lista de campos del formulario */
  fields: FieldSchema[];

  /** Nombre del formulario/componente (ej: "UserForm") */
  formName?: string;

  /** Nombre del modelo/interface (ej: "User") */
  modelName?: string;
}

/**
 * Interfaz para el JSON Schema de entrada del usuario
 * Puede ser más flexible que FormSchema (antes de validación)
 */
export interface InputJsonSchema {
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    label?: string;
    placeholder?: string;
  }>;
  formName?: string;
  modelName?: string;
}
