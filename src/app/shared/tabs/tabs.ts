import { Component, computed, contentChildren, signal } from '@angular/core';

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

  /**
   * Panel activo como estado derivado (no un efecto que empuje estado a los
   * hijos): cada TabPanel se compara con este valor para saber si mostrarse.
   * Recorta el índice si cambia la cantidad de paneles.
   */
  readonly activePanel = computed((): TabPanel | null => {
    const panels = this.panels();
    if (!panels.length) return null;
    return panels[Math.min(this.activeIndex(), panels.length - 1)];
  });

  select(index: number): void {
    this.activeIndex.set(index);
  }
}
