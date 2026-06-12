import { Component } from '@angular/core';
import { TemplateComponent } from './components/template/template.component';
import { TextPreview } from "./models/example2 - fontsizeslider/parent/text-preview/text-preview";

@Component({
  selector: 'app-root',
  imports: [TemplateComponent, TextPreview],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
