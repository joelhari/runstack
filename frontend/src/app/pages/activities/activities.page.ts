import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { finalize, forkJoin, startWith, Subject, switchMap } from 'rxjs';
import { ActivityService } from '../../services/activity.service';

@Component({
  imports: [AsyncPipe, DatePipe, DecimalPipe, DurationPipe, RouterLink],
  selector: 'app-activities',
  styleUrl: './activities.page.scss',
  templateUrl: './activities.page.html',
})
export class ActivitiesPage {
  private readonly activityService = inject(ActivityService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshActivities$ = new Subject<void>();

  readonly activities$ = this.refreshActivities$.pipe(
    startWith(undefined),
    switchMap(() => this.activityService.getAll()),
  );
  readonly isUploadModalOpen = signal(false);
  readonly selectedFiles = signal<File[]>([]);
  readonly isUploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  openUploadModal(): void {
    this.selectedFiles.set([]);
    this.uploadError.set(null);
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    if (!this.isUploading()) {
      this.isUploadModalOpen.set(false);
    }
  }

  selectFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const hasInvalidFile = files.some((file) => !file.name.toLowerCase().endsWith('.fit'));

    this.selectedFiles.set(files);
    this.uploadError.set(hasInvalidFile ? 'Please select only .fit files.' : null);
  }

  uploadActivities(): void {
    const files = this.selectedFiles();
    if (!files.length || files.some((file) => !file.name.toLowerCase().endsWith('.fit'))) {
      this.uploadError.set('Please select one or more .fit files.');
      return;
    }

    this.isUploading.set(true);
    this.uploadError.set(null);
    forkJoin(files.map((file) => this.activityService.upload(file)))
      .pipe(
        finalize(() => this.isUploading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isUploadModalOpen.set(false);
          this.refreshActivities$.next();
        },
        error: () =>
          this.uploadError.set('The activities could not all be uploaded. Please try again.'),
      });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeUploadModal();
  }
}
