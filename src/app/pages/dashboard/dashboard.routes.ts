import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./tasks/tasks.component').then(m => m.TasksComponent)
      }
    ]
  }
];