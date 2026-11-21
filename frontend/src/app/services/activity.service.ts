import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityLap } from '../models/activity-lap';
import { AggregatedActivityRecords } from '../models/activity-record';

@Service()
export class ActivityService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>('http://localhost:8080/api/v1/activity');
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`http://localhost:8080/api/v1/activity/${id}`);
  }

  getLaps(id: number): Observable<ActivityLap[]> {
    return this.http.get<ActivityLap[]>(`http://localhost:8080/api/v1/activity/${id}/laps`);
  }

  getRecords(
    id: number,
    axis: 'distance' | 'time',
    from: number,
    to: number,
    maxPoints: number,
  ): Observable<AggregatedActivityRecords> {
    return this.http.get<AggregatedActivityRecords>(
      `http://localhost:8080/api/v1/activity/${id}/records`,
      { params: { axis, from, to, maxPoints } },
    );
  }

  upload(file: File): Observable<Activity> {
    const body = new FormData();
    body.append('file', file);

    return this.http.post<Activity>('http://localhost:8080/api/v1/activity', body);
  }
}
