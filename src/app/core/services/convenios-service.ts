import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface ConvenioResponse {
  id: string;

  code: string;

  title: string;

  companyId: string;
  companyNit: string;
  companyBusinessName: string;

  createdById: string;

  currentStatus: string;
  currentStage: string | null;

  convenioType: string;
  convenioTypeLabel: string;

  rectorSignerLabel: string;

  currentVersionId: string;
  currentVersionNumber: number;

  objective: string;
  description: string;

  durationMonths: number;

  externalEntityObligations: string;
  universityObligations: string;

  estimatedValue: number;

  canEditBeforeReview: boolean;

  startDate: string | null;
  endDate: string | null;

  createdAt: string;
  updatedAt: string;

  revisionIssueCount: number;
}

export interface UpdateConvenioDto {
  companyId?: string;
  convenioType?: string;

  title?: string;

  objective?: string;

  description?: string;

  durationMonths?: number;

  externalEntityObligations?: string;

  universityObligations?: string;

  estimatedValue?: number;

  startDate?: string | null;

  endDate?: string | null;
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

  updateConvenio(convenioId: string, payload: UpdateConvenioDto): Observable<ConvenioResponse> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<ConvenioResponse>(
      `${this.base}${API_CONFIG.endpoints.convenios.update(convenioId)}`,
      payload,
      { headers },
    );
  }

  requestCompanyDocuments(convenioId: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${API_CONFIG.baseUrl}/api/convenios/${convenioId}/request-company-documents`,
      {},
      { headers },
    );
  }

  readonly ESTADOS_EDITABLES = [
    'BORRADOR',
    'EMPRESA_PENDIENTE',
    'PENDIENTE_DOCUMENTOS_EMPRESA',
    'DOCUMENTOS_EMPRESA_RECIBIDOS',
    'DOCUMENTOS_OBSERVADOS_EMPRESA',
    'DOCUMENTOS_APROBADOS',
    'LISTO_PARA_RADICAR',
  ];

  readonly ESTADOS_EN_PROCESO = ['RADICADO', 'EN_REVISION', 'EN_CORRECCION', 'APROBADO_PARA_FIRMA'];

  readonly ESTADOS_CANCELADOS = ['RECHAZADO', 'DESISTIDO', 'VENCIDO', 'CERRADO'];

  calcularEstado(
    convenio: ConvenioResponse,
  ):
    | 'ok'
    | 'atencion'
    | 'por-vencer'
    | 'vencido'
    | 'notificacion'
    | 'borrador'
    | 'en-proceso'
    | 'cancelado' {
    // Convenios editables
    if (this.ESTADOS_EDITABLES.includes(convenio.currentStatus)) {
      return 'borrador';
    }

    // Convenios en trámite
    if (this.ESTADOS_EN_PROCESO.includes(convenio.currentStatus)) {
      return 'en-proceso';
    }

    // Convenios finalizados/cancelados
    if (this.ESTADOS_CANCELADOS.includes(convenio.currentStatus)) {
      return 'cancelado';
    }

    // Observaciones durante formalización
    if (convenio.revisionIssueCount > 0) {
      return 'notificacion';
    }

    /**
     * Solo FORMALIZADO utiliza control por fechas
     */
    if (convenio.currentStatus === 'FORMALIZADO' && convenio.endDate) {
      const hoy = new Date();

      const vencimiento = new Date(convenio.endDate);

      const diasRestantes = Math.floor(
        (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diasRestantes < 0) {
        return 'vencido';
      }

      if (diasRestantes <= this.UMBRAL_POR_VENCER) {
        return 'por-vencer';
      }

      if (diasRestantes <= this.UMBRAL_ATENCION) {
        return 'atencion';
      }
    }

    return 'ok';
  }
}
