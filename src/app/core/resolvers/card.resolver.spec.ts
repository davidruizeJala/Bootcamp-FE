import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  RouterStateSnapshot,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { isObservable, firstValueFrom, of } from 'rxjs';

import { cardResolver } from './card.resolver';
import { Card } from '../models/card.model';

const API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

function routeWithId(id: string): ActivatedRouteSnapshot {
  return { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
}

function runResolver(id: string) {
  return TestBed.runInInjectionContext(() =>
    cardResolver(routeWithId(id), {} as RouterStateSnapshot),
  );
}

describe('cardResolver', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('HU-04: resolves the card by id before activation', async () => {
    const result = runResolver('6983839');
    const value$ = isObservable(result) ? result : of(result);
    const cardPromise = firstValueFrom(value$);

    const req = http.expectOne((r) => r.params.get('id') === '6983839');
    req.flush({ data: [{ id: 6983839, name: 'Tornado Dragon' } as Card] });

    const card = await cardPromise;
    expect((card as Card).name).toBe('Tornado Dragon');
  });

  it('HU-04: redirects when the card does not exist', async () => {
    const result = runResolver('999999999');
    const value$ = isObservable(result) ? result : of(result);
    const valuePromise = firstValueFrom(value$);

    const req = http.expectOne((r) => r.params.get('id') === '999999999');
    req.flush({ data: [] });

    const value = await valuePromise;
    expect(value).toBeInstanceOf(RedirectCommand);
  });
});
