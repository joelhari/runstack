import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { BarChart } from '../../../components/bar-chart/bar-chart';
import { ActivityLap } from '../../../models/activity-lap';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { KilometersPipe } from '../../../pipes/kilometers.pipe';

interface LapChartRecord {
  barIndex: number;
  distance: number;
  lapDistance: number;
  lapId: number;
  pace: number;
}

@Component({
  imports: [BarChart, DurationPipe, KilometersPipe],
  selector: 'app-laps',
  styleUrl: './laps.scss',
  templateUrl: './laps.html',
})
export class Laps {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly laps = input<readonly ActivityLap[] | null>(null);

  protected readonly durationPipe = new DurationPipe();
  protected readonly highlightedBarIndex = signal<number | null>(null);
  protected readonly highlightedLapId = signal<number | null>(null);
  protected readonly kilometersPipe = new KilometersPipe();

  protected lapChartRecords(laps: readonly ActivityLap[]): LapChartRecord[] {
    let distance = 0;
    return laps.map((lap, barIndex) => {
      const lapDistance = lap.distance ?? 0;
      const record = {
        barIndex,
        distance,
        lapDistance,
        lapId: lap.id,
        pace: lap.averagePace ?? 0,
      };
      distance += lapDistance;
      return record;
    });
  }

  protected highlightLap(record: object): void {
    const { barIndex, lapId } = record as LapChartRecord;
    this.highlightedBarIndex.set(barIndex);
    this.highlightedLapId.set(lapId);
    this.scrollLapIntoView(lapId);
  }

  protected clearHighlightedLap(record: object): void {
    const lapId = (record as LapChartRecord).lapId;
    if (this.highlightedLapId() === lapId) {
      this.highlightedBarIndex.set(null);
      this.highlightedLapId.set(null);
    }
  }

  protected highlightLapRow(lapId: number, barIndex: number): void {
    this.highlightedLapId.set(lapId);
    this.highlightedBarIndex.set(barIndex);
  }

  protected clearHighlightedLapRow(lapId: number): void {
    if (this.highlightedLapId() === lapId) {
      this.highlightedLapId.set(null);
      this.highlightedBarIndex.set(null);
    }
  }

  protected lapChartMaxDistance(laps: readonly ActivityLap[]): number {
    return laps.reduce((total, lap) => total + (lap.distance ?? 0), 0);
  }

  protected lapChartMinPace(laps: readonly ActivityLap[]): number {
    const paces = this.lapPaces(laps);
    return paces.length ? Math.max(...paces) + 60_000 : 10_000;
  }

  protected lapChartMaxPace(laps: readonly ActivityLap[]): number {
    const paces = this.lapPaces(laps);
    return paces.length ? Math.max(0, Math.min(...paces) - 10_000) : 0;
  }

  private lapPaces(laps: readonly ActivityLap[]): number[] {
    return laps.flatMap((lap) => (lap.averagePace === null ? [] : [lap.averagePace]));
  }

  private scrollLapIntoView(lapId: number): void {
    const host = this.elementRef.nativeElement;
    const scrollContainer = host.querySelector<HTMLElement>('.lap-table');
    const header = scrollContainer?.querySelector<HTMLElement>('thead');
    const row = scrollContainer?.querySelector<HTMLElement>(`tr[data-lap-id="${lapId}"]`);
    if (!scrollContainer || !header || !row) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const visibleTop = Math.max(containerRect.top, headerRect.bottom);

    if (rowRect.top < visibleTop) {
      scrollContainer.scrollTop -= visibleTop - rowRect.top;
    } else if (rowRect.bottom > containerRect.bottom) {
      scrollContainer.scrollTop += rowRect.bottom - containerRect.bottom;
    }
  }
}
