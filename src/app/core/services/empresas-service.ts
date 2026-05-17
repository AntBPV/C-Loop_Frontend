import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ItemEstado } from '../../components/convenio-card/item-card';

export type EmpresaStatus =
  | 'BORRADOR'
  | 'PENDIENTE_VALIDACION'
  | 'VALIDADA'
  | 'OBSERVADA'
  | 'RECHAZADA';

export interface EmpresaResponse {
  id: string;
  nit: string;
  businessName: string;
  tradeName: string;
  identificationType: string;
  legalRepresentativeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: EmpresaStatus;
  createdById: string;
  validatedById: string | null;
  validatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getEmpresas(): Observable<EmpresaResponse[]> {
    return this.http.get<EmpresaResponse[]>(`${this.base}${API_CONFIG.endpoints.companies.list}`, {
      headers: this.getHeaders(),
    });
  }

  getEmpresaById(id: string): Observable<EmpresaResponse> {
    return this.http.get<EmpresaResponse>(
      `${this.base}${API_CONFIG.endpoints.companies.getById(id)}`,
      { headers: this.getHeaders() },
    );
  }

  calcularEstado(status: EmpresaStatus): ItemEstado {
    const map: Record<EmpresaStatus, ItemEstado> = {
      BORRADOR: 'vencido',
      PENDIENTE_VALIDACION: 'atencion',
      VALIDADA: 'ok',
      OBSERVADA: 'notificacion',
      RECHAZADA: 'por-vencer',
    };
    return map[status];
  }
}
