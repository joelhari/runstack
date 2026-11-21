import { Component, input } from '@angular/core';
import { Activity } from '../../../models/activity';
import { ActivityRecordChart } from './activity-record-chart/activity-record-chart';

@Component({
  imports: [ActivityRecordChart],
  selector: 'app-charts',
  styleUrl: './charts.scss',
  templateUrl: './charts.html',
})
export class Charts {
  readonly activity = input.required<Activity>();
}
