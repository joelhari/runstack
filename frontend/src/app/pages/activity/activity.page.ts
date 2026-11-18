import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs';
import { ActivityService } from '../../services/activity.service';

@Component({
  imports: [AsyncPipe, DatePipe, DecimalPipe, RouterLink],
  selector: 'app-activity',
  styleUrl: './activity.page.scss',
  templateUrl: './activity.page.html',
})
export class ActivityPage {
  private readonly route = inject(ActivatedRoute);
  private readonly activityService = inject(ActivityService);

  private readonly activityId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly activity$ = this.activityId$.pipe(
    switchMap((id) => this.activityService.getById(id)),
  );

  readonly laps$ = this.activityId$.pipe(
    switchMap((id) => this.activityService.getLaps(id)),
  );
}
