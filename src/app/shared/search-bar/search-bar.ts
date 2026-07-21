import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewEncapsulation,
  model,
  viewChild,
} from '@angular/core';

/**
 * Barra de búsqueda reutilizable (HU-02).
 *
 * - `term` es un model() (signal de two-way binding): reemplaza al par
 *   input + output. El padre lo enlaza con [term] para sembrar el valor
 *   guardado y escucha (termChange) para recibir el término al buscar.
 * - La búsqueda se dispara solo al enviar el formulario (Enter o botón "Buscar"),
 *   no en vivo. Por eso el input se escribe de forma nativa y solo confirmamos el
 *   valor hacia el padre en submit(): un model comunica un valor, así que el
 *   "evento buscar" se emula haciendo term.set() únicamente al enviar.
 * - Implementa AfterViewInit para enfocar el input al entrar a la pantalla, de
 *   modo que la persona pueda escribir de inmediato sin pasos extra: ese es un
 *   uso del hook con criterio, ya que el foco solo puede pedirse una vez que la
 *   vista (y el elemento nativo) existen.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchBar implements AfterViewInit {
  /**
   * Término de búsqueda con two-way binding.
   * - Entra: el término guardado en el store al volver del detalle (HU-03).
   * - Sale: el término confirmado al enviar el formulario.
   */
  readonly term = model('');

  // required: el input siempre existe en la plantilla, así que la señal nunca
  // es undefined y evitamos guardas (?./!) innecesarias al leerla.
  private readonly box = viewChild.required<ElementRef<HTMLInputElement>>('box');

  ngAfterViewInit(): void {
    this.box().nativeElement.focus();
  }

  /** Enter / botón "Buscar": confirma el término escrito hacia el padre. */
  submit(event: Event): void {
    event.preventDefault();
    this.term.set(this.box().nativeElement.value);
  }
}
