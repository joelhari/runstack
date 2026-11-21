import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, of, shareReplay, switchMap } from 'rxjs';
import { LineChart } from '../../../../components/line-chart/line-chart';
import { AggregatedActivityRecords } from '../../../../models/activity-record';
import { DurationPipe } from '../../../../pipes/duration.pipe';
import { KilometersPipe } from '../../../../pipes/kilometers.pipe';
import { ActivityService } from '../../../../services/activity.service';

type RecordAxis = 'distance' | 'time';

interface HeartRateChartRecord {
  x: number;
  heartRate: number;
}

@Component({
  imports: [AsyncPipe, LineChart],
  selector: 'app-activity-record-chart',
  styleUrl: './activity-record-chart.scss',
  templateUrl: './activity-record-chart.html',
})
export class ActivityRecordChart {
  private readonly activityService = inject(ActivityService);

  readonly activityId = input.required<number>();
  readonly axis = input.required<RecordAxis>();
  readonly from = input(0);
  readonly to = input.required<number>();
  readonly maxPoints = input(500);
  readonly title = input.required<string>();

  protected readonly durationPipe = new DurationPipe();
  protected readonly kilometersPipe = new KilometersPipe();

  protected readonly records$ = combineLatest([
    toObservable(this.activityId),
    toObservable(this.axis),
    toObservable(this.from),
    toObservable(this.to),
    toObservable(this.maxPoints),
  ]).pipe(
    switchMap(([activityId, axis, from, to, maxPoints]) => {
      if (to <= from) {
        return of<AggregatedActivityRecords>({
          axis,
          from,
          to,
          bucketWidth: 0,
          sourceRecordCount: 0,
          points: [],
        });
      }
      return this.activityService.getRecords(activityId, axis, from, to, maxPoints);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected chartRecords(records: AggregatedActivityRecords): HeartRateChartRecord[] {
    return records.points.flatMap((record) =>
      record.heartRate.average === null
        ? []
        : [{ x: record.x, heartRate: record.heartRate.average }],
    );
  }

  protected chartMaxHeartRate(records: AggregatedActivityRecords): number {
    return Math.max(0, ...records.points.map((record) => record.heartRate.maximum ?? 0));
  }

  protected xAxisPipe(): DurationPipe | KilometersPipe {
    return this.axis() === 'distance' ? this.kilometersPipe : this.durationPipe;
  }

  protected xAxisPipeArgs(): readonly unknown[] {
    return this.axis() === 'distance' ? [1] : [true];
  }
}
