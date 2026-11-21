import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LineChart } from '../../../../components/line-chart/line-chart';
import { ActivityService } from '../../../../services/activity.service';
import { ActivityRecordChart } from './activity-record-chart';

describe('ActivityRecordChart', () => {
  let fixture: ComponentFixture<ActivityRecordChart>;
  let getRecords: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getRecords = vi.fn().mockReturnValue(
      of({
        axis: 'time',
        from: 0,
        to: 3_600_000,
        bucketWidth: 7_200,
        sourceRecordCount: 20,
        points: [
          {
            x: 1_000,
            heartRate: { average: 140, minimum: 130, maximum: 150, count: 10 },
          },
          {
            x: 2_000,
            heartRate: { average: null, minimum: null, maximum: null, count: 0 },
          },
        ],
      }),
    );
    await TestBed.configureTestingModule({
      imports: [ActivityRecordChart],
      providers: [{ provide: ActivityService, useValue: { getRecords } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityRecordChart);
    fixture.componentRef.setInput('activityId', 42);
    fixture.componentRef.setInput('axis', 'time');
    fixture.componentRef.setInput('to', 3_600_000);
    fixture.componentRef.setInput('title', 'Heart rate by time');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads its range and configures the line chart', () => {
    expect(getRecords).toHaveBeenCalledWith(42, 'time', 0, 3_600_000, 500);

    const chart = fixture.debugElement.query(By.directive(LineChart))
      .componentInstance as LineChart;
    expect(chart.records()).toEqual([{ x: 1_000, heartRate: 140 }]);
    expect(chart.xField()).toBe('x');
    expect(chart.yField()).toBe('heartRate');
    expect(chart.minX()).toBe(0);
    expect(chart.maxX()).toBe(3_600_000);
    expect(chart.maxY()).toBe(150);
  });
});
