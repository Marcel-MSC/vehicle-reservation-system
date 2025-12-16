import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="create-vehicle-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()" title="Voltar">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Criar Novo Veículo</h1>
      </div>

      <mat-card class="create-form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>directions_car</mat-icon> Informações do Veículo
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="vehicleForm" (ngSubmit)="createVehicle()" class="vehicle-form">

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nome do Veículo</mat-label>
                <input matInput formControlName="name" placeholder="Ex: Ford Ká Hatch">
                <mat-icon matSuffix>directions_car</mat-icon>
                <mat-error *ngIf="vehicleForm.get('name')?.hasError('required')">
                  Nome é obrigatório
                </mat-error>
                <mat-error *ngIf="vehicleForm.get('name')?.hasError('minlength')">
                  Nome deve ter pelo menos 2 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Ano</mat-label>
                <input matInput formControlName="year" placeholder="Ex: 2019" maxlength="4">
                <mat-icon matSuffix>calendar_today</mat-icon>
                <mat-error *ngIf="vehicleForm.get('year')?.hasError('required')">
                  Ano é obrigatório
                </mat-error>
                <mat-error *ngIf="vehicleForm.get('year')?.hasError('pattern')">
                  Ano deve ter 4 dígitos
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Tipo de Veículo</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="">Selecione o tipo</mat-option>
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
                  <mat-option value="Hatchback Esportivo">Hatchback Esportivo</mat-option>
                </mat-select>
                <mat-error *ngIf="vehicleForm.get('type')?.hasError('required')">
                  Tipo é obrigatório
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Motor</mat-label>
                <input matInput formControlName="engine" placeholder="Ex: 1.0, 1.6, 2.0">
                <mat-icon matSuffix>build</mat-icon>
                <mat-error *ngIf="vehicleForm.get('engine')?.hasError('required')">
                  Motor é obrigatório
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Capacidade (passageiros)</mat-label>
                <input matInput formControlName="size" placeholder="Ex: 5" type="number" min="1" max="10">
                <mat-icon matSuffix>people</mat-icon>
                <mat-error *ngIf="vehicleForm.get('size')?.hasError('required')">
                  Capacidade é obrigatória
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>URL da Imagem (opcional)</mat-label>
                <input matInput formControlName="imageUrl" placeholder="http://...">
                <mat-icon matSuffix>image</mat-icon>
              </mat-form-field>
            </div>

            <div class="button-group">
              <button mat-raised-button color="primary" type="submit" [disabled]="vehicleForm.invalid || loading">
                <mat-icon>add</mat-icon> Criar Veículo
              </button>
              <button mat-button color="accent" type="button" (click)="goBack()">
                <mat-icon>cancel</mat-icon> Cancelar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-vehicle-container {
      max-width: 1000px;
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

    .create-form-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .create-form-card mat-card-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px 24px;
      border-radius: 16px 16px 0 0;
    }

    .create-form-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
    }

    .create-form-card mat-card-content {
      padding: 32px 24px;
    }

    .vehicle-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .form-field {
      width: 100%;
    }

    .button-group {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .create-button, .cancel-button {
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      min-width: 160px;
    }

    .create-button {
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }

    .create-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
    }

    .cancel-button {
      background: transparent;
      color: #f44336;
      border: 2px solid #f44336;
    }

    .cancel-button:hover {
      background: rgba(244, 67, 54, 0.1);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .create-vehicle-container {
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

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .create-form-card mat-card-content {
        padding: 24px 16px;
      }

      .button-group {
        flex-direction: column;
        align-items: center;
      }

      .create-button, .cancel-button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class CreateVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  loading: boolean = false;

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  constructor() {
    this.vehicleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      type: ['', Validators.required],
      engine: ['', Validators.required],
      size: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    // Verificar se usuário tem permissão (admin)
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getUser();
    if (!user || user.role !== 'admin') {
      this.snackBar.open('Acesso negado. Apenas administradores podem criar veículos.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.router.navigate(['/vehicles']);
      return;
    }
  }

  createVehicle() {
    if (this.vehicleForm.valid) {
      this.loading = true;

      const vehicleData = {
        name: this.vehicleForm.value.name,
        year: this.vehicleForm.value.year,
        type: this.vehicleForm.value.type,
        engine: this.vehicleForm.value.engine,
        size: this.vehicleForm.value.size.toString(),
        imageUrl: this.vehicleForm.value.imageUrl || undefined
      };

      this.apiService.createVehicle(vehicleData).subscribe({
        next: (response) => {
          this.snackBar.open('Veículo criado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
          this.router.navigate(['/vehicles']);
        },
        error: (error) => {
          this.snackBar.open(error.error?.error || 'Erro ao criar veículo', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/vehicles']);
  }
}
