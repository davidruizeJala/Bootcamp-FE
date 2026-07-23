import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileStore } from '../../core/services/profile-store';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private readonly profile = inject(ProfileStore);
  private readonly router = inject(Router);

  protected readonly draft = signal(this.profile.alias() ?? '');

  onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  save(event: Event): void {
    event.preventDefault();
    const name = this.draft().trim();
    if (!name) return;
    this.profile.setAlias(name);
    this.router.navigate(['/coleccion']);
  }
}
