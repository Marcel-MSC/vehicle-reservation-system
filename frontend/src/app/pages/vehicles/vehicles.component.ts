import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Vehicle {
  _id: string;
  name: string;
  year: number;
  type: string;
  engine: string;
  size: string;
  imageUrl: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="vehicles-container">
      <div class="page-header">
        <h1>Veículos Disponíveis</h1>
        <button mat-fab color="primary" (click)="createVehicle()" *ngIf="isAdmin()" title="Criar novo veículo" class="create-vehicle-btn">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters-section" *ngIf="!loading">
        <mat-card class="filters-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>filter_list</mat-icon> Filtros
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="filters-grid">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Buscar veículo</mat-label>
                <input matInput [(ngModel)]="searchQuery" (input)="onSearchInput($event)" placeholder="Nome, tipo, ano, motor...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Tipo de veículo</mat-label>
                <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
                  <mat-option value="">Todos os tipos</mat-option>
                  <mat-option *ngFor="let type of vehicleTypes" [value]="type">{{ type }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Ano</mat-label>
                <mat-select [(ngModel)]="selectedYear" (selectionChange)="applyFilters()">
                  <mat-option value="">Todos os anos</mat-option>
                  <mat-option *ngFor="let year of vehicleYears" [value]="year">{{ year }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Motor</mat-label>
                <mat-select [(ngModel)]="selectedEngine" (selectionChange)="applyFilters()">
                  <mat-option value="">Todos os motores</mat-option>
                  <mat-option *ngFor="let engine of vehicleEngines" [value]="engine">{{ engine }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Tamanho</mat-label>
                <mat-select [(ngModel)]="selectedSize" (selectionChange)="applyFilters()">
                  <mat-option value="">Todos os tamanhos</mat-option>
                  <mat-option *ngFor="let size of vehicleSizes" [value]="size">{{ size }} passageiros</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="filter-actions">
                <button mat-stroked-button (click)="clearFilters()" color="accent">
                  <mat-icon>clear_all</mat-icon> Limpar Filtros
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Carregando veículos...</p>
      </div>

      <div *ngIf="!loading && vehicles.length === 0" class="no-vehicles">
        <mat-icon>directions_car</mat-icon>
        <p>Nenhum veículo disponível no momento</p>
      </div>

      <div *ngIf="!loading" class="vehicles-grid">
        <mat-card *ngFor="let vehicle of vehicles" class="vehicle-card">
          <img [src]="vehicle.imageUrl || 'assets/default-car.jpg'" [alt]="vehicle.name" class="vehicle-image">
          <mat-card-header>
            <mat-card-title>{{ vehicle.name }}</mat-card-title>
            <mat-card-subtitle>{{ vehicle.year }} • {{ vehicle.type }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Motor:</strong> {{ vehicle.engine }}</p>
            <p><strong>Tamanho:</strong> {{ vehicle.size }}</p>
            <p><strong>Status:</strong>
              <span [class.available]="vehicle.isAvailable" [class.unavailable]="!vehicle.isAvailable">
                {{ vehicle.isAvailable ? 'Disponível' : 'Indisponível' }}
              </span>
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              (click)="reserveVehicle(vehicle._id)"
              [disabled]="!vehicle.isAvailable"
              class="reserve-button">
              <mat-icon>event_seat</mat-icon>
              {{ vehicle.isAvailable ? 'Reservar' : 'Indisponível' }}
            </button>
            <button mat-button color="accent" (click)="viewDetails(vehicle._id)">
              <mat-icon>info</mat-icon> Detalhes
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .vehicles-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    h1 {
      color: #3f51b5;
      font-size: 28px;
      margin: 0;
    }

    .create-vehicle-btn {
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .create-vehicle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    /* Filtros */
    .filters-section {
      margin-bottom: 30px;
    }

    .filters-card {
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      border: 1px solid rgba(102, 126, 234, 0.1);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .filters-card mat-card-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 16px 24px;
    }

    .filters-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .filters-card mat-card-content {
      padding: 24px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filter-field {
      width: 100%;
    }

    .filter-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 56px;
    }

    .filter-actions button {
      width: 100%;
      max-width: 200px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 20px;
    }

    .no-vehicles {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 15px;
      color: #666;
    }

    .no-vehicles mat-icon {
      font-size: 48px;
      color: #999;
    }

    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .vehicle-card {
      transition: transform 0.3s, box-shadow 0.3s;
      border-radius: 12px;
      overflow: hidden;
    }

    .vehicle-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .vehicle-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background-color: #f5f5f5;
    }

    mat-card-header {
      padding: 15px;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 600;
    }

    mat-card-subtitle {
      font-size: 14px;
      color: #666;
    }

    mat-card-content {
      padding: 0 15px 15px;
      font-size: 14px;
    }

    mat-card-content p {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }

    .available {
      color: #4caf50;
      font-weight: 500;
    }

    .unavailable {
      color: #f44336;
      font-weight: 500;
    }

    mat-card-actions {
      padding: 15px;
      display: flex;
      justify-content: space-between;
    }

    .reserve-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .vehicles-grid {
        grid-template-columns: 1fr;
      }

      .filters-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .filters-card mat-card-content {
        padding: 16px;
      }

      .filters-card mat-card-header {
        padding: 12px 16px;
      }
    }

    @media (max-width: 480px) {
      .vehicles-container {
        padding: 16px;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .filters-card mat-card-content {
        padding: 12px;
      }

      .filter-actions button {
        font-size: 12px;
      }
    }
  `]
})
export class VehiclesComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  loading: boolean = true;
  userName: string = '';

  // Filtros
  searchQuery: string = '';
  selectedType: string = '';
  selectedYear: string = '';
  selectedEngine: string = '';
  selectedSize: string = '';

  // Opções para filtros
  vehicleTypes: string[] = ['Hatchback', 'SUV', 'SUV Médio', 'SUV Compacto', 'Crossover', 'Coupé Esportivo', 'Picape Leve', 'Picape Média', 'Sedan Compacto', 'Sedan Médio', 'Sedan Grande', 'Furgão', 'Utilitário Leve', 'Utilitário'];
  vehicleYears: string[] = ['2010', '2016', '2017', '2018', '2019', '2020', '2021'];
  vehicleEngines: string[] = ['1.0', '1.4', '1.5', '1.6', '1.8', '2.0'];
  vehicleSizes: string[] = ['2', '3', '4', '5', '7'];

  // Subject para debounce da busca
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  ngOnInit() {
    this.checkAuth();
    this.loadVehicles();

    // Configurar debounce para busca
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.searchQuery = searchValue;
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkAuth() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  loadVehicles(params?: any) {
    this.loading = true;

    // Se não há filtros, carrega apenas veículos disponíveis
    if (!params || Object.keys(params).every(key => !params[key])) {
      this.apiService.getAvailableVehicles().subscribe({
        next: (response) => {
          this.vehicles = response.vehicles;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar veículos', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
          this.loading = false;
        }
      });
    } else {
      // Se há filtros, usa o endpoint geral com filtros
      this.apiService.getVehicles(params).subscribe({
        next: (response) => {
          // Filtra apenas veículos disponíveis no frontend
          this.vehicles = response.vehicles.filter((vehicle: Vehicle) => vehicle.isAvailable);
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar veículos', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
          this.loading = false;
        }
      });
    }
  }

  reserveVehicle(vehicleId: string) {
    this.apiService.createReservation(vehicleId).subscribe({
      next: (response) => {
        this.snackBar.open('Veículo reservado com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loadVehicles(); // Refresh the list
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao reservar veículo', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  viewDetails(vehicleId: string) {
    this.router.navigate(['/vehicles', vehicleId]);
  }

  onSearchInput(event: any) {
    const searchValue = event.target.value;
    this.searchSubject.next(searchValue);
  }

  applyFilters() {
    const params: any = {};

    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }

    if (this.selectedType) {
      params.type = this.selectedType;
    }

    if (this.selectedYear) {
      params.year = this.selectedYear;
    }

    if (this.selectedEngine) {
      params.engine = this.selectedEngine;
    }

    if (this.selectedSize) {
      params.size = this.selectedSize;
    }

    this.loadVehicles(params);
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedYear = '';
    this.selectedEngine = '';
    this.selectedSize = '';

    this.loadVehicles();
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user && user.role === 'admin';
  }

  createVehicle() {
    console.log('Tentando criar veículo. Usuário é admin?', this.isAdmin());
    if (this.isAdmin()) {
      this.router.navigate(['/vehicles/create']);
    } else {
      this.snackBar.open('Acesso negado. Apenas administradores podem criar veículos.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
