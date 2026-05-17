import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface ConvenioResponse {
  id: string;
  code: string;
  companyId: string;
  companyBusinessName: string;
  currentStatus: string;
  convenioType: string;
  convenioTypeLabel: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConveniosService {
  private base = API_CONFIG.baseUrl;

  // Umbrales configurables en días
  readonly UMBRAL_ATENCION = 60;
  readonly UMBRAL_POR_VENCER = 30;

  constructor(private http: HttpClient) {}

  getConvenios(): Observable<ConvenioResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<ConvenioResponse[]>(`${this.base}${API_CONFIG.endpoints.convenios.list}`, {
      headers,
    });
  }

  calcularEstado(convenio: ConvenioResponse): 'ok' | 'atencion' | 'por-vencer' | 'vencido' {
    if (convenio.endDate) {
      const hoy = new Date();
      const vencimiento = new Date(convenio.endDate);
      const diasRestantes = Math.floor(
        (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diasRestantes < 0) return 'vencido';
      if (diasRestantes <= this.UMBRAL_POR_VENCER) return 'por-vencer';
      if (diasRestantes <= this.UMBRAL_ATENCION) return 'atencion';
    }

    return 'ok';
  }
}
