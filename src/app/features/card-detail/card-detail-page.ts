import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-card-detail-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './card-detail-page.html',
})
export class CardDetailPage {
  readonly card = input.required<Card>();
}
