import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statValue' })
export class StatValuePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    return value.toLocaleString('en-US');
  }
}
