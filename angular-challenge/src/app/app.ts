import { Component } from '@angular/core';
import { TemplateComponent } from './components/template/template.component';

@Component({
  selector: 'app-root',
  imports: [TemplateComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
