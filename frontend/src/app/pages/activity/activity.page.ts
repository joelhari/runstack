import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
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

  readonly activity$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.activityService.getById(id)),
  );
}
