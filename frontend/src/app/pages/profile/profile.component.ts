import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Reservation {
  _id: string;
  vehicle: {
    name: string;
    year: number;
    type: string;
    imageUrl: string;
  };
  status: string;
  reservedAt: string;
  releasedAt?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatDialogModule
  ],
  template: `
    <div class="profile-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()" title="Voltar">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Meu Perfil</h1>
      </div>

      <mat-tab-group>
        <mat-tab label="Informações Pessoais">
          <div class="profile-section">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Editar Perfil</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form (ngSubmit)="updateProfile()" class="profile-form">
                  <div class="form-group">
                    <label for="name" class="form-label">Nome</label>
                    <div class="input-wrapper">
                      <input type="text" id="name" class="form-input" [(ngModel)]="user.name" name="name" placeholder="Nome" required>
                      <mat-icon class="input-icon">person</mat-icon>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-wrapper">
                      <input type="email" id="email" class="form-input" [(ngModel)]="user.email" name="email" placeholder="Email" readonly>
                      <mat-icon class="input-icon">email</mat-icon>
                    </div>
                  </div>

                  <div class="button-group">
                    <button mat-raised-button color="primary" type="submit" [disabled]="loading">
                      <mat-icon>save</mat-icon> Salvar Alterações
                    </button>
                    <button mat-button color="warn" type="button" (click)="openDeleteDialog()">
                      <mat-icon>delete</mat-icon> Excluir Conta
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Minhas Reservas">
          <div class="reservations-section">
            <div *ngIf="loadingReservations" class="loading-spinner">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <div *ngIf="!loadingReservations && reservations.length === 0" class="no-reservations">
              <mat-icon>event_seat</mat-icon>
              <p>Você não possui reservas ativas</p>
            </div>

            <div *ngIf="!loadingReservations" class="reservations-list">
              <mat-card *ngFor="let reservation of reservations" class="reservation-card">
                <div class="reservation-header">
                  <h3>{{ reservation.vehicle.name }}</h3>
                  <span [class.status-active]="reservation.status === 'active'"
                        [class.status-completed]="reservation.status === 'completed'"
                        [class.status-cancelled]="reservation.status === 'cancelled'">
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
                <div class="reservation-content">
                  <img [src]="reservation.vehicle.imageUrl || 'assets/default-car.jpg'" [alt]="reservation.vehicle.name" class="reservation-image">
                  <div class="reservation-details">
                    <p><strong>Modelo:</strong> {{ reservation.vehicle.name }}</p>
                    <p><strong>Ano:</strong> {{ reservation.vehicle.year }}</p>
                    <p><strong>Tipo:</strong> {{ reservation.vehicle.type }}</p>
                    <p><strong>Data da Reserva:</strong> {{ formatDate(reservation.reservedAt) }}</p>
                    <p *ngIf="reservation.releasedAt"><strong>Data de Devolução:</strong> {{ formatDate(reservation.releasedAt) }}</p>
                  </div>
                </div>
                <mat-card-actions *ngIf="reservation.status === 'active'">
                  <button mat-raised-button color="warn" (click)="cancelReservation(reservation._id)">
                    <mat-icon>cancel</mat-icon> Cancelar Reserva
                  </button>
                  <button mat-raised-button color="accent" (click)="releaseReservation(reservation._id)">
                    <mat-icon>check_circle</mat-icon> Finalizar Reserva
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px 24px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    }

    .back-button {
      padding: 12px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      transform: translateX(-3px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    h1 {
      color: #333;
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-section, .reservations-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Form Styling */
    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    .input-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 1px solid #ccc;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.9);
      color: #333;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 400;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }

    .form-input[readonly] {
      background-color: #f5f5f5;
      border-color: #ddd;
      color: #666;
      cursor: not-allowed;
    }

    .form-input[readonly]:focus {
      border-color: #ddd;
      box-shadow: none;
    }

    .input-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #667eea;
    }

    .button-group {
      display: flex;
      gap: 16px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .save-button {
      padding: 14px 32px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }

    .save-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
    }

    .delete-button {
      padding: 12px 24px;
      border-radius: 12px;
      background: transparent;
      color: #f44336;
      font-weight: 500;
      border: 2px solid #f44336;
      transition: all 0.3s ease;
    }

    .delete-button:hover {
      background: rgba(244, 67, 54, 0.1);
      transform: translateY(-1px);
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .no-reservations {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      color: #666;
      gap: 20px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 16px;
      border: 2px dashed #ddd;
    }

    .no-reservations mat-icon {
      font-size: 64px;
      color: #ddd;
      opacity: 0.8;
    }

    .no-reservations h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }

    .reservations-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .reservation-card {
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }

    .reservation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
    }

    .reservation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .reservation-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .status-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background: rgba(76, 175, 80, 0.9);
      color: white;
    }

    .status-completed {
      background: rgba(33, 150, 243, 0.9);
      color: white;
    }

    .status-cancelled {
      background: rgba(244, 67, 54, 0.9);
      color: white;
    }

    .reservation-content {
      display: flex;
      gap: 24px;
      padding: 24px;
    }

    .reservation-image {
      width: 140px;
      height: 100px;
      object-fit: cover;
      border-radius: 12px;
      background-color: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .reservation-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }

    .detail-value {
      color: #333;
      font-size: 14px;
    }

    mat-card-actions {
      padding: 20px 24px;
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      background: #f8f9fa;
    }

    .cancel-btn, .release-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .cancel-btn {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
    }

    .release-btn {
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
    }

    .cancel-btn:hover, .release-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    /* Tab Group Styling */
    ::ng-deep .mat-mdc-tab-header {
      border-bottom: 3px solid #667eea;
      margin-bottom: 24px;
    }

    ::ng-deep .mat-mdc-tab {
      min-width: 160px;
    }

    ::ng-deep .mdc-tab__text-label {
      font-weight: 600;
      color: #666;
    }

    ::ng-deep .mdc-tab--active .mdc-tab__text-label {
      color: #667eea;
    }

    ::ng-deep .mdc-tab-indicator__content {
      background-color: #667eea;
    }

    /* Form Field Styling - Filled variant */
    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 16px;
    }

    ::ng-deep .mat-mdc-form-field .mat-mdc-text-field-wrapper {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    ::ng-deep .mat-mdc-form-field:hover .mat-mdc-text-field-wrapper {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    ::ng-deep .mat-mdc-form-field.mdc-text-field--focused .mat-mdc-text-field-wrapper {
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    /* Filled variant specific styles */
    ::ng-deep .mat-mdc-text-field--fill .mdc-text-field__input {
      padding-top: 20px;
      padding-bottom: 12px;
      color: #333;
      font-weight: 400;
    }

    ::ng-deep .mat-mdc-text-field--fill .mdc-floating-label {
      color: #767676;
      font-weight: 500;
      font-size: 14px;
      left: 16px;
      right: auto;
      top: 50%;
      transform: translateY(-50%);
    }

    ::ng-deep .mat-mdc-text-field--fill .mdc-floating-label--float-above {
      top: 8px;
      left: 16px;
      color: #667eea;
      font-size: 12px;
      font-weight: 600;
      transform: scale(0.85);
      transform-origin: left center;
    }

    ::ng-deep .mat-mdc-text-field--fill.mdc-text-field--focused .mdc-floating-label--float-above {
      color: #667eea;
    }

    /* Line ripple effects */
    ::ng-deep .mdc-line-ripple::before {
      border-bottom: 1px solid rgba(102, 126, 234, 0.3);
    }

    ::ng-deep .mdc-line-ripple::after {
      border-bottom: 2px solid #667eea;
    }

    /* Icon styling */
    ::ng-deep .mdc-text-field__icon, ::ng-deep .mat-icon {
      color: #667eea;
    }

    ::ng-deep .mdc-text-field__icon:hover, ::ng-deep .mat-icon:hover {
      color: #764ba2;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 16px 20px;
      }

      h1 {
        font-size: 28px;
      }

      .reservation-content {
        flex-direction: column;
        gap: 16px;
      }

      .reservation-image {
        width: 100%;
        height: 120px;
      }

      .button-group {
        flex-direction: column;
      }

      .cancel-btn, .release-btn {
        width: 100%;
      }

      mat-card-actions {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    email: ''
  };
  reservations: Reservation[] = [];
  loading: boolean = false;
  loadingReservations: boolean = false;

  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadUserProfile();
    this.loadReservations();
  }

  loadUserProfile() {
    this.loading = true;
    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar perfil', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loading = false;
      }
    });
  }

  updateProfile() {
    if (!this.user.name || !this.user.email) {
      this.snackBar.open('Por favor, preencha todos os campos', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      return;
    }

    this.loading = true;
    this.apiService.updateProfile(this.user.name, this.user.email).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao atualizar perfil', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loading = false;
      }
    });
  }

  loadReservations() {
    this.loadingReservations = true;
    this.apiService.getUserReservations().subscribe({
      next: (response) => {
        this.reservations = response.reservations;
        this.loadingReservations = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar reservas', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loadingReservations = false;
      }
    });
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

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
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

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount() {
    this.apiService.deleteProfile().subscribe({
      next: (response) => {
        this.authService.logout();
        this.snackBar.open('Conta excluída com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao excluir conta', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  goBack() {
    this.router.navigate(['/vehicles']);
  }
}

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Excluir Conta</h2>
    <mat-dialog-content>
      <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-button [mat-dialog-close]="true" color="warn">
        <mat-icon>delete</mat-icon> Excluir
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      color: #f44336;
    }
  `]
})
export class DeleteAccountDialog {}
