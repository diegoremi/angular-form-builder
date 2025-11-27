import { Component } from '@angular/core';
import { BuilderComponent } from './pages/builder/builder.component';

@Component({
  selector: 'app-root',
  imports: [BuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular Form Builder';
}
