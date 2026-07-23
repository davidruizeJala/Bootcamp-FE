import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Card } from '../../core/models/card.model';
import { CatalogStore } from '../../core/services/catalog-store';
import { ProfileStore } from '../../core/services/profile-store';
import { CardThumb } from '../../shared/card-thumb/card-thumb';
import { HighlightAtkDirective } from '../../shared/directives/highlight-atk.directive';
import { Pagination } from '../../shared/pagination/pagination';
import { SearchBar } from '../../shared/search-bar/search-bar';

@Component({
  selector: 'app-catalog-page',
  imports: [SearchBar, CardThumb, Pagination, HighlightAtkDirective],
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  protected readonly store = inject(CatalogStore);
  protected readonly profile = inject(ProfileStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.store.status() === 'idle') {
      this.store.loadInitial();
    }
  }

  onSearch(term: string): void {
    this.store.search(term);
  }

  onPageChange(page: number): void {
    this.store.goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSelect(card: Card): void {
    this.store.select(card);
    this.router.navigate(['card', card.id]);
  }

  onToggleFavorite(card: Card): void {
    this.profile.toggleFavorite(card);
  }
}
