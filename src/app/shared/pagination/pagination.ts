import { Component, computed, input, output } from '@angular/core';

/** Un elemento del paginador: o un número de página, o una elipsis (…). */
type PagerItem = { kind: 'page'; value: number } | { kind: 'gap' };

/**
 * Paginador numérico reutilizable con ventana y elipsis (…). No sabe nada del
 * dominio: recibe la página actual y el total de páginas, y emite la página
 * elegida. Solo muestra un puñado de números (primero, último y el entorno de
 * la página actual), de modo que sirve igual con 3 páginas que con 300.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  /**
   * Ventana de páginas a mostrar: siempre el 1 y el último, más la página
   * actual y sus vecinas; los huecos se colapsan en una elipsis.
   * Ej. (actual 7 de 325) → 1 … 6 7 8 … 325
   */
  readonly items = computed<PagerItem[]>(() => {
    const total = this.totalPages();
    const current = this.page();

    const wanted = new Set<number>([1, total]);
    for (let p = current - 1; p <= current + 1; p++) {
      if (p >= 1 && p <= total) wanted.add(p);
    }

    const sorted = [...wanted].sort((a, b) => a - b);
    const result: PagerItem[] = [];
    let prev = 0;
    for (const p of sorted) {
      if (p - prev > 1) result.push({ kind: 'gap' });
      result.push({ kind: 'page', value: p });
      prev = p;
    }
    return result;
  });

  go(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
