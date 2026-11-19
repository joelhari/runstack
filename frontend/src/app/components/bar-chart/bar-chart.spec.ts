import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChart } from './bar-chart';

describe('BarChart', () => {
  let component: BarChart;
  let fixture: ComponentFixture<BarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChart],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders grid lines with labels', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(yLabels(host)).toHaveLength(6);
    expect(xLabels(host)).toHaveLength(6);
    expect(horizontalGridLines(host)).toHaveLength(6);
    expect(verticalGridLines(host)).toHaveLength(6);
  });

  it('covers a narrow y range with nice automatic grid intervals', () => {
    fixture.componentRef.setInput('minY', 295_000);
    fixture.componentRef.setInput('maxY', 325_000);
    fixture.componentRef.setInput('yAxisInterval', 0);
    fixture.detectChanges();

    expect(labelText(yLabels(fixture.nativeElement as HTMLElement))).toEqual([
      '325000',
      '320000',
      '315000',
      '310000',
      '305000',
      '300000',
      '295000',
    ]);
  });

  it('formats axis labels with the supplied pipes', () => {
    fixture.componentRef.setInput('xAxisPipe', {
      transform: (value: number, digits: number) => `${value.toFixed(digits)} km`,
    });
    fixture.componentRef.setInput('xAxisPipeArgs', [2]);
    fixture.componentRef.setInput('yAxisPipe', {
      transform: (value: number) => `${value} ms`,
    });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(xLabels(host)[0].textContent?.trim()).toBe('0.00 km');
    expect(yLabels(host)[0].textContent?.trim()).toBe('100 ms');
  });

  it('uses the supplied intervals for labels and grid lines', () => {
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 15_000);
    fixture.componentRef.setInput('xAxisInterval', 5_000);
    fixture.componentRef.setInput('minY', 300_000);
    fixture.componentRef.setInput('maxY', 330_000);
    fixture.componentRef.setInput('yAxisInterval', 10_000);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(labelText(xLabels(host))).toEqual(['5000', '10000']);
    expect(labelText(yLabels(host))).toEqual(['320000', '310000']);
    expect(horizontalGridLines(host)).toHaveLength(2);
    expect(verticalGridLines(host)).toHaveLength(2);
  });

  it('positions and sizes bars as percentages of the axis ranges', () => {
    fixture.componentRef.setInput('records', [{ distance: 25, pace: 50, lapDistance: 20 }]);
    fixture.componentRef.setInput('xField', 'distance');
    fixture.componentRef.setInput('yField', 'pace');
    fixture.componentRef.setInput('barWidthField', 'lapDistance');
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 100);
    fixture.componentRef.setInput('minY', 0);
    fixture.componentRef.setInput('maxY', 100);
    fixture.detectChanges();

    const bar = barContainers(fixture.nativeElement as HTMLElement)[0];
    expect(bar.style.left).toBe('25%');
    expect(bar.style.width).toBe('20%');
    expect(bar.style.height).toBe('50%');
    expect(bar.title).toBe('50');
  });

  it('places minY at the bottom and maxY at the top', () => {
    fixture.componentRef.setInput('records', [{ x: 0, y: 25, width: 10 }]);
    fixture.componentRef.setInput('xField', 'x');
    fixture.componentRef.setInput('yField', 'y');
    fixture.componentRef.setInput('barWidthField', 'width');
    fixture.componentRef.setInput('minY', 0);
    fixture.componentRef.setInput('maxY', 100);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const labels = yLabels(host);
    const bar = barContainers(host)[0];

    expect(labels[0].textContent?.trim()).toBe('100');
    expect(labels[0].style.top).toBe('0%');
    expect(labels.at(-1)?.textContent?.trim()).toBe('0');
    expect(labels.at(-1)?.style.top).toBe('100%');
    expect(bar.style.height).toBe('25%');
  });

  it('preserves the minY and maxY positions for a descending range', () => {
    fixture.componentRef.setInput('records', [{ x: 0, y: 25, width: 10 }]);
    fixture.componentRef.setInput('xField', 'x');
    fixture.componentRef.setInput('yField', 'y');
    fixture.componentRef.setInput('barWidthField', 'width');
    fixture.componentRef.setInput('minY', 100);
    fixture.componentRef.setInput('maxY', 0);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const labels = yLabels(host);
    const bar = barContainers(host)[0];

    expect(labels[0].textContent?.trim()).toBe('0');
    expect(labels[0].style.top).toBe('0%');
    expect(labels.at(-1)?.textContent?.trim()).toBe('100');
    expect(labels.at(-1)?.style.top).toBe('100%');
    expect(bar.style.height).toBe('75%');
  });
});

function xLabels(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>('.bar-chart-bottom .bar-chart-label'));
}

function yLabels(host: HTMLElement): HTMLElement[] {
  return Array.from(
    host.querySelectorAll<HTMLElement>('.bar-chart-left.position-relative .bar-chart-label'),
  );
}

function horizontalGridLines(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>('.border-bottom.position-absolute'));
}

function verticalGridLines(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>('.border-end.position-absolute'));
}

function barContainers(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>('.bar-chart-bar')).map(
    (bar) => bar.parentElement as HTMLElement,
  );
}

function labelText(labels: readonly HTMLElement[]): string[] {
  return labels.map((label) => label.textContent?.trim() ?? '');
}
