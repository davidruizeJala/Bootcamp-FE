import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Barra de búsqueda reutilizable (HU-02).
 *
 * - `[(ngModel)]` demuestra two-way binding sobre el texto escrito.
 * - Emite el término con un pequeño debounce (búsqueda en vivo) y también al
 *   enviar el formulario con Enter.
 * - Implementa AfterViewInit para enfocar el input al entrar a la pantalla, de
 *   modo que la persona pueda escribir de inmediato sin pasos extra: ese es un
 *   uso del hook con criterio, ya que el foco solo puede pedirse una vez que la
 *   vista (y el elemento nativo) existen.
 */
@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchBar implements AfterViewInit, OnDestroy {
  /** Término inicial (ej. el que persiste en el store al volver del detalle). */
  readonly initialTerm = input('');
  /** Se emite cada vez que cambia el término de búsqueda. */
  readonly search = output<string>();

  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  /** Modelo del input; two-way binding con [(ngModel)] en la plantilla. */
  query = '';

  private debounce?: ReturnType<typeof setTimeout>;

  constructor() {
    // Refleja el término inicial en el input (incluye la carga inicial y el
    // caso de volver del detalle con una búsqueda previa en el store).
    effect(() => {
      this.query = this.initialTerm();
    });
  }

  ngAfterViewInit(): void {
    this.box()?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounce);
  }

  /** Búsqueda en vivo: espera a que el usuario deje de escribir un instante. */
  onInput(value: string): void {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.search.emit(value), 350);
  }

  /** Enter / botón: busca de inmediato sin esperar el debounce. */
  submit(): void {
    clearTimeout(this.debounce);
    this.search.emit(this.query);
  }
}
