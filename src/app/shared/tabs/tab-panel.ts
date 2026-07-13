import { Component, computed, inject, input } from '@angular/core';

import { Tabs } from './tabs';

/**
 * Una sección con título dentro de <app-tabs>. Solo proyecta su contenido y
 * expone su título; no sabe nada del dominio (cartas, precios, etc.), por lo
 * que el mecanismo de pestañas es totalmente reutilizable (HU-04).
 *
 * `active` es estado derivado: el panel pregunta a su contenedor <app-tabs>
 * (vía DI) si él es el panel activo. No recibe nada empujado desde fuera.
 */
@Component({
  selector: 'app-tab-panel',
  template: `
    <div role="tabpanel" [hidden]="!active()">
      <ng-content />
    </div>
  `,
})
export class TabPanel {
  // Un TabPanel solo tiene sentido dentro de un Tabs, del que deriva su estado.
  private readonly tabs = inject(Tabs);

  readonly title = input.required<string>();

  /** true si este panel es el que el contenedor Tabs marca como activo. */
  readonly active = computed<boolean>(() => this.tabs.activePanel() === this);
}
