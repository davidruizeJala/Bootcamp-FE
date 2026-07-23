import { Service, computed, signal } from '@angular/core';

import { Card } from '../models/card.model';

@Service()
export class ProfileStore {
  private readonly _alias = signal<string | null>(null);
  private readonly _favorites = signal<Card[]>([]);

  readonly alias = this._alias.asReadonly();
  readonly favorites = this._favorites.asReadonly();

  readonly hasAlias = computed(() => !!this._alias()?.trim());

  setAlias(name: string): void {
    this._alias.set(name.trim() || null);
  }

  isFavorite(id: number): boolean {
    return this._favorites().some((card) => card.id === id);
  }

  toggleFavorite(card: Card): void {
    this._favorites.update((current) =>
      current.some((c) => c.id === card.id)
        ? current.filter((c) => c.id !== card.id)
        : [...current, card],
    );
  }
}
