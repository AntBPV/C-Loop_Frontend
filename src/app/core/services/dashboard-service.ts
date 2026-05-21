import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface PendingApproval {
  stepId: string;
  convenioId: string;
  convenioCode: string;
  convenioTitle: string;
  companyName: string;
  stage: string;
  assignedAt: string;
  dueAt: string | null;
}

export interface PendingFormalization {
  convenioId: string;
  convenioCode: string;
  companyName: string;
  status: string;
  stage: string | null;
  convenioType: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyWorkResponse {
  pendingApprovals: PendingApproval[];
  alerts: any[];
  recentCreatedConvenios: any[];
  pendingFormalizations: PendingFormalization[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMyWork(): Observable<MyWorkResponse> {
    return this.http.get<MyWorkResponse>(`${this.base}${API_CONFIG.endpoints.dashboard.myWork}`, {
      headers: this.getHeaders(),
    });
  }
}
