import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LineChart } from '../../../../components/line-chart/line-chart';
import { ActivityService } from '../../../../services/activity.service';
import { ActivityRecordChart } from './activity-record-chart';

describe('ActivityRecordChart', () => {
  let fixture: ComponentFixture<ActivityRecordChart>;
  let getRecords: ReturnType<typeof vi.fn>;
  let yAxisPipe: PipeTransform;
  let yAxisPipe2: PipeTransform;

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
            power: { average: 250, minimum: 240, maximum: 260, count: 10 },
          },
          {
            x: 2_000,
            heartRate: { average: null, minimum: null, maximum: null, count: 0 },
            power: { average: 270, minimum: 260, maximum: 280, count: 10 },
          },
        ],
      }),
    );
    yAxisPipe = { transform: (value: number) => `${value} bpm` };
    yAxisPipe2 = { transform: (value: number) => `${value} W` };
    await TestBed.configureTestingModule({
      imports: [ActivityRecordChart],
      providers: [{ provide: ActivityService, useValue: { getRecords } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityRecordChart);
    fixture.componentRef.setInput('activityId', 42);
    fixture.componentRef.setInput('axis', 'time');
    fixture.componentRef.setInput('color', 'danger');
    fixture.componentRef.setInput('to', 3_600_000);
    fixture.componentRef.setInput('title', 'Heart rate by time');
    fixture.componentRef.setInput('yField', 'heartRate');
    fixture.componentRef.setInput('yField2', 'power');
    fixture.componentRef.setInput('color2', 'primary');
    fixture.componentRef.setInput('yAxisPipe', yAxisPipe);
    fixture.componentRef.setInput('yAxisPipeArgs', ['primary-argument']);
    fixture.componentRef.setInput('yAxisPipe2', yAxisPipe2);
    fixture.componentRef.setInput('yAxisPipeArgs2', ['secondary-argument']);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads its range and configures the line chart', () => {
    expect(getRecords).toHaveBeenCalledWith(42, 'time', 0, 3_600_000, 500);

    const chart = fixture.debugElement.query(By.directive(LineChart))
      .componentInstance as LineChart;
    expect(chart.records()).toEqual([{ x: 1_000, value: 140, value2: 250 }]);
    expect(chart.color()).toBe('danger');
    expect(chart.xField()).toBe('x');
    expect(chart.yField()).toBe('value');
    expect(chart.yField2()).toBe('value2');
    expect(chart.color2()).toBe('primary');
    expect(chart.minX()).toBe(0);
    expect(chart.maxX()).toBe(3_600_000);
    expect(chart.maxY()).toBe(160);
    expect(chart.maxY2()).toBe(290);
    expect(chart.yAxisPipe()).toBe(yAxisPipe);
    expect(chart.yAxisPipeArgs()).toEqual(['primary-argument']);
    expect(chart.yAxisPipe2()).toBe(yAxisPipe2);
    expect(chart.yAxisPipeArgs2()).toEqual(['secondary-argument']);
  });
});
