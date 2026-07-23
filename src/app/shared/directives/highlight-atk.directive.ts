import { Directive, computed, input } from '@angular/core';

import { Card } from '../../core/models/card.model';

@Directive({
  selector: '[appHighlightAtk]',
  host: {
    '[class.is-featured]': 'featured()',
  },
})
export class HighlightAtkDirective {
  readonly card = input.required<Card>({ alias: 'appHighlightAtk' });
  readonly threshold = input(2000);

  protected readonly featured = computed(() => (this.card().atk ?? 0) >= this.threshold());
}
