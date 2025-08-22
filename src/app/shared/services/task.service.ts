import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { map, Observable } from "rxjs";
import { Task } from "../interfaces/models.interface";
import { environment } from "../../environments/environment.dev";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpService);
  private url = environment.TASKS_URL;

  getTasksByProject(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this.url)
    .pipe(map(list => list.filter(t => t.userId === userId)));
  }

}
