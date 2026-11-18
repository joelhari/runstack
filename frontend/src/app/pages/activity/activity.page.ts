import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs';
import { BarChart } from '../../components/bar-chart/bar-chart';
import { ActivityLap } from '../../models/activity-lap';
import { DurationPipe } from '../../pipes/duration.pipe';
import { KilometersPipe } from '../../pipes/kilometers.pipe';
import { ActivityService } from '../../services/activity.service';

interface LapChartRecord {
  distance: number;
  lapDistance: number;
  pace: number;
}

@Component({
  imports: [AsyncPipe, BarChart, DatePipe, DecimalPipe, DurationPipe, KilometersPipe, RouterLink],
  selector: 'app-activity',
  styleUrl: './activity.page.scss',
  templateUrl: './activity.page.html',
})
export class ActivityPage {
  private readonly route = inject(ActivatedRoute);
  private readonly activityService = inject(ActivityService);

  protected readonly durationPipe = new DurationPipe();
  protected readonly kilometersPipe = new KilometersPipe();

  private readonly activityId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly activity$ = this.activityId$.pipe(switchMap((id) => this.activityService.getById(id)));

  readonly laps$ = this.activityId$.pipe(switchMap((id) => this.activityService.getLaps(id)));

  protected lapChartRecords(laps: readonly ActivityLap[]): LapChartRecord[] {
    let distance = 0;
    return laps.map((lap) => {
      const lapDistance = lap.distance ?? 0;
      const record = {
        distance,
        lapDistance,
        pace: lap.averagePace ?? 0,
      };
      distance += lapDistance;
      return record;
    });
  }

  protected lapChartMaxDistance(laps: readonly ActivityLap[]): number {
    return laps.reduce((total, lap) => total + (lap.distance ?? 0), 0);
  }

  protected lapChartMinPace(laps: readonly ActivityLap[]): number {
    const paces = this.lapPaces(laps);
    if (!paces.length) {
      return 10_000;
    }

    return Math.max(...paces) + 60_000;
  }

  protected lapChartMaxPace(laps: readonly ActivityLap[]): number {
    const paces = this.lapPaces(laps);
    if (!paces.length) {
      return 0;
    }

    return Math.max(0, Math.min(...paces) - 10_000);
  }

  private lapPaces(laps: readonly ActivityLap[]): number[] {
    return laps.flatMap((lap) => (lap.averagePace === null ? [] : [lap.averagePace]));
  }
}
