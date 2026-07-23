import { Component, inject } from '@angular/core';

import { CatalogStore } from '../../../core/services/catalog-store';

@Component({
  selector: 'app-effect-section',
  template: `
    @if (store.selected(); as c) {
      <p class="whitespace-pre-line text-sm leading-relaxed text-slate-700">
        {{ c.desc }}
      </p>
    }
  `,
})
export class EffectSection {
  protected readonly store = inject(CatalogStore);
}
