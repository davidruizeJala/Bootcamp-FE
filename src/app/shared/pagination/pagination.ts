import { Component, computed, input, output } from '@angular/core';

type PagerItem = { kind: 'page'; value: number } | { kind: 'gap' };

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

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
