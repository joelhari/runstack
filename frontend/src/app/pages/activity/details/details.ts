import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Activity } from '../../../models/activity';
import { DurationPipe } from '../../../pipes/duration.pipe';

@Component({
  imports: [DecimalPipe, DurationPipe],
  selector: 'app-details',
  styleUrl: './details.scss',
  templateUrl: './details.html',
})
export class Details {
  readonly activity = input.required<Activity>();
}
