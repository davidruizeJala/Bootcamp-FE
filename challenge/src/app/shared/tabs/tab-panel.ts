import { Component, input, signal } from '@angular/core';

/**
 * Una sección con título dentro de <app-tabs>. Solo proyecta su contenido y
 * expone su título; no sabe nada del dominio (cartas, precios, etc.), por lo
 * que el mecanismo de pestañas es totalmente reutilizable (HU-04).
 *
 * `active` lo controla el contenedor <app-tabs>; el panel se limita a
 * mostrarse u ocultarse.
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
  readonly title = input.required<string>();

  /** Lo activa/desactiva el contenedor Tabs según la pestaña seleccionada. */
  readonly active = signal(false);
}
