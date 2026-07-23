import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewEncapsulation,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchBar implements AfterViewInit {
  readonly term = model('');

  private readonly box = viewChild.required<ElementRef<HTMLInputElement>>('box');

  ngAfterViewInit(): void {
    this.box().nativeElement.focus();
  }

  submit(event: Event): void {
    event.preventDefault();
    this.term.set(this.box().nativeElement.value);
  }
}
