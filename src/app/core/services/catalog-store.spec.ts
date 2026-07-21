import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CatalogStore } from './catalog-store';
import { Card } from '../models/card.model';

const API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

function fakeCard(id: number, name: string): Card {
  return {
    id,
    name,
    type: 'Effect Monster',
    desc: 'test',
    race: 'Dragon',
    atk: 1000,
    def: 1000,
    card_images: [{ id, image_url: 'x', image_url_small: 'x' }],
  };
}

describe('CatalogStore', () => {
  let store: CatalogStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(CatalogStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('HU-01: loads the initial catalog and exposes it as success', () => {
    store.loadInitial();
    expect(store.status()).toBe('loading');

    const req = http.expectOne((r) => r.url === API && r.params.has('num'));
    req.flush({ data: [fakeCard(1, 'Blue-Eyes'), fakeCard(2, 'Red-Eyes')] });

    expect(store.status()).toBe('success');
    expect(store.cards().length).toBe(2);
    expect(store.isEmpty()).toBe(false);
  });

  it('HU-02: a search with no matches (API 400) becomes an empty result, not an error', () => {
    store.search('zzzzzz');
    const req = http.expectOne((r) => r.params.get('fname') === 'zzzzzz');
    req.flush(
      { error: 'No card matching your query was found in the database.' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(store.status()).toBe('success');
    expect(store.isEmpty()).toBe(true);
    expect(store.term()).toBe('zzzzzz');
  });

  it('HU-05: a real network failure surfaces the error state', () => {
    store.loadInitial();
    const req = http.expectOne((r) => r.params.has('num'));
    req.flush('boom', { status: 500, statusText: 'Server Error' });

    expect(store.status()).toBe('error');
    expect(store.error()).toBeTruthy();
    expect(store.cards().length).toBe(0);
  });

  it('HU-03: selecting a card keeps it available for the detail without refetching', () => {
    const card = fakeCard(42, 'Dark Magician');
    store.select(card);
    expect(store.selected()).toEqual(card);

    store.loadCardById(42);
    // Already selected → no HTTP call, shown immediately.
    http.expectNone((r) => r.params.get('id') === '42');
    expect(store.detailStatus()).toBe('success');
  });

  it('HU-03: entering the detail by id (deep link) fetches the card', () => {
    store.loadCardById(6983839);
    expect(store.detailStatus()).toBe('loading');

    const req = http.expectOne((r) => r.params.get('id') === '6983839');
    req.flush({ data: [fakeCard(6983839, 'Tornado Dragon')] });

    expect(store.detailStatus()).toBe('success');
    expect(store.selected()?.name).toBe('Tornado Dragon');
  });
});
