import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthState, User } from '../interfaces/models.interface';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpService);

  readonly users = signal<User[] | null>(null);
  readonly usersLoaded = computed(() => (this.users() ?? []).length > 0);
  public readonly authState = signal<AuthState>(this.loadFromStorage());

  private loadFromStorage(): AuthState {
    try {
      const raw = localStorage.getItem('innclod_auth');
      if (raw) return JSON.parse(raw) as AuthState;
    } catch {}
    return { isAuthenticated: false, user: null};
  }

  login(identifier: string, password: string): boolean {
    const list = this.users() ?? [];
    const id = (identifier ?? '').trim().toLowerCase();

    const found = list.find(
      (u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id
    );

    if (!found || password !== '123456') return false;

    this.setAuthState({
      isAuthenticated: true,
      user: found
    });
    return true;
  }

  logout(): void {
    this.setAuthState({ isAuthenticated: false, user: null});
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  private setAuthState(state: AuthState) {
    this.authState.set(state);
    try {
      localStorage.setItem('innclod_auth', JSON.stringify(state));
    } catch {}
  }

  async preloadUsers(): Promise<void> {
    if (this.usersLoaded()) return;
    const data = await firstValueFrom(this.http.get<User[]>(environment.USERS_URL));
    this.users.set(data);
  }
}
