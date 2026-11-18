import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilometers',
})
export class KilometersPipe implements PipeTransform {
  transform(value: number | null | undefined, decimalDigits = 2): string {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return '—';
    }

    const digits = Math.max(0, Math.trunc(decimalDigits));
    return `${(value / 1000).toFixed(digits)} km`;
  }
}
