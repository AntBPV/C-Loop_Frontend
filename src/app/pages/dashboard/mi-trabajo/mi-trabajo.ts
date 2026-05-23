import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, MyWorkResponse} from '../../../core/services/dashboard-service';


@Component({
  selector: 'app-mi-trabajo',
  imports: [CommonModule],
  templateUrl: './mi-trabajo.html',
  styleUrl: './mi-trabajo.css',
})
export class MiTrabajo implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);
  data = signal<MyWorkResponse | null>(null);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getMyWork().subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el panel de trabajo.');
        this.isLoading.set(false);
      },
    });
  }
}
