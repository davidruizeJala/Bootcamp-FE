import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { Card, CardApiResponse } from '../models/card.model';

/**
 * Único punto de la aplicación que habla con HttpClient y con la API de
 * YGOPRODeck. Los componentes nunca llaman a HttpClient directamente: piden
 * los datos a través de este servicio (y del store que lo consume).
 */
@Injectable({ providedIn: 'root' })
export class CardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  /**
   * Carga un conjunto inicial de cartas para poblar el catálogo antes de que
   * el usuario busque algo. Se usa num/offset para no traer las ~13k cartas.
   */
  getInitialCatalog(size = 40): Observable<Card[]> {
    const params = new HttpParams().set('num', size).set('offset', 0);
    return this.request(params);
  }

  /**
   * Búsqueda difusa por nombre (parámetro `fname`): devuelve todas las cartas
   * cuyo nombre contiene el término. Cuando la API no encuentra coincidencias
   * responde con un 400, que aquí se traduce a una lista vacía: "sin
   * resultados" es un estado normal de la búsqueda, no un error a mostrar.
   */
  searchByName(term: string): Observable<Card[]> {
    const params = new HttpParams().set('fname', term);
    return this.request(params).pipe(
      catchError((err: HttpErrorResponse) =>
        this.isNoMatch(err) ? of<Card[]>([]) : throwError(() => err),
      ),
    );
  }

  /** Trae una carta puntual por id (permite refrescar/entrar directo al detalle). */
  getById(id: number): Observable<Card | null> {
    const params = new HttpParams().set('id', id);
    return this.request(params).pipe(map((cards) => cards[0] ?? null));
  }

  /** Ejecuta la petición y normaliza la respuesta a un arreglo de cartas. */
  private request(params: HttpParams): Observable<Card[]> {
    return this.http
      .get<CardApiResponse>(this.baseUrl, { params })
      .pipe(map((res) => res.data ?? []));
  }

  /** La API responde 400 cuando el término no coincide con ninguna carta. */
  private isNoMatch(err: HttpErrorResponse): boolean {
    return err.status === 400 || err.status === 404;
  }
}
