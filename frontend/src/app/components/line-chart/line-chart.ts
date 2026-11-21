import { Component, computed, input, numberAttribute, PipeTransform, signal } from '@angular/core';

const NUM_VERTICAL_GRID_LINES: number = 5;
const NUM_HORIZONTAL_GRID_LINES: number = 5;

interface GridLine {
  label: string;
  position: number;
}

interface ChartPoint {
  x: number;
  xPosition: number;
  y: number;
  yPosition: number;
}

interface CrosshairPosition {
  x: number;
  xLabel: string;
  y: number;
  yLabel: string;
  y2?: number;
  yLabel2?: string;
}

interface InterpolatedValue {
  position: number;
  value: number;
}

@Component({
  imports: [],
  selector: 'app-line-chart',
  styleUrl: './line-chart.scss',
  templateUrl: './line-chart.html',
})
export class LineChart {
  readonly records = input<readonly object[]>([]);
  readonly color = input<string>('primary');
  readonly color2 = input<string>('secondary');
  readonly xField = input('');
  readonly yField = input('');
  readonly yField2 = input('');
  readonly minX = input(0, { transform: numberAttribute });
  readonly maxX = input(100, { transform: numberAttribute });
  readonly minY = input(0, { transform: numberAttribute });
  readonly maxY = input(100, { transform: numberAttribute });
  readonly minY2 = input<number | null>(null);
  readonly maxY2 = input<number | null>(null);
  readonly xAxisInterval = input(0, { transform: numberAttribute });
  readonly yAxisInterval = input(0, { transform: numberAttribute });
  readonly yAxisInterval2 = input<number | null>(null);
  readonly xAxisPipe = input<PipeTransform | null>(null);
  readonly yAxisPipe = input<PipeTransform | null>(null);
  readonly yAxisPipe2 = input<PipeTransform | null>(null);
  readonly xAxisPipeArgs = input<readonly unknown[]>([]);
  readonly yAxisPipeArgs = input<readonly unknown[]>([]);
  readonly yAxisPipeArgs2 = input<readonly unknown[] | null>(null);

  protected readonly crosshair = signal<CrosshairPosition | null>(null);

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

  protected readonly horizontalGridLines2 = computed(() => {
    if (!this.yField2()) return [];
    return this.gridLines(
      this.validAxisMaximum(this.resolvedMinY2(), this.resolvedMaxY2()),
      this.resolvedMinY2(),
      NUM_HORIZONTAL_GRID_LINES,
      this.yAxisPipe2() ?? this.yAxisPipe(),
      this.yAxisPipeArgs2() ?? this.yAxisPipeArgs(),
      this.yAxisInterval2() ?? this.yAxisInterval(),
    );
  });

  private readonly chartPoints = computed<ChartPoint[]>(() => {
    const minX = this.minX();
    const maxX = this.validMaximum(minX, this.maxX());
    const minY = this.minY();
    const maxY = this.validAxisMaximum(minY, this.maxY());
    const xRange = maxX - minX;
    const yRange = maxY - minY;

    return this.records().map((record) => {
      const xValue = this.clamp(this.numericValue(record, this.xField()), minX, maxX);
      const yValue = this.clampBetween(this.numericValue(record, this.yField()), minY, maxY);
      return {
        x: xValue,
        xPosition: ((xValue - minX) / xRange) * 100,
        y: yValue,
        yPosition: 100 - ((yValue - minY) / yRange) * 100,
      };
    });
  });

  private readonly chartPoints2 = computed<ChartPoint[]>(() => {
    if (!this.yField2()) return [];
    return this.createChartPoints(this.yField2(), this.resolvedMinY2(), this.resolvedMaxY2());
  });

  protected readonly linePoints = computed(() =>
    this.chartPoints()
      .map((point) => `${point.xPosition},${point.yPosition}`)
      .join(' '),
  );

  protected readonly linePoints2 = computed(() =>
    this.chartPoints2()
      .map((point) => `${point.xPosition},${point.yPosition}`)
      .join(' '),
  );

  private resolvedMinY2(): number {
    return this.minY2() ?? this.minY();
  }

  private resolvedMaxY2(): number {
    return this.maxY2() ?? this.maxY();
  }

  private createChartPoints(field: string, minY: number, configuredMaxY: number): ChartPoint[] {
    const minX = this.minX();
    const maxX = this.validMaximum(minX, this.maxX());
    const maxY = this.validAxisMaximum(minY, configuredMaxY);
    const xRange = maxX - minX;
    const yRange = maxY - minY;

    return this.records().map((record) => {
      const xValue = this.clamp(this.numericValue(record, this.xField()), minX, maxX);
      const yValue = this.clampBetween(this.numericValue(record, field), minY, maxY);
      return {
        x: xValue,
        xPosition: ((xValue - minX) / xRange) * 100,
        y: yValue,
        yPosition: 100 - ((yValue - minY) / yRange) * 100,
      };
    });
  }

  protected showCrosshair(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const bounds = target.getBoundingClientRect();
    if (bounds.width <= 0) {
      this.crosshair.set(null);
      return;
    }

    const xPosition = this.clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
    const minX = this.minX();
    const maxX = this.validMaximum(minX, this.maxX());
    const xValue = minX + ((maxX - minX) * xPosition) / 100;
    const yValue = this.interpolatedYValue(xValue);
    const yValue2 = this.yField2() ? this.interpolatedYValue(xValue, this.chartPoints2()) : null;
    this.crosshair.set(
      yValue === null
        ? null
        : {
            x: xPosition,
            xLabel: this.formatLabel(xValue, this.xAxisPipe(), this.xAxisPipeArgs()),
            y: yValue.position,
            yLabel: this.formatLabel(yValue.value, this.yAxisPipe(), this.yAxisPipeArgs()),
            ...(yValue2 === null
              ? {}
              : {
                  y2: yValue2.position,
                  yLabel2: this.formatLabel(
                    yValue2.value,
                    this.yAxisPipe2() ?? this.yAxisPipe(),
                    this.yAxisPipeArgs2() ?? this.yAxisPipeArgs(),
                  ),
                }),
          },
    );
  }

  protected hideCrosshair(): void {
    this.crosshair.set(null);
  }

  private interpolatedYValue(
    xValue: number,
    chartPoints: readonly ChartPoint[] = this.chartPoints(),
  ): InterpolatedValue | null {
    const points = [...chartPoints].sort((first, second) => first.x - second.x);
    if (!points.length) return null;
    if (xValue <= points[0].x) {
      return { position: points[0].yPosition, value: points[0].y };
    }
    if (xValue >= points[points.length - 1].x) {
      const last = points[points.length - 1];
      return { position: last.yPosition, value: last.y };
    }

    const rightIndex = points.findIndex((point) => point.x >= xValue);
    const left = points[rightIndex - 1];
    const right = points[rightIndex];
    const xRange = right.x - left.x;
    if (xRange === 0) return { position: right.yPosition, value: right.y };

    const ratio = (xValue - left.x) / xRange;
    return {
      position: left.yPosition + (right.yPosition - left.yPosition) * ratio,
      value: left.y + (right.y - left.y) * ratio,
    };
  }

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
