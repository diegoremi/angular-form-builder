import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeTabInfo } from '../../../core/models';

/**
 * Componente de tabs para mostrar diferentes vistas
 */
@Component({
  selector: 'app-tabs',
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  /** Lista de tabs */
  @Input() tabs: CodeTabInfo[] = [];

  /** Tab activa actualmente */
  @Input() activeTabId: string = '';

  /** Emite cuando se selecciona una tab */
  @Output() tabChange = new EventEmitter<string>();

  /**
   * Maneja el click en una tab
   */
  selectTab(tabId: string): void {
    this.activeTabId = tabId;
    this.tabChange.emit(tabId);
  }

  /**
   * Verifica si una tab está activa
   */
  isActive(tabId: string): boolean {
    return this.activeTabId === tabId;
  }
}
