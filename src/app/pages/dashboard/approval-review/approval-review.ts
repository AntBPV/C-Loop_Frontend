import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConvenioDetail } from '../convenios/convenio-detail/convenio-detail';
import { ApprovalActions, ApprovalAction } from './approval-actions/approval-actions';
import { API_CONFIG } from '../../../core/config/api.config';

interface ApprovalStep {
  id: string;
  convenioId: string;
  status?: string;
  stage: string;
}

@Component({
  selector: 'app-approval-review',
  standalone: true,
  imports: [CommonModule, ConvenioDetail, ApprovalActions],
  templateUrl: './approval-review.html',
  styleUrl: './approval-review.css',
})
export class ApprovalReview implements OnInit {
  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  approval = signal<ApprovalStep | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}
// TODO ELIMINAR ESTE CODIGO UNA VEZ ESTE SEGURO DE QUE TODO FUNCIONA
  ngOnInit() {
    // Leer los datos pasados por estado de navegación
    const state = this.router.getCurrentNavigation()?.extras.state ?? history.state; // fallback si ya pasó la navegación

    if (state?.approval) {
      this.approval.set(state.approval as ApprovalStep);
      this.isLoading.set(false);
    } else {
      // Fallback: si alguien entra directo por URL sin estado
      this.error.set('No se encontraron datos del paso. Vuelve al dashboard.');
      this.isLoading.set(false);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  //
  // ngOnInit() {
  //   const stepId = this.route.snapshot.paramMap.get('stepId');
  //   if (!stepId) {
  //     this.error.set('Paso de aprobación inválido.');
  //     this.isLoading.set(false);
  //     return;
  //   }
  //   this.loadApproval(stepId);
  // }
  //
  // private getHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }

  loadApproval(stepId: string) {
    this.http
      .get<ApprovalStep>(`${API_CONFIG.baseUrl}/api/approvals/${stepId}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.approval.set(data);

          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar la revisión.');

          this.isLoading.set(false);
        },
      });
  }

  handleAction(event: { type: ApprovalAction; comment: string }) {
    const approval = this.approval();
    if (!approval) {
      return;
    }
    this.isSubmitting.set(true);
    this.error.set(null);

    this.http
      .post(
        `${API_CONFIG.baseUrl}/api/approvals/${approval.id}/${event.type}`,
        {
          comment: event.comment,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.error.set('No se pudo procesar la revisión.');

          this.isSubmitting.set(false);
        },
      });
  }

  goBack() {
    this.router.navigate(['/dashboard/mi-trabajo']);
  }
}
