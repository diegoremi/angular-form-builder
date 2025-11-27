import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar código con botón de copiar
 */
@Component({
  selector: 'app-code-viewer',
  imports: [CommonModule],
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.scss'
})
export class CodeViewerComponent {
  /** Código a mostrar */
  @Input() code: string = '';

  /** Nombre del archivo (para mostrar en el header) */
  @Input() fileName: string = '';

  /** Estado del botón de copiar */
  copyButtonText: string = 'Copiar';

  /**
   * Copia el código al portapapeles
   */
  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copyButtonText = 'Copiado!';

      // Resetear el texto después de 2 segundos
      setTimeout(() => {
        this.copyButtonText = 'Copiar';
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      this.copyButtonText = 'Error';
      setTimeout(() => {
        this.copyButtonText = 'Copiar';
      }, 2000);
    }
  }
}
