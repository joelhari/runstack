import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { LineChart } from './line-chart';

@Pipe({ name: 'testLineChartPipe' })
class TestLineChartPipe implements PipeTransform {
  transform(value: number, prefix: string): string {
    return `${prefix}${value}`;
  }
}

describe('LineChart', () => {
  let component: LineChart;
  let fixture: ComponentFixture<LineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChart],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw a line through the configured record values', () => {
    fixture.componentRef.setInput('records', [
      { distance: 0, elevation: 10 },
      { distance: 50, elevation: 15 },
      { distance: 100, elevation: 20 },
    ]);
    fixture.componentRef.setInput('xField', 'distance');
    fixture.componentRef.setInput('yField', 'elevation');
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 100);
    fixture.componentRef.setInput('minY', 10);
    fixture.componentRef.setInput('maxY', 20);
    fixture.detectChanges();

    const polyline = fixture.nativeElement.querySelector('polyline');
    expect(polyline.getAttribute('points')).toBe('0,100 50,50 100,0');
  });

  it('uses the selected Bootstrap color for the line', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('text-danger')).toBe(true);
  });

  it('draws an optional second line with an independent right y axis', () => {
    const pipe = new TestLineChartPipe();
    fixture.componentRef.setInput('records', [
      { x: 0, heartRate: 120, altitude: 400 },
      { x: 100, heartRate: 180, altitude: 600 },
    ]);
    fixture.componentRef.setInput('xField', 'x');
    fixture.componentRef.setInput('yField', 'heartRate');
    fixture.componentRef.setInput('minY', 100);
    fixture.componentRef.setInput('maxY', 200);
    fixture.componentRef.setInput('yField2', 'altitude');
    fixture.componentRef.setInput('color2', 'success');
    fixture.componentRef.setInput('minY2', 400);
    fixture.componentRef.setInput('maxY2', 600);
    fixture.componentRef.setInput('yAxisInterval2', 100);
    fixture.componentRef.setInput('yAxisPipe2', pipe);
    fixture.componentRef.setInput('yAxisPipeArgs2', ['m:']);
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('svg');
    expect(lines).toHaveLength(2);
    expect(lines[1].classList.contains('text-success')).toBe(true);
    expect(lines[1].querySelector('polyline').getAttribute('points')).toBe('0,100 100,0');

    const rightLabels = Array.from(
      fixture.nativeElement.querySelectorAll('.line-chart-right .line-chart-label'),
      (label) => (label as HTMLElement).textContent?.trim(),
    );
    expect(rightLabels).toEqual(['m:500']);

    const plot = lines[0].parentElement as HTMLElement;
    vi.spyOn(plot, 'getBoundingClientRect').mockReturnValue({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    plot.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50 }));
    fixture.detectChanges();

    const secondCrosshair = plot.querySelector('.border-success-subtle') as HTMLElement;
    expect(secondCrosshair.classList.contains('invisible')).toBe(false);
    expect(secondCrosshair.style.top).toBe('50%');
    const updatedRightLabels = fixture.nativeElement.querySelectorAll(
      '.line-chart-right .line-chart-label',
    );
    expect(updatedRightLabels[updatedRightLabels.length - 1].textContent.trim()).toBe('m:500');
    expect(
      updatedRightLabels[updatedRightLabels.length - 1].classList.contains('text-success'),
    ).toBe(true);
  });

  it('does not render a right y axis without a second y field', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('svg')).toHaveLength(1);
    expect(
      fixture.nativeElement.querySelectorAll('.line-chart-right .line-chart-label'),
    ).toHaveLength(0);
  });

  it('should clamp line points to the chart bounds', () => {
    fixture.componentRef.setInput('records', [
      { x: -10, y: 150 },
      { x: 110, y: -50 },
    ]);
    fixture.componentRef.setInput('xField', 'x');
    fixture.componentRef.setInput('yField', 'y');
    fixture.detectChanges();

    const polyline = fixture.nativeElement.querySelector('polyline');
    expect(polyline.getAttribute('points')).toBe('0,0 100,100');
  });

  it('should retain axis interval, pipe, and pipe argument inputs', () => {
    const pipe = new TestLineChartPipe();
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 30);
    fixture.componentRef.setInput('xAxisInterval', 10);
    fixture.componentRef.setInput('xAxisPipe', pipe);
    fixture.componentRef.setInput('xAxisPipeArgs', ['x:']);
    fixture.detectChanges();

    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.line-chart-bottom .line-chart-label'),
      (label) => (label as HTMLElement).textContent?.trim(),
    );
    expect(labels).toEqual(['x:10', 'x:20']);
  });

  it('should show an interpolated crosshair at the mouse x position', () => {
    fixture.componentRef.setInput('color', 'success');
    fixture.componentRef.setInput('records', [
      { x: 0, y: 10 },
      { x: 100, y: 20 },
    ]);
    fixture.componentRef.setInput('xField', 'x');
    fixture.componentRef.setInput('yField', 'y');
    fixture.componentRef.setInput('minX', 0);
    fixture.componentRef.setInput('maxX', 100);
    fixture.componentRef.setInput('minY', 10);
    fixture.componentRef.setInput('maxY', 20);
    fixture.detectChanges();

    const plot = fixture.nativeElement.querySelector('svg').parentElement as HTMLElement;
    vi.spyOn(plot, 'getBoundingClientRect').mockReturnValue({
      bottom: 100,
      height: 100,
      left: 10,
      right: 210,
      top: 0,
      width: 200,
      x: 10,
      y: 0,
      toJSON: () => ({}),
    });
    plot.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 60 }));
    fixture.detectChanges();

    const horizontal = plot.querySelector('.border-success-subtle') as HTMLElement;
    const vertical = Array.from(plot.children).find(
      (element) => element.classList.contains('border-end') && element.classList.contains('z-1'),
    ) as HTMLElement;
    expect(horizontal.classList.contains('invisible')).toBe(false);
    expect(vertical.classList.contains('invisible')).toBe(false);
    expect(horizontal.style.top).toBe('75%');
    expect(vertical.style.left).toBe('25%');
    expect(horizontal.classList.contains('border-success-subtle')).toBe(true);
    const leftLabels = fixture.nativeElement.querySelectorAll('.line-chart-left .line-chart-label');
    const bottomLabels = fixture.nativeElement.querySelectorAll(
      '.line-chart-bottom .line-chart-label',
    );
    expect(leftLabels[leftLabels.length - 1].textContent.trim()).toBe('12.5');
    expect(leftLabels[leftLabels.length - 1].classList.contains('text-success')).toBe(true);
    expect(bottomLabels[bottomLabels.length - 1].textContent.trim()).toBe('25');

    plot.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(horizontal.classList.contains('invisible')).toBe(true);
    expect(vertical.classList.contains('invisible')).toBe(true);
    expect(fixture.nativeElement.textContent).not.toContain('12.5');
  });

  it('should not expose bar-only inputs and outputs', () => {
    expect('barWidthField' in component).toBe(false);
    expect('highlightedBarIndex' in component).toBe(false);
    expect('barHover' in component).toBe(false);
    expect('barHoverEnd' in component).toBe(false);
  });
});
