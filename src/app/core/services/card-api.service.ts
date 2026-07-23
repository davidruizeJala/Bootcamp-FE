import { Service, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { Card, CardApiResponse } from '../models/card.model';

export const PAGE_SIZE = 40;

export interface CardPage {
  cards: Card[];
  total: number;
}

@Service()
export class CardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  getCatalogPage(offset = 0, num = PAGE_SIZE): Observable<CardPage> {
    const params = new HttpParams().set('num', num).set('offset', offset);
    return this.request(params);
  }

  searchByName(term: string, offset = 0, num = PAGE_SIZE): Observable<CardPage> {
    const params = new HttpParams()
      .set('fname', term)
      .set('num', num)
      .set('offset', offset);
    return this.request(params).pipe(
      catchError((err: HttpErrorResponse) =>
        this.isNoMatch(err) ? of<CardPage>({ cards: [], total: 0 }) : throwError(() => err),
      ),
    );
  }

  getById(id: number): Observable<Card | null> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get<CardApiResponse>(this.baseUrl, { params })
      .pipe(map((res) => res.data?.[0] ?? null));
  }

  private request(params: HttpParams): Observable<CardPage> {
    return this.http.get<CardApiResponse>(this.baseUrl, { params }).pipe(
      map((res) => ({
        cards: res.data ?? [],
        total: res.meta?.total_rows ?? res.data?.length ?? 0,
      })),
    );
  }

  private isNoMatch(err: HttpErrorResponse): boolean {
    return err.status === 400 || err.status === 404;
  }
}
