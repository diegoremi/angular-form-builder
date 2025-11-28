import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSchema } from '../../core/models';
import { SchemaService } from '../../core/services/schema.service';
import { CreateSchemaDto } from '../../core/models/saved-schema.model';

@Component({
  selector: 'app-save-schema-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './save-schema-modal.component.html',
  styleUrl: './save-schema-modal.component.scss'
})
export class SaveSchemaModalComponent implements OnInit {
  @Input() schema!: FormSchema;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  saveForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private schemaService: SchemaService
  ) {}

  ngOnInit(): void {
    this.saveForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      is_public: [false]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.saveForm.invalid) {
      this.saveForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const dto: CreateSchemaDto = {
      ...this.saveForm.value,
      schema_json: this.schema
    };

    const { data, error } = await this.schemaService.createSchema(dto);

    if (error) {
      this.errorMessage = error.message || 'Error al guardar el schema';
      this.isLoading = false;
    } else {
      this.successMessage = 'Schema guardado exitosamente';
      this.isLoading = false;
      this.saved.emit();
      setTimeout(() => {
        this.onClose();
      }, 1000);
    }
  }

  onClose(): void {
    this.saveForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.close.emit();
  }

  get name() {
    return this.saveForm.get('name');
  }

  get description() {
    return this.saveForm.get('description');
  }

  get is_public() {
    return this.saveForm.get('is_public');
  }
}
