import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Componente para editar JSON en un textarea
 * Componente "tonto" que solo emite eventos
 */
@Component({
  selector: 'app-json-editor',
  imports: [FormsModule],
  templateUrl: './json-editor.component.html',
  styleUrl: './json-editor.component.scss'
})
export class JsonEditorComponent {
  /** Valor del JSON (two-way binding) */
  @Input() value: string = '';

  /** Placeholder del textarea */
  @Input() placeholder: string = 'Pega tu JSON aquí...';

  /** Altura mínima del textarea */
  @Input() minHeight: string = '300px';

  /** Emite cuando el valor cambia */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Maneja el cambio en el textarea
   */
  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
