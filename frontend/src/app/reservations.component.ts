import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from './services/api.service';

interface Reservation {
  _id: string;
  vehicle: {
    _id: string;
    name: string;
    year: number;
    imageUrl: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  reservedAt: string;
  releasedAt?: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="reservations-container">
      <h1>Minhas Reservas</h1>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Carregando suas reservas...</p>
      </div>

      <div *ngIf="!loading && reservations.length === 0" class="no-reservations">
        <mat-icon>event_busy</mat-icon>
        <p>Você ainda não fez nenhuma reserva.</p>
      </div>

      <div *ngIf="!loading" class="reservations-grid">
        <mat-card *ngFor="let reservation of reservations" class="reservation-card">
          <img [src]="reservation.vehicle.imageUrl || 'assets/default-car.jpg'" [alt]="reservation.vehicle.name" class="vehicle-image">
          <mat-card-header>
            <mat-card-title>{{ reservation.vehicle.name }}</mat-card-title>
            <mat-card-subtitle>{{ reservation.vehicle.year }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Reservado em:</strong> {{ formatDate(reservation.reservedAt) }}</p>
            <p><strong>Status:</strong>
              <span [ngClass]="'status-' + reservation.status">
                {{ getStatusText(reservation.status) }}
              </span>
            </p>
            <p *ngIf="reservation.releasedAt">
              <strong>Finalizado em:</strong> {{ formatDate(reservation.releasedAt) }}
            </p>
          </mat-card-content>
          <mat-card-actions *ngIf="reservation.status === 'active'">
            <button mat-raised-button color="warn" (click)="cancelReservation(reservation._id)">
              <mat-icon>cancel</mat-icon> Cancelar
            </button>
            <button mat-raised-button color="primary" (click)="releaseReservation(reservation._id)">
              <mat-icon>check_circle</mat-icon> Finalizar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reservations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #3f51b5;
      font-size: 28px;
      margin-bottom: 30px;
    }

    .loading-spinner, .no-reservations {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 15px;
      color: #666;
    }

    .no-reservations mat-icon {
      font-size: 48px;
      color: #999;
    }

    .reservations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .reservation-card {
      border-radius: 12px;
      overflow: hidden;
    }

    .vehicle-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    mat-card-content p {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }

    .status-active { color: #4caf50; font-weight: 500; }
    .status-completed { color: #2196f3; font-weight: 500; }
    .status-cancelled { color: #f44336; font-weight: 500; }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    mat-card-actions button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
  `]
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading: boolean = true;

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.apiService.getUserReservations().subscribe({
      next: (response) => {
        this.reservations = response.reservations;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar reservas', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  cancelReservation(reservationId: string) {
    this.apiService.cancelReservation(reservationId).subscribe({
      next: (response) => {
        this.snackBar.open('Reserva cancelada com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loadReservations();
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao cancelar reserva', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  releaseReservation(reservationId: string) {
    this.apiService.releaseReservation(reservationId).subscribe({
      next: (response) => {
        this.snackBar.open('Reserva finalizada com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loadReservations();
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao finalizar reserva', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }
}
