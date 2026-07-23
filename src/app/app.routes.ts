import { Routes } from '@angular/router';

import { CatalogPage } from './features/catalog/catalog-page';
import { CardDetailPage } from './features/card-detail/card-detail-page';
import { EffectSection } from './features/card-detail/sections/effect-section';
import { StatsSection } from './features/card-detail/sections/stats-section';
import { PriceSection } from './features/card-detail/sections/price-section';
import { CollectionPage } from './features/collection/collection-page';
import { ProfilePage } from './features/profile/profile-page';
import { NotFoundPage } from './features/not-found/not-found-page';
import { cardResolver } from './core/resolvers/card.resolver';
import { aliasGuard } from './core/guards/alias.guard';

export const routes: Routes = [
  { path: '', component: CatalogPage, title: 'Duelist Codex — Catálogo' },
  {
    path: 'card/:id',
    component: CardDetailPage,
    title: 'Duelist Codex — Detalle',
    resolve: { card: cardResolver },
    children: [
      { path: '', redirectTo: 'efecto', pathMatch: 'full' },
      { path: 'efecto', component: EffectSection },
      { path: 'estadisticas', component: StatsSection },
      { path: 'precio', component: PriceSection },
    ],
  },
  {
    path: 'coleccion',
    component: CollectionPage,
    title: 'Duelist Codex — Mi colección',
    canActivate: [aliasGuard],
  },
  { path: 'perfil', component: ProfilePage, title: 'Duelist Codex — Perfil' },
  { path: '**', component: NotFoundPage, title: 'Duelist Codex — No encontrado' },
];
