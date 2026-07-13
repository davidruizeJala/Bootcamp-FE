import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Card } from '../../core/models/card.model';
import { CatalogStore } from '../../core/services/catalog-store';
import { CardThumb } from '../../shared/card-thumb/card-thumb';
import { Pagination } from '../../shared/pagination/pagination';
import { SearchBar } from '../../shared/search-bar/search-bar';

/**
 * Pantalla principal: catálogo de cartas + búsqueda (HU-01, HU-02).
 *
 * Es un contenedor: no maneja estado propio, solo lee las señales del
 * CatalogStore y reacciona a los eventos de sus componentes hijos (HU-05).
 */
@Component({
  selector: 'app-catalog-page',
  imports: [SearchBar, CardThumb, Pagination],
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  protected readonly store = inject(CatalogStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Solo carga el catálogo inicial la primera vez. Si el usuario ya había
    // buscado algo y vuelve del detalle, se conserva su resultado (HU-03).
    if (this.store.status() === 'idle') {
      this.store.loadInitial();
    }
  }

  onSearch(term: string): void {
    this.store.search(term);
  }

  onPageChange(page: number): void {
    this.store.goToPage(page);
    // Al cambiar de página, volver arriba para ver la nueva grilla desde el inicio.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSelect(card: Card): void {
    this.store.select(card);
    this.router.navigate(['card', card.id]);
  }
}
