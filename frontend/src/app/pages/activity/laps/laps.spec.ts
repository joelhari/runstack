import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityLap } from '../../../models/activity-lap';
import { Laps } from './laps';

describe('Laps', () => {
  let component: Laps;
  let fixture: ComponentFixture<Laps>;

  const lap: ActivityLap = {
    id: 10,
    lapIndex: 0,
    startedAt: null,
    endedAt: null,
    elapsedDuration: 360_000,
    timerDuration: 360_000,
    distance: 1_000,
    averagePace: 360_000,
    averageSpeed: null,
    maximumSpeed: null,
    averageHeartRate: 150,
    maximumHeartRate: null,
    averageCadence: 170,
    maximumCadence: null,
    averagePower: 250,
    maximumPower: null,
    calories: null,
    ascent: 10,
    descent: 5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Laps] }).compileComponents();
    fixture = TestBed.createComponent(Laps);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('laps', [lap]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('highlights the matching lap row while its chart bar is hovered', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const bar = host.querySelector<HTMLElement>('.bar-chart-bar-wrapper');
    const row = host.querySelector<HTMLElement>('tbody tr');

    bar?.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(row?.classList.contains('table-active')).toBe(true);

    bar?.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(row?.classList.contains('table-active')).toBe(false);
  });

  it('scrolls the highlighted lap row below the sticky table header', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const bar = host.querySelector<HTMLElement>('.bar-chart-bar-wrapper');
    const row = host.querySelector<HTMLElement>('tbody tr');
    const tableContainer = host.querySelector<HTMLElement>('.lap-table');
    const header = host.querySelector<HTMLElement>('.lap-table thead');
    if (tableContainer) {
      tableContainer.getBoundingClientRect = () => rect({ bottom: 300, top: 100 });
      tableContainer.scrollTop = 200;
    }
    if (header) header.getBoundingClientRect = () => rect({ bottom: 140, top: 100 });
    if (row) row.getBoundingClientRect = () => rect({ bottom: 120, top: 100 });

    bar?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(tableContainer?.scrollTop).toBe(160);
  });

  it('does not scroll when the highlighted lap row is already visible', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const bar = host.querySelector<HTMLElement>('.bar-chart-bar-wrapper');
    const row = host.querySelector<HTMLElement>('tbody tr');
    const tableContainer = host.querySelector<HTMLElement>('.lap-table');
    const header = host.querySelector<HTMLElement>('.lap-table thead');
    if (tableContainer) {
      tableContainer.getBoundingClientRect = () => rect({ bottom: 300, top: 100 });
      tableContainer.scrollTop = 200;
    }
    if (header) header.getBoundingClientRect = () => rect({ bottom: 140, top: 100 });
    if (row) row.getBoundingClientRect = () => rect({ bottom: 200, top: 160 });

    bar?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(tableContainer?.scrollTop).toBe(200);
  });

  it('scrolls down only enough to reveal the highlighted lap row', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const bar = host.querySelector<HTMLElement>('.bar-chart-bar-wrapper');
    const row = host.querySelector<HTMLElement>('tbody tr');
    const tableContainer = host.querySelector<HTMLElement>('.lap-table');
    const header = host.querySelector<HTMLElement>('.lap-table thead');
    if (tableContainer) {
      tableContainer.getBoundingClientRect = () => rect({ bottom: 300, top: 100 });
      tableContainer.scrollTop = 200;
    }
    if (header) header.getBoundingClientRect = () => rect({ bottom: 140, top: 100 });
    if (row) row.getBoundingClientRect = () => rect({ bottom: 340, top: 310 });

    bar?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(tableContainer?.scrollTop).toBe(240);
  });

  it('highlights the matching chart bar while a lap row is hovered', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const bar = host.querySelector<HTMLElement>('.bar-chart-bar-wrapper');
    const row = host.querySelector<HTMLElement>('tbody tr');

    row?.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(bar?.classList.contains('bar-chart-bar-wrapper--highlighted')).toBe(true);

    row?.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(bar?.classList.contains('bar-chart-bar-wrapper--highlighted')).toBe(false);
  });
});

function rect({ bottom, top }: { bottom: number; top: number }): DOMRect {
  return {
    bottom,
    height: bottom - top,
    left: 0,
    right: 100,
    top,
    width: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  };
}
