import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('My Recipe box');

  protected sayHiButton1(): void {
    console.log('Boton 1 clickeado');
  }
  protected sayHiButton2(): void {
    console.log('Boton 1 clickeado');
  }
}
