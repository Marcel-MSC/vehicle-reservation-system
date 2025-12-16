import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Vehicle {
  _id: string;
  name: string;
  year: number;
  type: string;
  engine: string;
  size: number;
  imageUrl?: string;
  isAvailable: boolean;
}

interface Reservation {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  vehicle: {
    name: string;
    type: string;
  };
  status: string;
  reservedAt: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="admin-container">
      <h1>Painel de Administração</h1>

      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon users">
              <mat-icon>people</mat-icon>
            </div>
            <h3>Usuários</h3>
            <p class="stat-number">{{ users.length }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon vehicles">
              <mat-icon>directions_car</mat-icon>
            </div>
            <h3>Veículos</h3>
            <p class="stat-number">{{ vehicles.length }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon reservations">
              <mat-icon>event_seat</mat-icon>
            </div>
            <h3>Reservas Ativas</h3>
            <p class="stat-number">{{ activeReservations }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Usuários Cadastrados</h2>
          <button mat-flat-button color="primary" (click)="goToUsersPage()">
            <mat-icon>manage_accounts</mat-icon> Gerenciar Usuários
          </button>
        </div>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table *ngIf="!loading" mat-table [dataSource]="users" class="users-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Nome </th>
            <td mat-cell *matCellDef="let user"> {{ user.name }} </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let user"> {{ user.email }} </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef> Função </th>
            <td mat-cell *matCellDef="let user"> {{ user.role === 'admin' ? 'Admin' : 'Usuário' }} </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef> Cadastro </th>
            <td mat-cell *matCellDef="let user"> {{ formatDate(user.createdAt) }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div class="content-section">
        <h2>Reservas Recentes</h2>
        <div *ngIf="loadingReservations" class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table *ngIf="!loadingReservations" mat-table [dataSource]="reservations" class="reservations-table">
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef> Usuário </th>
            <td mat-cell *matCellDef="let reservation"> {{ reservation.user.name }} </td>
          </ng-container>

          <ng-container matColumnDef="vehicle">
            <th mat-header-cell *matHeaderCellDef> Veículo </th>
            <td mat-cell *matCellDef="let reservation"> {{ reservation.vehicle.name }} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let reservation">
              <span [class.status-active]="reservation.status === 'active'"
                    [class.status-completed]="reservation.status === 'completed'"
                    [class.status-cancelled]="reservation.status === 'cancelled'">
                {{ getStatusText(reservation.status) }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Data </th>
            <td mat-cell *matCellDef="let reservation"> {{ formatDate(reservation.reservedAt) }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="reservationColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: reservationColumns;"></tr>
        </table>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Gerenciamento de Veículos</h2>
          <button mat-raised-button color="primary" (click)="openCreateVehicleDialog()">
            <mat-icon>add</mat-icon> Novo Veículo
          </button>
        </div>

        <div *ngIf="loadingVehicles" class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table *ngIf="!loadingVehicles" mat-table [dataSource]="allVehicles" class="vehicles-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef> Imagem </th>
            <td mat-cell *matCellDef="let vehicle">
              <img [src]="vehicle.imageUrl || 'assets/default-car.jpg'" [alt]="vehicle.name" class="vehicle-thumbnail">
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Veículo </th>
            <td mat-cell *matCellDef="let vehicle"> {{ vehicle.name }} </td>
          </ng-container>

          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef> Ano </th>
            <td mat-cell *matCellDef="let vehicle"> {{ vehicle.year }} </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef> Tipo </th>
            <td mat-cell *matCellDef="let vehicle"> {{ vehicle.type }} </td>
          </ng-container>

          <ng-container matColumnDef="availability">
            <th mat-header-cell *matHeaderCellDef> Disponível </th>
            <td mat-cell *matCellDef="let vehicle">
              <mat-icon [class.available]="vehicle.isAvailable" [class.unavailable]="!vehicle.isAvailable">
                {{ vehicle.isAvailable ? 'check_circle' : 'cancel' }}
              </mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Ações </th>
            <td mat-cell *matCellDef="let vehicle">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openEditVehicleDialog(vehicle)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="openDeleteVehicleDialog(vehicle)" title="Excluir">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="vehicleColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: vehicleColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #3f51b5;
      font-size: 28px;
      margin: 0;
      margin-bottom: 30px;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-size: 30px;
      color: white;
    }

    .stat-icon.users {
      background-color: #2196f3;
    }

    .stat-icon.vehicles {
      background-color: #4caf50;
    }

    .stat-icon.reservations {
      background-color: #ff9800;
    }

    h3 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #666;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .content-section {
      margin-bottom: 40px;
    }

    .content-section h2 {
      color: #444;
      font-size: 20px;
      margin-bottom: 15px;
      border-bottom: 2px solid #3f51b5;
      padding-bottom: 10px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .users-table, .reservations-table, .vehicles-table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .section-header h2 {
      margin: 0;
      border: none;
      padding: 0;
      color: #444;
      font-size: 20px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .vehicle-thumbnail {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      background-color: #f5f5f5;
    }

    .available {
      color: #4caf50;
    }

    .unavailable {
      color: #f44336;
    }

    mat-header-cell, mat-cell {
      padding: 12px 16px;
      font-size: 14px;
    }

    mat-header-cell {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    mat-row:nth-child(even) {
      background-color: #f9f9f9;
    }

    mat-row:hover {
      background-color: #f0f0f0;
    }

    .status-active {
      color: #4caf50;
      font-weight: 500;
    }

    .status-completed {
      color: #2196f3;
      font-weight: 500;
    }

    .status-cancelled {
      color: #f44336;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .stats-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  vehicles: Vehicle[] = [];
  allVehicles: Vehicle[] = [];
  reservations: Reservation[] = [];
  loading: boolean = true;
  loadingReservations: boolean = true;
  loadingVehicles: boolean = true;
  displayedColumns: string[] = ['name', 'email', 'role', 'createdAt'];
  reservationColumns: string[] = ['user', 'vehicle', 'status', 'date'];
  vehicleColumns: string[] = ['image', 'name', 'year', 'type', 'availability', 'actions'];

  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.checkAuth();
    this.loadUsers();
    this.loadVehicles();
    this.loadAllVehicles();
    this.loadReservations();
  }

  checkAuth() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  loadUsers() {
    this.loading = true;
    // In a real admin scenario, we would have an admin API endpoint
    // For this demo, we'll simulate loading users
    setTimeout(() => {
      this.users = [
        { _id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() },
        { _id: '2', name: 'Regular User', email: 'user@example.com', role: 'user', createdAt: new Date().toISOString() }
      ];
      this.loading = false;
    }, 1000);
  }

  loadVehicles() {
    this.apiService.getVehicles().subscribe({
      next: (response) => {
        this.vehicles = response.vehicles;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar veículos', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  loadAllVehicles() {
    this.loadingVehicles = true;
    this.apiService.getVehicles().subscribe({
      next: (response) => {
        this.allVehicles = response.vehicles;
        this.loadingVehicles = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar veículos', 'Fechar', { duration: 3000 });
        this.loadingVehicles = false;
      }
    });
  }

  goToUsersPage() {
    this.router.navigate(['/users']);
  }

  openCreateUserDialog() {
    this.router.navigate(['/users']);
  }

  openEditUserDialog(user: User) {
    this.router.navigate(['/users']);
  }

  openDeleteUserDialog(user: User) {
    this.router.navigate(['/users']);
  }

  openCreateVehicleDialog() {
    this.router.navigate(['/vehicles/create']);
  }

  openEditVehicleDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(EditVehicleDialogComponent, {
      width: '600px',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllVehicles();
      }
    });
  }

  openDeleteVehicleDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(DeleteVehicleDialogComponent, {
      width: '400px',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllVehicles();
      }
    });
  }

  loadReservations() {
    this.loadingReservations = true;
    // In a real admin scenario, we would have an admin API endpoint
    // For this demo, we'll use the user reservations endpoint
    this.apiService.getUserReservations().subscribe({
      next: (response) => {
        this.reservations = response.reservations;
        this.loadingReservations = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar reservas', 'Fechar', { duration: 3000 });
        this.loadingReservations = false;
      }
    });
  }

  get activeReservations(): number {
    return this.reservations.filter(r => r.status === 'active').length;
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
      year: 'numeric'
    });
  }
}

@Component({
  selector: 'app-edit-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Veículo</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm" class="vehicle-form">
        <mat-form-field appearance="outline">
          <mat-label>Nome do Veículo</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Ford Ká Hatch">
          <mat-icon matSuffix>directions_car</mat-icon>
          <mat-error *ngIf="vehicleForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ano</mat-label>
          <input matInput formControlName="year" placeholder="Ex: 2019" maxlength="4">
          <mat-icon matSuffix>calendar_today</mat-icon>
          <mat-error *ngIf="vehicleForm.get('year')?.hasError('required')">
            Ano é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo de Veículo</mat-label>
          <mat-select formControlName="type">
            <mat-option value="Hatchback">Hatchback</mat-option>
            <mat-option value="SUV">SUV</mat-option>
            <mat-option value="SUV Médio">SUV Médio</mat-option>
            <mat-option value="SUV Compacto">SUV Compacto</mat-option>
            <mat-option value="Crossover">Crossover</mat-option>
            <mat-option value="Coupé Esportivo">Coupé Esportivo</mat-option>
            <mat-option value="Picape Leve">Picape Leve</mat-option>
            <mat-option value="Picape Média">Picape Média</mat-option>
            <mat-option value="Sedan Compacto">Sedan Compacto</mat-option>
            <mat-option value="Sedan Médio">Sedan Médio</mat-option>
            <mat-option value="Sedan Grande">Sedan Grande</mat-option>
            <mat-option value="Furgão">Furgão</mat-option>
            <mat-option value="Utilitário Leve">Utilitário Leve</mat-option>
            <mat-option value="Utilitário">Utilitário</mat-option>
          </mat-select>
          <mat-error *ngIf="vehicleForm.get('type')?.hasError('required')">
            Tipo é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Motor</mat-label>
          <input matInput formControlName="engine" placeholder="Ex: 1.0, 1.6, 2.0">
          <mat-icon matSuffix>build</mat-icon>
          <mat-error *ngIf="vehicleForm.get('engine')?.hasError('required')">
            Motor é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacidade (passageiros)</mat-label>
          <input matInput formControlName="size" placeholder="Ex: 5" type="number">
          <mat-icon matSuffix>people</mat-icon>
          <mat-error *ngIf="vehicleForm.get('size')?.hasError('required')">
            Capacidade é obrigatória
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>URL da Imagem (opcional)</mat-label>
          <input matInput formControlName="imageUrl" placeholder="http://...">
          <mat-icon matSuffix>image</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-raised-button (click)="save()" [disabled]="vehicleForm.invalid" color="primary">
        <mat-icon>save</mat-icon> Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .vehicle-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
      min-width: 400px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class EditVehicleDialogComponent {
  vehicleForm: FormGroup;

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor(
    public dialogRef: MatDialogRef<EditVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vehicleForm = this.fb.group({
      name: [data.vehicle.name, Validators.required],
      year: [data.vehicle.year.toString(), Validators.required],
      type: [data.vehicle.type, Validators.required],
      engine: [data.vehicle.engine, Validators.required],
      size: [data.vehicle.size.toString(), Validators.required],
      imageUrl: [data.vehicle.imageUrl || '']
    });
  }

  save() {
    if (this.vehicleForm.valid) {
      const vehicleData = {
        name: this.vehicleForm.value.name,
        year: this.vehicleForm.value.year,
        type: this.vehicleForm.value.type,
        engine: this.vehicleForm.value.engine,
        size: this.vehicleForm.value.size.toString(),
        imageUrl: this.vehicleForm.value.imageUrl || undefined
      };

      this.apiService.updateVehicle(this.data.vehicle._id, vehicleData).subscribe({
        next: () => {
          this.snackBar.open('Veículo atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(error.error?.error || 'Erro ao atualizar veículo', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}

@Component({
  selector: 'app-delete-vehicle-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Excluir Veículo</h2>
    <mat-dialog-content>
      <p>Tem certeza que deseja excluir o veículo <strong>{{ data.vehicle?.name }}</strong>?</p>
      <p>Esta ação não pode ser desfeita.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-raised-button (click)="deleteVehicle()" color="warn">
        <mat-icon>delete</mat-icon> Excluir
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    p {
      line-height: 1.5;
      color: #333;
    }

    strong {
      color: #3f51b5;
      font-weight: 600;
    }
  `]
})
export class DeleteVehicleDialogComponent {
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<DeleteVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteVehicle() {
    this.apiService.deleteVehicle(this.data.vehicle._id).subscribe({
      next: () => {
        this.snackBar.open('Veículo excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao excluir veículo', 'Fechar', { duration: 3000 });
      }
    });
  }
}
