import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivityService } from '../../../services/activity.service';
import { ActivityRecordChart } from './activity-record-chart/activity-record-chart';
import { Charts } from './charts';

describe('Charts', () => {
  let component: Charts;
  let fixture: ComponentFixture<Charts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Charts],
      providers: [
        {
          provide: ActivityService,
          useValue: {
            getRecords: () =>
              of({
                axis: 'distance',
                from: 0,
                to: 1,
                bucketWidth: 1,
                sourceRecordCount: 0,
                points: [],
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Charts);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('activity', {
      id: 42,
      name: 'Morning run',
      date: '2026-11-21',
      distance: 10,
      duration: 3_600_000,
      averagePace: 360_000,
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('configures distance and time activity record charts', () => {
    const charts = fixture.debugElement
      .queryAll(By.directive(ActivityRecordChart))
      .map((element) => element.componentInstance as ActivityRecordChart);

    expect(charts).toHaveLength(2);
    expect(charts[0].activityId()).toBe(42);
    expect(charts[0].axis()).toBe('distance');
    expect(charts[0].to()).toBe(10_000);
    expect(charts[0].title()).toBe('Heart rate by distance');
    expect(charts[1].activityId()).toBe(42);
    expect(charts[1].axis()).toBe('time');
    expect(charts[1].to()).toBe(3_600_000);
    expect(charts[1].title()).toBe('Heart rate by time');
  });
});
