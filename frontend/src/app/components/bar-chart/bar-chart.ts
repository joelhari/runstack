import { Component, computed, input, numberAttribute, PipeTransform } from '@angular/core';

interface ChartBar {
  height: number;
  width: number;
  x: number;
  y: number;
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
  private readonly barHorizontalMargin = 2;
  private readonly barCornerRadius = 5;

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

  protected readonly plot = {
    bottom: 350,
    height: 320,
    left: 70,
    right: 780,
    top: 30,
    width: 710,
  } as const;
  protected readonly tickLength = 6;

  protected readonly verticalGridLines = computed(() =>
    this.gridLines(
      this.minX(),
      this.maxX(),
      10,
      this.plot.left,
      this.plot.width,
      this.xAxisPipe(),
      this.xAxisPipeArgs(),
      this.xAxisInterval(),
    ),
  );
  protected readonly horizontalGridLines = computed(() =>
    this.gridLines(
      this.validAxisMaximum(this.minY(), this.maxY()),
      this.minY(),
      10,
      this.plot.top,
      this.plot.height,
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
      const x = this.plot.left + ((xValue - minX) / xRange) * this.plot.width;
      const slotWidth = Math.min((widthValue / xRange) * this.plot.width, this.plot.right - x);
      const horizontalMargin = Math.min(this.barHorizontalMargin, slotWidth / 2);
      const width = slotWidth - horizontalMargin * 2;
      const height = ((yValue - minY) / yRange) * this.plot.height;

      return { x: x + horizontalMargin, y: this.plot.bottom - height, width, height };
    });
  });

  protected barPath(bar: ChartBar): string {
    const radius = Math.min(this.barCornerRadius, bar.width / 2, bar.height);
    const right = bar.x + bar.width;

    return [
      `M ${bar.x} ${this.plot.bottom}`,
      `V ${bar.y + radius}`,
      `Q ${bar.x} ${bar.y} ${bar.x + radius} ${bar.y}`,
      `H ${right - radius}`,
      `Q ${right} ${bar.y} ${right} ${bar.y + radius}`,
      `V ${this.plot.bottom}`,
      'Z',
    ].join(' ');
  }

  private gridLines(
    startValue: number,
    endValue: number,
    count: number,
    startPosition: number,
    length: number,
    pipe: PipeTransform | null,
    pipeArgs: readonly unknown[],
    interval: number,
  ): GridLine[] {
    const range = endValue - startValue;
    const absoluteInterval = Math.abs(interval);
    const values = absoluteInterval
      ? this.intervalValues(startValue, endValue, absoluteInterval)
      : Array.from({ length: count }, (_, index) =>
          count === 1 ? startValue : startValue + range * (index / (count - 1)),
        );

    return values.map((value) => {
      const ratio = range === 0 ? 0 : (value - startValue) / range;
      return {
        label: this.formatLabel(value, pipe, pipeArgs),
        position: startPosition + length * ratio,
      };
    });
  }

  private intervalValues(start: number, end: number, interval: number): number[] {
    const lowerBound = Math.min(start, end);
    const upperBound = Math.max(start, end);
    const firstValue = (Math.floor(lowerBound / interval) + 1) * interval;
    const values: number[] = [];

    for (let value = firstValue; value < upperBound; value += interval) {
      values.push(value);
    }

    return start <= end ? values : values.reverse();
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
