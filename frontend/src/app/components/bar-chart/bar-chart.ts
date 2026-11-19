import { Component, computed, input, numberAttribute, output, PipeTransform } from '@angular/core';

const NUM_VERTICAL_GRID_LINES: number = 5;
const NUM_HORIZONTAL_GRID_LINES: number = 5;

interface ChartBar {
  height: number;
  left: number;
  record: object;
  value: string;
  width: number;
}

interface GridLine {
  label: string;
  position: number;
}

@Component({
  imports: [],
  selector: 'app-bar-chart',
  styleUrl: './bar-chart.scss',
  templateUrl: './bar-chart.html',
})
export class BarChart {
  readonly records = input<readonly object[]>([]);
  readonly xField = input('');
  readonly yField = input('');
  readonly barWidthField = input('');
  readonly minX = input(0, { transform: numberAttribute });
  readonly maxX = input(100, { transform: numberAttribute });
  readonly minY = input(0, { transform: numberAttribute });
  readonly maxY = input(100, { transform: numberAttribute });
  readonly xAxisInterval = input(0, { transform: numberAttribute });
  readonly yAxisInterval = input(0, { transform: numberAttribute });
  readonly xAxisPipe = input<PipeTransform | null>(null);
  readonly yAxisPipe = input<PipeTransform | null>(null);
  readonly xAxisPipeArgs = input<readonly unknown[]>([]);
  readonly yAxisPipeArgs = input<readonly unknown[]>([]);
  readonly highlightedBarIndex = input<number | null>(null);
  readonly barHover = output<object>();
  readonly barHoverEnd = output<object>();

  protected readonly verticalGridLines = computed(() =>
    this.gridLines(
      this.minX(),
      this.maxX(),
      NUM_VERTICAL_GRID_LINES,
      this.xAxisPipe(),
      this.xAxisPipeArgs(),
      this.xAxisInterval(),
    ),
  );

  protected readonly horizontalGridLines = computed(() =>
    this.gridLines(
      this.validAxisMaximum(this.minY(), this.maxY()),
      this.minY(),
      NUM_HORIZONTAL_GRID_LINES,
      this.yAxisPipe(),
      this.yAxisPipeArgs(),
      this.yAxisInterval(),
    ),
  );

  protected readonly bars = computed<ChartBar[]>(() => {
    const minX = this.minX();
    const maxX = this.validMaximum(minX, this.maxX());
    const minY = this.minY();
    const maxY = this.validAxisMaximum(minY, this.maxY());
    const xRange = maxX - minX;
    const yRange = maxY - minY;

    return this.records().map((record) => {
      const xValue = this.clamp(this.numericValue(record, this.xField()), minX, maxX);
      const yValue = this.clampBetween(this.numericValue(record, this.yField()), minY, maxY);
      const widthValue = Math.max(0, this.numericValue(record, this.barWidthField()));
      const left = ((xValue - minX) / xRange) * 100;
      const availableWidth = 100 - left;
      const width = Math.min((widthValue / xRange) * 100, availableWidth);
      const height = ((yValue - minY) / yRange) * 100;

      return {
        height,
        left,
        record,
        value: this.formatLabel(yValue, this.yAxisPipe(), this.yAxisPipeArgs()),
        width,
      };
    });
  });

  private gridLines(
    startValue: number,
    endValue: number,
    count: number,
    pipe: PipeTransform | null,
    pipeArgs: readonly unknown[],
    interval: number,
  ): GridLine[] {
    const range = endValue - startValue;
    const absoluteInterval = Math.abs(interval);
    const values = absoluteInterval
      ? this.intervalValues(startValue, endValue, absoluteInterval)
      : this.automaticIntervalValues(startValue, endValue, count);

    return values.map((value) => ({
      label: this.formatLabel(value, pipe, pipeArgs),
      position: range === 0 ? 0 : ((value - startValue) / range) * 100,
    }));
  }

  private intervalValues(start: number, end: number, interval: number): number[] {
    const lowerBound = Math.min(start, end);
    const upperBound = Math.max(start, end);
    if (lowerBound === upperBound) {
      return [start];
    }

    const firstValue = (Math.floor(lowerBound / interval) + 1) * interval;
    const values: number[] = [];
    for (let value = firstValue; value < upperBound; value += interval) {
      values.push(value);
    }
    return start <= end ? values : values.reverse();
  }

  private automaticIntervalValues(start: number, end: number, count: number): number[] {
    const lowerBound = Math.min(start, end);
    const upperBound = Math.max(start, end);
    if (lowerBound === upperBound) {
      return [start];
    }

    const interval = this.niceIntervalAtMost((upperBound - lowerBound) / Math.max(1, count));
    const firstValue = Math.ceil(lowerBound / interval) * interval;
    const values: number[] = [];
    for (let value = firstValue; value <= upperBound; value += interval) {
      values.push(value);
    }
    return start <= end ? values : values.reverse();
  }

  private niceIntervalAtMost(value: number): number {
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    if (normalized >= 5) return 5 * magnitude;
    if (normalized >= 2.5) return 2.5 * magnitude;
    if (normalized >= 2) return 2 * magnitude;
    return magnitude;
  }

  private numericValue(record: object, field: string): number {
    const value = (record as Record<string, unknown>)[field];
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  private validMaximum(minimum: number, maximum: number): number {
    return maximum > minimum ? maximum : minimum + 1;
  }

  private validAxisMaximum(minimum: number, maximum: number): number {
    return maximum === minimum ? minimum + 1 : maximum;
  }

  private clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(Math.max(value, minimum), maximum);
  }

  private clampBetween(value: number, first: number, second: number): number {
    return this.clamp(value, Math.min(first, second), Math.max(first, second));
  }

  private formatLabel(
    value: number,
    pipe: PipeTransform | null,
    pipeArgs: readonly unknown[],
  ): string {
    if (pipe) {
      return String(pipe.transform(value, ...pipeArgs));
    }
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  }
}
