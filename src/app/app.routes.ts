import { Routes } from '@angular/router';

import { CatalogPage } from './features/catalog/catalog-page';
import { CardDetailPage } from './features/card-detail/card-detail-page';

export const routes: Routes = [
  { path: '', component: CatalogPage, title: 'Duelist Codex — Catálogo' },
  { path: 'card/:id', component: CardDetailPage, title: 'Duelist Codex — Detalle' },
  { path: '**', redirectTo: '' },
];
