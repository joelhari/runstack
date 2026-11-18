import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'activities',
    loadComponent: () => import('./pages/activities/activities.page').then((m) => m.ActivitiesPage),
  },
  {
    path: 'activity/:id',
    loadComponent: () => import('./pages/activity/activity.page').then((m) => m.ActivityPage),
  },
  {
    path: '**',
    redirectTo: 'activities',
  }
];
