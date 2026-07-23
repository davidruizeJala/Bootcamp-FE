import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { Card } from '../models/card.model';
import { CardApiService } from '../services/card-api.service';
import { CatalogStore } from '../services/catalog-store';

export const cardResolver: ResolveFn<Card | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const api = inject(CardApiService);
  const store = inject(CatalogStore);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));
  const notFound = new RedirectCommand(router.parseUrl('/404'));

  if (Number.isNaN(id)) {
    return notFound;
  }

  const current = store.selected();
  if (current?.id === id) {
    return current;
  }

  return api.getById(id).pipe(
    map((card) => {
      if (!card) return notFound;
      store.select(card);
      return card;
    }),
    catchError(() => of(notFound)),
  );
};
