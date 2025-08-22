import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { Task } from '../../../shared/interfaces/models.interface';
import { TaskService } from '../../../shared/services/task.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    TagModule,
    DialogModule,
    ReactiveFormsModule,
    SelectModule 

  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  @ViewChild('dt') dt: Table | undefined;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tasksSvc = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(MessageService);

  projectId!: number;
  tasks: Task[] = [];
  loading = true;

  showForm = false;
  editing: Task | null = null;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    completed: false,
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam ?? 0);
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.projectId = id;
    this.tasksSvc.getTasksByProject(id).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

  completedSeverity(done: boolean) {
    return done ? 'success' : 'warn';
  }
  onGlobalFilter(event : Event){
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.dt?.filterGlobal(value, 'contains');
  }

  
  openCreate() {
    this.editing = null;
    this.form.reset({ title: '', completed: false });
    this.showForm = true;
  }

  openEdit(t: Task) {
    this.editing = t;
    this.form.reset({ title: t.title, completed: t.completed });
    this.showForm = true;
    console.log(this.tasks);
    
  }

    saveTask() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { title, completed } = this.form.getRawValue();

    if (this.editing) {
      this.tasks = this.tasks.map(x =>
        x.id === this.editing!.id ? { ...x, title, completed } : x
      );
      this.editing = null;
      this.msg.add({ severity:'success', summary:'Éxito', detail:'Se actualizó la tarea.' });
    } else {
      const newId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
      const nt: Task = { userId: this.projectId, id: newId, title, completed };
      this.tasks = [nt, ...this.tasks];
      this.msg.add({ severity:'success', summary:'Éxito', detail:'Se creó la tarea.' });
    }

    this.showForm = false;
  }
  deleteTask(id: number){
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.msg.add({ severity:'success', summary:'Éxito', detail:'Se eliminó la tarea.' });
  }
}
