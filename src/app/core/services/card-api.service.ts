import { Service, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { Card, CardApiResponse } from '../models/card.model';

/** Cartas por página, tanto en el catálogo como en la búsqueda. */
export const PAGE_SIZE = 40;

/**
 * Una página de resultados: las cartas de la página más el total de la consulta
 * (lo que devuelve `meta.total_rows`), necesario para dibujar el paginador.
 */
export interface CardPage {
  cards: Card[];
  total: number;
}

/**
 * Único punto de la aplicación que habla con HttpClient y con la API de
 * YGOPRODeck. Los componentes nunca llaman a HttpClient directamente: piden
 * los datos a través de este servicio (y del store que lo consume).
 */
@Service()
export class CardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  /**
   * Una página del catálogo. Con `num`/`offset` la API pagina del lado del
   * servidor: nunca traemos las ~14k cartas, solo las 40 de la página pedida.
   */
  getCatalogPage(offset = 0, num = PAGE_SIZE): Observable<CardPage> {
    const params = new HttpParams().set('num', num).set('offset', offset);
    return this.request(params);
  }

  /**
   * Búsqueda difusa por nombre (parámetro `fname`), también paginada. Cuando la
   * API no encuentra coincidencias responde con un 400, que aquí se traduce a
   * una página vacía: "sin resultados" es un estado normal, no un error.
   */
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

  /** Trae una carta puntual por id (permite refrescar/entrar directo al detalle). */
  getById(id: number): Observable<Card | null> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get<CardApiResponse>(this.baseUrl, { params })
      .pipe(map((res) => res.data?.[0] ?? null));
  }

  /** Ejecuta la petición y normaliza la respuesta a una página de cartas. */
  private request(params: HttpParams): Observable<CardPage> {
    return this.http.get<CardApiResponse>(this.baseUrl, { params }).pipe(
      map((res) => ({
        cards: res.data ?? [],
        // Sin `meta` (respuestas sin paginar o mocks) caemos al tamaño recibido.
        total: res.meta?.total_rows ?? res.data?.length ?? 0,
      })),
    );
  }

  /** La API responde 400 cuando el término no coincide con ninguna carta. */
  private isNoMatch(err: HttpErrorResponse): boolean {
    return err.status === 400 || err.status === 404;
  }
}
