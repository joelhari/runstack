import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChart } from './bar-chart';

describe('BarChart', () => {
  let component: BarChart;
  let fixture: ComponentFixture<BarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BarChart] }).compileComponents();
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

    expect(host.querySelectorAll('.bar-chart__x-label')).toHaveLength(10);
    expect(host.querySelectorAll('.bar-chart__y-label')).toHaveLength(10);
  });

  it('formats axis labels with the supplied pipes', () => {
    fixture.componentRef.setInput('xAxisPipe', {
      transform: (value: number, digits: number) => `${value.toFixed(digits)} km`,
    });
    fixture.componentRef.setInput('xAxisPipeArgs', [2]);
    fixture.componentRef.setInput('yAxisPipe', { transform: (value: number) => `${value} ms` });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.bar-chart__x-label')?.textContent).toBe('0.00 km');
    expect(host.querySelector('.bar-chart__y-label')?.textContent).toBe('100 ms');
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
    expect(host.querySelectorAll('.bar-chart__x-label')).toHaveLength(2);
    expect(host.querySelectorAll('.bar-chart__y-label')).toHaveLength(2);
    expect(host.querySelectorAll('.bar-chart__grid-line')).toHaveLength(4);
  });

  it('positions and sizes vertical bars using record fields and axis ranges', () => {
    fixture.componentRef.setInput('records', [{ distance: 25, pace: 50, lapDistance: 20 }]);
    fixture.componentRef.setInput('xField', 'distance');
    fixture.componentRef.setInput('yField', 'pace');
    fixture.componentRef.setInput('barWidthField', 'lapDistance');
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 100);
    fixture.componentRef.setInput('minY', 0);
    fixture.componentRef.setInput('maxY', 100);
    fixture.detectChanges();

    const bar = (fixture.nativeElement as HTMLElement).querySelector('.bar-chart__bar');
    expect(bar?.getAttribute('x')).toBe('249.5');
    expect(bar?.getAttribute('width')).toBe('138');
    expect(bar?.getAttribute('height')).toBe('160');
    expect(bar?.getAttribute('y')).toBe('190');
    expect(bar?.getAttribute('d')).toContain('Q 249.5 190 254.5 190');
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
    const labels = Array.from(host.querySelectorAll('.bar-chart__y-label')).map(
      (label) => label.textContent,
    );
    const bar = host.querySelector('.bar-chart__bar');

    expect(labels[0]).toBe('100');
    expect(labels.at(-1)).toBe('0');
    expect(bar?.getAttribute('height')).toBe('80');
    expect(bar?.getAttribute('y')).toBe('270');
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
    const labels = Array.from(host.querySelectorAll('.bar-chart__y-label')).map(
      (label) => label.textContent,
    );
    const bar = host.querySelector('.bar-chart__bar');

    expect(labels[0]).toBe('0');
    expect(labels.at(-1)).toBe('100');
    expect(bar?.getAttribute('height')).toBe('240');
    expect(bar?.getAttribute('y')).toBe('110');
  });
});
