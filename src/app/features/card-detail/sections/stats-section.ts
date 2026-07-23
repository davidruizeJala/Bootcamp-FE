import { Component, computed, inject } from '@angular/core';

import { CatalogStore } from '../../../core/services/catalog-store';
import { StatValuePipe } from '../../../shared/pipes/stat-value.pipe';

@Component({
  selector: 'app-stats-section',
  imports: [StatValuePipe],
  template: `
    @if (store.selected(); as c) {
      <dl class="grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-lg bg-slate-50 p-3">
          <dt class="text-slate-500">Tipo</dt>
          <dd class="font-semibold text-slate-800">{{ c.type }}</dd>
        </div>
        <div class="rounded-lg bg-slate-50 p-3">
          <dt class="text-slate-500">Raza</dt>
          <dd class="font-semibold text-slate-800">{{ c.race }}</dd>
        </div>
        @if (c.attribute) {
          <div class="rounded-lg bg-slate-50 p-3">
            <dt class="text-slate-500">Atributo</dt>
            <dd class="font-semibold text-slate-800">{{ c.attribute }}</dd>
          </div>
        }
        @if (c.level != null) {
          <div class="rounded-lg bg-slate-50 p-3">
            <dt class="text-slate-500">Nivel / Rango</dt>
            <dd class="font-semibold text-slate-800">{{ c.level }}</dd>
          </div>
        }
        @if (isMonster()) {
          <div class="rounded-lg bg-slate-50 p-3">
            <dt class="text-slate-500">ATK</dt>
            <dd class="font-semibold text-slate-800">{{ c.atk | statValue }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50 p-3">
            <dt class="text-slate-500">DEF</dt>
            <dd class="font-semibold text-slate-800">{{ c.def | statValue }}</dd>
          </div>
        }
      </dl>
    }
  `,
})
export class StatsSection {
  protected readonly store = inject(CatalogStore);
  protected readonly isMonster = computed(() => this.store.selected()?.atk !== undefined);
}
