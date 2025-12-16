import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
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
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div mat-card-avatar class="register-avatar">
            <mat-icon>person_add</mat-icon>
          </div>
          <mat-card-title>Cadastro</mat-card-title>
          <mat-card-subtitle>Crie sua conta</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="register-form">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nome</mat-label>
              <input matInput type="text" [(ngModel)]="name" name="name" required>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div class="button-group">
              <button mat-raised-button color="primary" type="submit" class="register-button">
                <mat-icon>check</mat-icon> Cadastrar
              </button>
              <button mat-button color="accent" type="button" (click)="goToLogin()" class="login-button">
                <mat-icon>login</mat-icon> Já tenho conta
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .register-avatar {
      background-color: #4caf50;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    .register-button {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .login-button {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    mat-card-header {
      text-align: center;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
    }

    mat-card-subtitle {
      font-size: 14px;
      color: #666;
    }
  `]
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.snackBar.open('Por favor, preencha todos os campos', 'Fechar', {
        duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
      });
      return;
    }

    this.apiService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
        });
        this.router.navigate(['/vehicles']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao fazer cadastro', 'Fechar', {
          duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
        });
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
