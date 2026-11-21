import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ActivityService } from '../../services/activity.service';
import { ActivityPage } from './activity.page';

describe('ActivityPage', () => {
  let component: ActivityPage;
  let fixture: ComponentFixture<ActivityPage>;
  let fragment$: BehaviorSubject<string | null>;
  let getRecords: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    fragment$ = new BehaviorSubject<string | null>('details');
    getRecords = vi.fn().mockReturnValue(
      of({
        axis: 'distance',
        from: 0,
        to: 5_000,
        bucketWidth: 10,
        sourceRecordCount: 1,
        points: [
          {
            x: 1_000,
            heartRate: { average: 150, minimum: 150, maximum: 150, count: 1 },
          },
        ],
      }),
    );
    await TestBed.configureTestingModule({
      imports: [ActivityPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragment$.asObservable(),
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
        {
          provide: ActivityService,
          useValue: {
            getById: () =>
              of({
                id: 1,
                name: 'Morning run',
                date: '2026-11-18',
                distance: 5,
                duration: 1_800_000,
                averagePace: 360_000,
              }),
            getLaps: () =>
              of([
                {
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
                },
              ]),
            getRecords,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows details as the first and selected analysis tab', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const tabs = host.querySelectorAll<HTMLElement>('[role="tab"]');
    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(Array.from(tabs, (tab) => tab.textContent?.trim())).toEqual([
      'Details',
      'Charts',
      'Laps',
    ]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].classList.contains('active')).toBe(true);
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
    expect(panel?.getAttribute('aria-labelledby')).toBe('details-tab');
    expect(panel?.querySelector('app-details')).not.toBeNull();
  });

  it('shows the charts component when the Charts tab is selected', async () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const tabs = host.querySelectorAll<HTMLElement>('[role="tab"]');

    tabs[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panel?.getAttribute('aria-labelledby')).toBe('charts-tab');
    expect(panel?.querySelector('app-charts')).not.toBeNull();
    expect(getRecords).toHaveBeenCalledWith(1, 'distance', 0, 5_000, 500);
    expect(getRecords).toHaveBeenCalledWith(1, 'time', 0, 1_800_000, 500);
  });

  it('shows the laps component when the Laps tab is selected', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const tabs = host.querySelectorAll<HTMLElement>('[role="tab"]');
    const router = TestBed.inject(Router);
    const navigations: unknown[] = [];
    router.navigate = async (_commands, extras) => {
      navigations.push(extras);
      return true;
    };

    tabs[2].click();
    fixture.detectChanges();

    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].classList.contains('active')).toBe(true);
    expect(panel?.getAttribute('aria-labelledby')).toBe('laps-tab');
    expect(panel?.querySelector('app-laps')).not.toBeNull();
    expect(navigations).toContainEqual(
      expect.objectContaining({ fragment: 'laps', queryParamsHandling: 'preserve' }),
    );
  });

  it('selects the analysis tab from the URL fragment', () => {
    fixture.detectChanges();

    fragment$.next('laps');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const tabs = host.querySelectorAll<HTMLElement>('[role="tab"]');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(host.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby')).toBe(
      'laps-tab',
    );
  });
});
