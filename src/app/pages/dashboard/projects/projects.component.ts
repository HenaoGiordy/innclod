import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ProjectsService } from '../../../shared/services/project.service';
import { Project } from '../../../shared/interfaces/models.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    SelectModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  @ViewChild('dt') dt: Table | undefined;

  private readonly projectsSvc = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly msg = inject(MessageService);

  projects: Project[] = [];
  loading = true;

  ngOnInit(): void {
    this.projectsSvc.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  open(project: Project) {
    this.router.navigate(['/dashboard', project.id]);
  }

  statusSeverity(s: Project['status']) {
    return s === 'Activo' ? 'success' : s === 'En pausa' ? 'warning' : 'danger';
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.dt?.filterGlobal(value, 'contains');
  }
  private fb = inject(FormBuilder);

  showForm = false;
  editing: Project | null = null;

  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    owner: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: [''],
    website: [''],
    status: ['Activo', Validators.required],
  });

  openCreate() {
    this.editing = null;
    this.form.reset({ status: 'Activo' });
    this.showForm = true;
  }

  openEdit(p: Project) {
    this.editing = p;
    this.form.patchValue({
      code: p.code,
      name: p.name,
      owner: p.owner,
      email: p.email,
      city: p.city ?? '',
      website: p.website ?? '',
      status: p.status,
    });
    this.showForm = true;
  }

  saveProject() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Omit<Project, 'id'>;

    if (this.editing) {
      this.projects = this.projects.map((pr) =>
        pr.id === this.editing!.id ? ({ ...pr, ...value } as Project) : pr
      );
      this.showForm = false;
      this.editing = null;
      this.msg.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Se actualizó el proyecto.',
      });
    } else {
      const lastId = Math.max(0, ...this.projects.map((p) => p.id));
      const newProject: Project = { id: lastId + 1, ...value } as Project;
      this.projects = [newProject, ...this.projects];
      this.showForm = false;
      this.msg.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Se creó el proyecto.',
      });
    }
  }
  deleteProject(id: number) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.msg.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se eliminó el proyecto.',
    });
  }
}
