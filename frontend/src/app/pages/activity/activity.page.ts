import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs';
import { ActivityService } from '../../services/activity.service';
import { Charts } from './charts/charts';
import { Details } from './details/details';
import { Laps } from './laps/laps';

type AnalysisTab = 'details' | 'charts' | 'laps';

@Component({
  imports: [AsyncPipe, Charts, DatePipe, Details, Laps, RouterLink],
  selector: 'app-activity',
  styleUrl: './activity.page.scss',
  templateUrl: './activity.page.html',
})
export class ActivityPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly activityService = inject(ActivityService);

  protected readonly selectedAnalysisTab = signal<AnalysisTab>('details');

  private readonly activityId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly activity$ = this.activityId$.pipe(
    switchMap((id) => this.activityService.getById(id)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  readonly laps$ = this.activityId$.pipe(switchMap((id) => this.activityService.getLaps(id)));

  constructor() {
    this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment === 'details' || fragment === 'charts' || fragment === 'laps') {
        this.selectedAnalysisTab.set(fragment);
      } else {
        this.selectAnalysisTab('details', true);
      }
    });
  }

  protected selectAnalysisTab(tab: AnalysisTab, replaceUrl = false): void {
    this.selectedAnalysisTab.set(tab);
    void this.router.navigate([], {
      fragment: tab,
      queryParamsHandling: 'preserve',
      relativeTo: this.route,
      replaceUrl,
    });
  }
}
