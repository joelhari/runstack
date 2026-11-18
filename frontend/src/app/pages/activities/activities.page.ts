import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { finalize, startWith, Subject, switchMap } from 'rxjs';
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
  readonly selectedFile = signal<File | null>(null);
  readonly isUploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  openUploadModal(): void {
    this.selectedFile.set(null);
    this.uploadError.set(null);
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    if (!this.isUploading()) {
      this.isUploadModalOpen.set(false);
    }
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;

    this.selectedFile.set(file);
    this.uploadError.set(
      file && !file.name.toLowerCase().endsWith('.fit') ? 'Please select a .fit file.' : null,
    );
  }

  uploadActivity(): void {
    const file = this.selectedFile();
    if (!file || !file.name.toLowerCase().endsWith('.fit')) {
      this.uploadError.set('Please select a .fit file.');
      return;
    }

    this.isUploading.set(true);
    this.uploadError.set(null);
    this.activityService
      .upload(file)
      .pipe(
        finalize(() => this.isUploading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isUploadModalOpen.set(false);
          this.refreshActivities$.next();
        },
        error: () => this.uploadError.set('The activity could not be uploaded. Please try again.'),
      });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeUploadModal();
  }
}
