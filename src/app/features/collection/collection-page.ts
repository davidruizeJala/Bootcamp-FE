import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Card } from '../../core/models/card.model';
import { CatalogStore } from '../../core/services/catalog-store';
import { ProfileStore } from '../../core/services/profile-store';
import { CardThumb } from '../../shared/card-thumb/card-thumb';
import { HighlightAtkDirective } from '../../shared/directives/highlight-atk.directive';

@Component({
  selector: 'app-collection-page',
  imports: [CardThumb, HighlightAtkDirective],
  templateUrl: './collection-page.html',
})
export class CollectionPage {
  protected readonly profile = inject(ProfileStore);
  private readonly store = inject(CatalogStore);
  private readonly router = inject(Router);

  onSelect(card: Card): void {
    this.store.select(card);
    this.router.navigate(['card', card.id]);
  }

  onToggleFavorite(card: Card): void {
    this.profile.toggleFavorite(card);
  }
}
