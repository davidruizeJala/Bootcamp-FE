import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogStore } from '../../core/services/catalog-store';
import { Tabs } from '../../shared/tabs/tabs';
import { TabPanel } from '../../shared/tabs/tab-panel';

/**
 * Vista de detalle de una carta (HU-03) con su información organizada en
 * secciones reutilizables mediante <app-tabs> (HU-04).
 *
 * El id llega desde la ruta `card/:id` gracias a withComponentInputBinding().
 * El botón "Volver" navega al catálogo, que sigue mostrando la búsqueda previa
 * porque su estado vive en el store (HU-03/HU-05).
 */
@Component({
  selector: 'app-card-detail-page',
  imports: [RouterLink, Tabs, TabPanel],
  templateUrl: './card-detail-page.html',
})
export class CardDetailPage {
  /** Parámetro `:id` de la ruta, enlazado por el router. */
  readonly id = input.required<string>();

  protected readonly store = inject(CatalogStore);

  protected readonly card = this.store.selected;
  protected readonly prices = computed(() => this.card()?.card_prices?.[0] ?? null);
  /** Las estadísticas ATK/DEF/nivel solo existen en cartas de tipo monstruo. */
  protected readonly isMonster = computed(() => this.card()?.atk !== undefined);

  constructor() {
    effect(() => {
      const numericId = Number(this.id());
      if (!Number.isNaN(numericId)) {
        this.store.loadCardById(numericId);
      }
    });
  }
}
