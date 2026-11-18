import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';

@Component({
  imports: [AsyncPipe, DatePipe, DecimalPipe, RouterLink],
  selector: 'app-activities',
  styleUrl: './activities.page.scss',
  templateUrl: './activities.page.html',
})
export class ActivitiesPage {
  private readonly activityService = inject(ActivityService);

  readonly activities$ = this.activityService.getAll();
}
