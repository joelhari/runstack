import { Component, input } from '@angular/core';
import { Activity } from '../../../models/activity';
import { ActivityRecordChart } from './activity-record-chart/activity-record-chart';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [ActivityRecordChart],
  selector: 'app-charts',
  styleUrl: './charts.scss',
  templateUrl: './charts.html',
})
export class Charts {
  readonly activity = input.required<Activity>();

  protected readonly decimalPipe = new DecimalPipe('en-US');
}
