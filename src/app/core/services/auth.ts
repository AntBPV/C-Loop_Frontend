import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  requestCode(payload: RequestCodePayload): Observable<any> {
    return this.http.post(`${this.base}${API_CONFIG.endpoints.auth.requestCode}`, payload);
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.base}${API_CONFIG.endpoints.auth.register}`, payload);
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.base}${API_CONFIG.endpoints.auth.login}`, payload);
  }
}