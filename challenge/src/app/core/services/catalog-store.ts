import { Service, computed, inject, signal } from '@angular/core';

import { Card } from '../models/card.model';
import { CardApiService } from './card-api.service';

/** Estado posible de una carga de datos (catálogo o detalle). */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Store central de la funcionalidad de búsqueda/catálogo (HU-05).
 *
 * Toda la información viva —término buscado, resultados, estado de carga,
 * error y carta seleccionada— se representa con Signals en un único lugar.
 * Los componentes leen estas señales y llaman a los métodos del store; no
 * mantienen su propio estado de carga ni resultados sueltos. Al ser un
 * singleton (`providedIn: 'root'`), el estado sobrevive a la navegación entre
 * el catálogo y el detalle, por lo que volver del detalle conserva el contexto
 * de la búsqueda anterior (HU-03).
 *
 * Se eligió Signals (y no BehaviorSubject) porque el estado es local de la UI
 * y se lee de forma síncrona en las plantillas sin async pipe ni
 * suscripciones manuales que liberar. Las únicas suscripciones son a los
 * observables de HttpClient, que emiten una vez y completan solos.
 */
@Service()
export class CatalogStore {
  private readonly api = inject(CardApiService);

  // --- Estado del catálogo / búsqueda (HU-01, HU-02) ---
  private readonly _term = signal('');
  private readonly _cards = signal<Card[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _error = signal<string | null>(null);

  // --- Estado del detalle (HU-03) ---
  private readonly _selected = signal<Card | null>(null);
  private readonly _detailStatus = signal<LoadStatus>('idle');

  // Señales de solo lectura expuestas a los componentes.
  readonly term = this._term.asReadonly();
  readonly cards = this._cards.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly detailStatus = this._detailStatus.asReadonly();

  // Derivados útiles para las plantillas.
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly hasError = computed(() => this._status() === 'error');
  /** La búsqueda terminó bien pero no arrojó cartas. */
  readonly isEmpty = computed(
    () => this._status() === 'success' && this._cards().length === 0,
  );

  /** Conjunto inicial de cartas al abrir la app (HU-01). */
  loadInitial(): void {
    this._term.set('');
    this.runCatalog(this.api.getInitialCatalog());
  }

  /**
   * Busca por nombre (HU-02). Si el término queda vacío, se vuelve al catálogo
   * inicial en lugar de dejar la grilla vacía sin contexto.
   */
  search(term: string): void {
    const trimmed = term.trim();
    this._term.set(term);
    if (!trimmed) {
      this.loadInitial();
      return;
    }
    this.runCatalog(this.api.searchByName(trimmed));
  }

  /** Reintenta la última operación (usado por el botón de error). */
  retry(): void {
    const trimmed = this._term().trim();
    trimmed ? this.search(trimmed) : this.loadInitial();
  }

  /** Guarda la carta elegida desde la grilla para mostrarla al instante. */
  select(card: Card): void {
    this._selected.set(card);
    this._detailStatus.set('success');
  }

  /**
   * Carga la carta del detalle a partir del id de la ruta (HU-03). Si ya está
   * seleccionada (llegamos desde la grilla) se muestra sin volver a pedirla; si
   * se entró directo por URL o tras refrescar, se busca por id.
   */
  loadCardById(id: number): void {
    const current = this._selected();
    if (current?.id === id) {
      this._detailStatus.set('success');
      return;
    }

    this._selected.set(null);
    this._detailStatus.set('loading');
    this.api.getById(id).subscribe({
      next: (card) => {
        this._selected.set(card);
        this._detailStatus.set(card ? 'success' : 'error');
      },
      error: () => this._detailStatus.set('error'),
    });
  }

  /** Lógica compartida por loadInitial() y search(): carga una lista de cartas. */
  private runCatalog(source: ReturnType<CardApiService['getInitialCatalog']>): void {
    this._status.set('loading');
    this._error.set(null);
    source.subscribe({
      next: (cards) => {
        this._cards.set(cards);
        this._status.set('success');
      },
      error: () => {
        this._cards.set([]);
        this._error.set('No pudimos conectar con el catálogo. Intenta de nuevo.');
        this._status.set('error');
      },
    });
  }
}
