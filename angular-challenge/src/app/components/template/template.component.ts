import { Component, signal } from '@angular/core';
import { I18nPluralPipe, I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [I18nPluralPipe, I18nSelectPipe],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
export class TemplateComponent {
  protected readonly isOpen = signal(true);
  protected readonly isAdmin = signal(true);

  protected readonly notificationCount = signal(0);
  protected readonly itemCount = signal(0);
  protected readonly timeTracking = signal(0);
  protected readonly notificationPriority = signal('high');
  protected readonly shippingStatus = signal('pending');

  protected readonly notificationPluralMap: { [k: string]: string } = {
    '=0': 'No new notifications',
    '=1': 'You have 1 new notification',
    other: 'You have # new notifications',
  };

  protected readonly itemPluralMap: { [k: string]: string } = {
    '=0': 'No item in the cart',
    '=1': 'Item in cart',
    other: '# Items in cart',
  };

  protected readonly timePluralMap: { [k: string]: string } = {
    '=0': 'Right now',
    '=1': '1 minute ago',
    other: '# minutes ago',
  };

  protected readonly prioritySelectMap: { [k: string]: string } = {
    high: 'High priority — respond immediately',
    medium: 'Medium priority — respond soon',
    low: 'Low priority — respond when available',
    other: 'Unknown priority',
  };

  protected readonly statusSelectMap: { [k: string]: string } = {
    pending: 'Your order is yet to be shipped',
    shipped: 'Your order has been shipped and its on your way!',
    delivered: 'Your order has been delivered in the established address',
  };

  protected toggleMenu(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
