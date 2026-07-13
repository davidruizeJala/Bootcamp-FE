import { Component, input, output, signal } from '@angular/core';

import { Card } from '../../core/models/card.model';

/**
 * Tarjeta individual del catálogo (HU-01).
 *
 * Comunicación entre componentes: recibe la carta con `input()` y avisa la
 * selección con `output()`. Es puramente de presentación (no conoce el store
 * ni el router), lo que la hace reutilizable en cualquier grilla de cartas.
 */
@Component({
  selector: 'app-card-thumb',
  templateUrl: './card-thumb.html',
})
export class CardThumb {
  readonly card = input.required<Card>();
  readonly select = output<Card>();

  /** Se activa si la imagen no carga, para mostrar un marcador de posición. */
  readonly imageFailed = signal(false);
}
