/**
 * Opciones para la generación de código
 */
export interface GenerationOptions {
  /** Nombre del modelo/interface (ej: "User") */
  modelName: string;

  /** Nombre del formulario (ej: "userForm") */
  formName: string;
}

/**
 * Resultado de la generación de código
 * Contiene los 3 archivos generados listos para copiar
 */
export interface GeneratedCode {
  /** Código TypeScript de la interface/modelo */
  modelFile: string;

  /** Código TypeScript del FormGroup con validaciones */
  formFile: string;

  /** Código HTML del template del formulario */
  templateFile: string;
}

/**
 * Tipo para identificar cada tab de código
 */
export type CodeTab = 'model' | 'form' | 'template';

/**
 * Interfaz para representar una tab de código en la UI
 */
export interface CodeTabInfo {
  id: CodeTab;
  label: string;
  fileName: string;
  content: string;
}
