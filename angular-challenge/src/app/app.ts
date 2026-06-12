import { Component } from '@angular/core';
import { TemplateComponent } from './components/template/template.component';
import { TextPreview } from './models/example2 - fontsizeslider/parent/text-preview/text-preview';
import { Father } from './models/ejemplo1/father/father';

@Component({
  selector: 'app-root',
  imports: [TemplateComponent, TextPreview, Father],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
