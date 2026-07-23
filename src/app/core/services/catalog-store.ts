import { Service, computed, inject, signal } from '@angular/core';

import { Card } from '../models/card.model';
import { CardApiService, PAGE_SIZE } from './card-api.service';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

@Service()
export class CatalogStore {
  private readonly api = inject(CardApiService);

  private readonly _term = signal('');
  private readonly _cards = signal<Card[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _error = signal<string | null>(null);

  private readonly _page = signal(1);
  private readonly _total = signal(0);

  private readonly _selected = signal<Card | null>(null);

  readonly term = this._term.asReadonly();
  readonly cards = this._cards.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly total = this._total.asReadonly();
  readonly selected = this._selected.asReadonly();

  readonly isLoading = computed(() => this._status() === 'loading');
  readonly hasError = computed(() => this._status() === 'error');
  readonly isEmpty = computed(
    () => this._status() === 'success' && this._cards().length === 0,
  );
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / PAGE_SIZE)));

  loadInitial(): void {
    this._term.set('');
    this._page.set(1);
    this.fetchPage();
  }

  search(term: string): void {
    this._term.set(term);
    this._page.set(1);
    this.fetchPage();
  }

  goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    if (target === this._page() && this._status() === 'success') return;
    this._page.set(target);
    this.fetchPage();
  }

  retry(): void {
    this.fetchPage();
  }

  select(card: Card): void {
    this._selected.set(card);
  }

  private fetchPage(): void {
    const term = this._term().trim();
    const offset = (this._page() - 1) * PAGE_SIZE;
    const source = term
      ? this.api.searchByName(term, offset)
      : this.api.getCatalogPage(offset);

    this._status.set('loading');
    this._error.set(null);
    source.subscribe({
      next: ({ cards, total }) => {
        this._cards.set(cards);
        this._total.set(total);
        this._status.set('success');
      },
      error: () => {
        this._cards.set([]);
        this._total.set(0);
        this._error.set('No pudimos conectar con el catálogo. Intenta de nuevo.');
        this._status.set('error');
      },
    });
  }
}
