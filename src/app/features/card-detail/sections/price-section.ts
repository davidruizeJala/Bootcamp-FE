import { Component, computed, inject } from '@angular/core';

import { CatalogStore } from '../../../core/services/catalog-store';

@Component({
  selector: 'app-price-section',
  template: `
    @if (prices(); as p) {
      <ul class="space-y-2 text-sm">
        <li class="flex justify-between border-b border-slate-100 pb-1">
          <span class="text-slate-500">Cardmarket</span>
          <span class="font-semibold text-slate-800">€ {{ p.cardmarket_price }}</span>
        </li>
        <li class="flex justify-between border-b border-slate-100 pb-1">
          <span class="text-slate-500">TCGplayer</span>
          <span class="font-semibold text-slate-800">$ {{ p.tcgplayer_price }}</span>
        </li>
        <li class="flex justify-between border-b border-slate-100 pb-1">
          <span class="text-slate-500">eBay</span>
          <span class="font-semibold text-slate-800">$ {{ p.ebay_price }}</span>
        </li>
        <li class="flex justify-between">
          <span class="text-slate-500">Amazon</span>
          <span class="font-semibold text-slate-800">$ {{ p.amazon_price }}</span>
        </li>
      </ul>
    } @else {
      <p class="text-sm text-slate-500">Sin información de precio.</p>
    }
  `,
})
export class PriceSection {
  protected readonly store = inject(CatalogStore);
  protected readonly prices = computed(() => this.store.selected()?.card_prices?.[0] ?? null);
}
