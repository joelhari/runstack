import { AsyncPipe } from '@angular/common';
import { Component, inject, input, PipeTransform } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, of, shareReplay, switchMap } from 'rxjs';
import { LineChart } from '../../../../components/line-chart/line-chart';
import {
  AggregatedActivityRecords,
  AggregatedActivityRecordValueField,
} from '../../../../models/activity-record';
import { DurationPipe } from '../../../../pipes/duration.pipe';
import { KilometersPipe } from '../../../../pipes/kilometers.pipe';
import { ActivityService } from '../../../../services/activity.service';

type RecordAxis = 'distance' | 'time';

interface ChartRecord {
  x: number;
  value: number;
  value2?: number;
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
  readonly color = input('primary');
  readonly color2 = input('secondary');
  readonly from = input(0);
  readonly to = input.required<number>();
  readonly maxPoints = input(500);
  readonly title = input.required<string>();
  readonly yField = input.required<AggregatedActivityRecordValueField>();
  readonly yField2 = input<AggregatedActivityRecordValueField | ''>('');
  readonly yAxisPipe = input<PipeTransform | null>(null);
  readonly yAxisPipeArgs = input<readonly unknown[]>([]);
  readonly yAxisPipe2 = input<PipeTransform | null>(null);
  readonly yAxisPipeArgs2 = input<readonly unknown[] | null>(null);

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

  protected chartRecords(records: AggregatedActivityRecords): ChartRecord[] {
    const field = this.yField();
    const field2 = this.yField2();
    return records.points.flatMap((record) => {
      const value = record[field].average;
      if (value === null) return [];
      const value2 = field2 ? record[field2].average : null;
      return [{ x: record.x, value, ...(value2 === null ? {} : { value2 }) }];
    });
  }

  protected chartMaxValue(
    records: AggregatedActivityRecords,
    field: AggregatedActivityRecordValueField | '',
  ): number {
    if (!field) return 0;
    return Math.max(0, ...records.points.map((record) => record[field].maximum ?? 0));
  }

  protected xAxisPipe(): DurationPipe | KilometersPipe {
    return this.axis() === 'distance' ? this.kilometersPipe : this.durationPipe;
  }

  protected xAxisPipeArgs(): readonly unknown[] {
    return this.axis() === 'distance' ? [1] : [true];
  }
}
