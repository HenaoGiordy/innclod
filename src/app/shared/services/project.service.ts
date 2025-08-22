import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { map, Observable } from 'rxjs';
import { Project, User, userToProject } from '../interfaces/models.interface';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpService);
  private url = environment.USERS_URL;

  getProjects(): Observable<Project[]> {
    return this.http
      .get<User[]>(this.url)
      .pipe(map((list) => list.map(userToProject)));
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<User>(`${this.url}/${id}`).pipe(map(userToProject));
  }
}
