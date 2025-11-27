import { Injectable } from '@angular/core';
import {
  FormSchema,
  FieldSchema,
  GeneratedCode,
  GenerationOptions,
  FieldType
} from '../models';
import { capitalize, toCamelCase, toPascalCase, indent, sanitizeFieldName } from '../utils/string-utils';

/**
 * Servicio encargado de generar código TypeScript y HTML
 * a partir de un FormSchema validado
 */
@Injectable({
  providedIn: 'root'
})
export class CodeGeneratorService {

  /**
   * Genera el código completo (model, form, template)
   * @param schema - Schema validado del formulario
   * @param options - Opciones de generación (nombres personalizados)
   */
  generate(schema: FormSchema, options: GenerationOptions): GeneratedCode {
    return {
      modelFile: this.generateModel(schema, options.modelName),
      formFile: this.generateFormGroup(schema, options.formName, options.modelName),
      templateFile: this.generateTemplate(schema, options.formName)
    };
  }

  /**
   * Genera el archivo de interface/modelo TypeScript
   */
  generateModel(schema: FormSchema, modelName: string): string {
    const interfaceName = toPascalCase(modelName);
    const fields = schema.fields
      .map(field => this.generateModelField(field))
      .join('\n');

    return `/**
 * Modelo generado automáticamente
 * Interface: ${interfaceName}
 */
export interface ${interfaceName} {
${fields}
}
`;
  }

  /**
   * Genera una línea de campo para la interface
   */
  private generateModelField(field: FieldSchema): string {
    const fieldName = sanitizeFieldName(field.name);
    const optional = field.required ? '' : '?';
    const tsType = this.mapFieldTypeToTS(field.type);
    const comment = field.label ? `  /** ${field.label} */\n` : '';

    return `${comment}${indent()}${fieldName}${optional}: ${tsType};`;
  }

  /**
   * Mapea FieldType a tipo TypeScript
   */
  private mapFieldTypeToTS(type: FieldType): string {
    switch (type) {
      case FieldType.STRING:
        return 'string';
      case FieldType.NUMBER:
        return 'number';
      case FieldType.BOOLEAN:
        return 'boolean';
      default:
        return 'any';
    }
  }

  /**
   * Genera el código del FormGroup con validaciones
   */
  generateFormGroup(schema: FormSchema, formName: string, modelName: string): string {
    const formVarName = toCamelCase(formName);
    const interfaceName = toPascalCase(modelName);
    const controls = schema.fields
      .map(field => this.generateFormControl(field))
      .join(',\n');

    return `import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ${interfaceName} } from './${modelName}.model';

/**
 * FormGroup generado automáticamente
 * Formulario: ${formVarName}
 */
export class ${toPascalCase(formName)} {
  ${formVarName}: FormGroup;

  constructor() {
    this.${formVarName} = new FormGroup({
${controls}
    });
  }

  /**
   * Obtiene el valor tipado del formulario
   */
  get value(): Partial<${interfaceName}> {
    return this.${formVarName}.value;
  }

  /**
   * Verifica si el formulario es válido
   */
  get isValid(): boolean {
    return this.${formVarName}.valid;
  }

  /**
   * Resetea el formulario
   */
  reset(): void {
    this.${formVarName}.reset();
  }
}
`;
  }

  /**
   * Genera un FormControl con validadores
   */
  private generateFormControl(field: FieldSchema): string {
    const fieldName = sanitizeFieldName(field.name);
    const defaultValue = this.getDefaultValue(field.type);
    const validators = field.required ? ', [Validators.required]' : '';

    return `${indent(3)}${fieldName}: new FormControl(${defaultValue}${validators})`;
  }

  /**
   * Obtiene el valor por defecto según el tipo
   */
  private getDefaultValue(type: FieldType): string {
    switch (type) {
      case FieldType.STRING:
        return "''";
      case FieldType.NUMBER:
        return '0';
      case FieldType.BOOLEAN:
        return 'false';
      default:
        return 'null';
    }
  }

  /**
   * Genera el template HTML del formulario
   */
  generateTemplate(schema: FormSchema, formName: string): string {
    const formVarName = toCamelCase(formName);
    const fields = schema.fields
      .map(field => this.generateTemplateField(field, formVarName))
      .join('\n\n');

    return `<!-- Template generado automáticamente -->
<form [formGroup]="${formVarName}">
${fields}

  <div class="form-actions">
    <button type="submit" [disabled]="!${formVarName}.valid">
      Enviar
    </button>
    <button type="button" (click)="reset()">
      Resetear
    </button>
  </div>
</form>

<!-- Valor del formulario (debug) -->
<pre>{{ ${formVarName}.value | json }}</pre>
`;
  }

  /**
   * Genera el HTML de un campo según su tipo
   */
  private generateTemplateField(field: FieldSchema, formName: string): string {
    const fieldName = sanitizeFieldName(field.name);
    const label = field.label || capitalize(field.name);
    const placeholder = field.placeholder || `Ingrese ${label.toLowerCase()}`;
    const required = field.required ? ' *' : '';

    let input = '';

    switch (field.type) {
      case FieldType.STRING:
        input = `${indent(2)}<input
${indent(3)}type="text"
${indent(3)}formControlName="${fieldName}"
${indent(3)}placeholder="${placeholder}"
${indent(2)}/>`;
        break;

      case FieldType.NUMBER:
        input = `${indent(2)}<input
${indent(3)}type="number"
${indent(3)}formControlName="${fieldName}"
${indent(3)}placeholder="${placeholder}"
${indent(2)}/>`;
        break;

      case FieldType.BOOLEAN:
        input = `${indent(2)}<input
${indent(3)}type="checkbox"
${indent(3)}formControlName="${fieldName}"
${indent(2)}/>`;
        break;
    }

    // Mensaje de error si es requerido
    const errorMsg = field.required
      ? `\n${indent(2)}<span class="error" *ngIf="${formName}.get('${fieldName}')?.invalid && ${formName}.get('${fieldName}')?.touched">\n${indent(3)}Este campo es requerido\n${indent(2)}</span>`
      : '';

    return `${indent()}<div class="form-field">
${indent(2)}<label for="${fieldName}">${label}${required}</label>
${input}${errorMsg}
${indent()}</div>`;
  }
}
