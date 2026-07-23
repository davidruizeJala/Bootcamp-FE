import { Component, input, output, signal } from '@angular/core';

import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-card-thumb',
  templateUrl: './card-thumb.html',
})
export class CardThumb {
  readonly card = input.required<Card>();
  readonly favorite = input(false);
  readonly select = output<Card>();
  readonly toggleFavorite = output<Card>();

  readonly imageFailed = signal(false);
}
