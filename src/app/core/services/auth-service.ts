import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { tap } from 'rxjs/operators';

export interface RequestCodePayload {
  email: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  code: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  authProvider: string;
  roles: string[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  requestCode(payload: RequestCodePayload): Observable<any> {
    return this.http.post(`${this.base}${API_CONFIG.endpoints.auth.requestCode}`, payload, {
      responseType: 'text',
    });
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http
      .post(`${this.base}${API_CONFIG.endpoints.auth.register}`, payload, {
        responseType: 'text',
      })
      .pipe(
        tap((response: any) => {
          const parsed = JSON.parse(response);
          if (parsed.token) {
            localStorage.setItem('token', parsed.token);
          }
        }),
      );
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http
      .post(`${this.base}${API_CONFIG.endpoints.auth.login}`, payload, {
        responseType: 'text',
      })
      .pipe(
        tap((response: any) => {
          const parsed = JSON.parse(response);
          if (parsed.token) {
            localStorage.setItem('token', parsed.token);
          }
        }),
      );
  }

  getCurrentUser(): Observable<CurrentUser> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<CurrentUser>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.me}`, {
        headers,
      })
      .pipe(
        tap((user) => {
          this.storeUser(user);
        }),
      );
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();

    if (!user) {
      return false;
    }

    return user.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();

    if (!user) {
      return false;
    }

    return roles.some((role) => user.roles.includes(role));
  }

  storeUser(user: CurrentUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getStoredUser(): CurrentUser | null {
    const raw = localStorage.getItem('currentUser');

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
