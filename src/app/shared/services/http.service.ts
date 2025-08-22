import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { NotificationService } from "./alert.service";
import { ApiError } from "../interfaces/models.interface";


@Injectable({ providedIn: 'root' })
export class HttpService {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(catchError(err => this.handleError(err, 'GET')));
  }

  private handleError(error: HttpErrorResponse, url: string) {
    const apiError: ApiError = {
      status: error.status || 0,
      message: error.message || 'Unknown error',
      url
    };
    this.notify.error('No se pudo completar la operación', apiError.message);
    return throwError(() => apiError);
  }
}