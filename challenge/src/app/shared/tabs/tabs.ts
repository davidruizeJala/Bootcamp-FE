import { Component, contentChildren, effect, signal } from '@angular/core';

import { TabPanel } from './tab-panel';

/**
 * Contenedor de pestañas genérico y reutilizable (HU-04).
 *
 * Lee sus secciones mediante `contentChildren(TabPanel)` —es decir, accede al
 * contenido proyectado— para dibujar la fila de pestañas a partir de los
 * títulos de cada panel y mostrar solo la sección activa. No depende de que el
 * contenido sean "cartas de Yu-Gi-Oh": sirve para cualquier conjunto de
 * secciones.
 */
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
})
export class Tabs {
  /** Paneles proyectados entre <app-tabs> ... </app-tabs>. */
  readonly panels = contentChildren(TabPanel);
  readonly activeIndex = signal(0);

  constructor() {
    // Mantiene sincronizado qué panel está visible con la pestaña activa,
    // y reajusta el índice si cambia la cantidad de paneles.
    effect(() => {
      const panels = this.panels();
      if (!panels.length) return;

      const active = Math.min(this.activeIndex(), panels.length - 1);
      panels.forEach((panel, i) => panel.active.set(i === active));
    });
  }

  select(index: number): void {
    this.activeIndex.set(index);
  }
}
