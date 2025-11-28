import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SchemaParserService } from '../../core/services/schema-parser.service';
import { CodeGeneratorService } from '../../core/services/code-generator.service';
import { FormSchema, GeneratedCode, CodeTabInfo } from '../../core/models';

import { JsonEditorComponent } from '../../shared/components/json-editor/json-editor.component';
import { CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { SaveSchemaModalComponent } from '../../shared/save-schema-modal/save-schema-modal.component';
import { SupabaseService } from '../../core/services/supabase.service';

/**
 * Página principal del Form Builder
 * Componente "smart" que orquesta toda la aplicación
 */
@Component({
  selector: 'app-builder',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JsonEditorComponent,
    CodeViewerComponent,
    TabsComponent,
    SaveSchemaModalComponent
  ],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss'
})
export class BuilderComponent implements OnInit {
  /** Formulario de opciones */
  optionsForm: FormGroup;

  /** JSON del usuario */
  jsonInput: string = '';

  /** Schema parseado */
  parsedSchema: FormSchema | null = null;

  /** Código generado */
  generatedCode: GeneratedCode | null = null;

  /** Mensaje de error */
  errorMessage: string = '';

  /** Tabs de código */
  codeTabs: CodeTabInfo[] = [];

  /** Tab activa */
  activeTabId: string = 'model';

  /** Modal de guardar schema */
  isModalOpen = false;

  /** JSON de ejemplo */
  readonly EXAMPLE_JSON = `{
  "fields": [
    {
      "name": "firstName",
      "type": "string",
      "required": true,
      "label": "Nombre",
      "placeholder": "Ingrese su nombre"
    },
    {
      "name": "lastName",
      "type": "string",
      "required": true,
      "label": "Apellido"
    },
    {
      "name": "age",
      "type": "number",
      "required": false,
      "label": "Edad"
    },
    {
      "name": "isActive",
      "type": "boolean",
      "required": false,
      "label": "Activo"
    }
  ]
}`;

  constructor(
    private fb: FormBuilder,
    private schemaParser: SchemaParserService,
    private codeGenerator: CodeGeneratorService,
    private supabase: SupabaseService
  ) {
    this.optionsForm = this.fb.group({
      modelName: ['User', [Validators.required, Validators.minLength(1)]],
      formName: ['userForm', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Cargar ejemplo por defecto
    this.loadExample();
  }

  /**
   * Carga el JSON de ejemplo
   */
  loadExample(): void {
    this.jsonInput = this.EXAMPLE_JSON;
    this.errorMessage = '';
  }

  /**
   * Genera el código a partir del JSON
   */
  generateCode(): void {
    this.errorMessage = '';
    this.generatedCode = null;
    this.parsedSchema = null;

    // Validar formulario de opciones
    if (!this.optionsForm.valid) {
      this.errorMessage = 'Por favor complete los nombres del modelo y formulario';
      return;
    }

    // Parsear JSON
    const parseResult = this.schemaParser.parse(this.jsonInput);

    if (!parseResult.success || !parseResult.data) {
      this.errorMessage = parseResult.error?.message || 'Error al parsear el JSON';
      return;
    }

    this.parsedSchema = parseResult.data;

    // Generar código
    try {
      this.generatedCode = this.codeGenerator.generate(
        this.parsedSchema,
        {
          modelName: this.optionsForm.value.modelName,
          formName: this.optionsForm.value.formName
        }
      );

      // Crear tabs
      this.codeTabs = [
        {
          id: 'model',
          label: 'Model.ts',
          fileName: `${this.optionsForm.value.modelName}.model.ts`,
          content: this.generatedCode.modelFile
        },
        {
          id: 'form',
          label: 'Form.ts',
          fileName: `${this.optionsForm.value.formName}.ts`,
          content: this.generatedCode.formFile
        },
        {
          id: 'template',
          label: 'Template.html',
          fileName: `${this.optionsForm.value.formName}.component.html`,
          content: this.generatedCode.templateFile
        }
      ];

      // Activar primera tab
      this.activeTabId = 'model';

    } catch (error) {
      this.errorMessage = `Error al generar código: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  }

  /**
   * Obtiene la tab activa
   */
  get activeTab(): CodeTabInfo | undefined {
    return this.codeTabs.find(tab => tab.id === this.activeTabId);
  }

  /**
   * Maneja el cambio de tab
   */
  onTabChange(tabId: string): void {
    this.activeTabId = tabId;
  }

  /**
   * Abre el modal para guardar el schema
   */
  openSaveModal(): void {
    // Verificar si el usuario está logueado
    if (!this.supabase.isAuthenticated) {
      this.errorMessage = 'Debes iniciar sesión para guardar schemas';
      return;
    }

    // Verificar que hay un schema parseado
    if (!this.parsedSchema) {
      this.errorMessage = 'Primero genera un schema para poder guardarlo';
      return;
    }

    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Maneja el evento cuando se guarda exitosamente
   */
  onSchemaSaved(): void {
    // Opcional: mostrar mensaje de éxito, redirigir, etc.
    console.log('Schema guardado exitosamente');
  }
}
