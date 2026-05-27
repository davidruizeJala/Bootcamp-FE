import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-template',
  standalone: true,
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
export class TemplateComponent {
  protected readonly isOpen = signal(true);
  protected readonly isAdmin = signal(true);

  protected toggleMenu(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
