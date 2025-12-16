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
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div mat-card-avatar class="login-avatar">
            <mat-icon>directions_car</mat-icon>
          </div>
          <mat-card-title>Login</mat-card-title>
          <mat-card-subtitle>Sistema de Reserva de Veículos</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <div class="input-wrapper">
                <input type="email" id="email" class="form-input" [(ngModel)]="email" name="email" placeholder="Email" required>
                <mat-icon class="input-icon">email</mat-icon>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <div class="input-wrapper">
                <input [type]="hidePassword ? 'password' : 'text'" id="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Senha" required>
                <button type="button" class="icon-button" (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </div>
            </div>

            <div class="button-group">
              <button mat-raised-button color="primary" type="submit" class="login-button">
                <mat-icon>login</mat-icon> Entrar
              </button>
              <button mat-button color="accent" type="button" (click)="goToRegister()" class="register-button">
                <mat-icon>person_add</mat-icon> Cadastre-se
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      background: rgba(255, 255, 255, 0.95);
    }

    .login-avatar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0 auto 20px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
      padding: 32px 32px 0 32px;
    }

    mat-card-title {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      font-size: 16px;
      color: #666;
      font-weight: 400;
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-content {
      padding: 0 32px 32px 32px;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
    }

    .login-button, .register-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .login-button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 24px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .register-button {
      background: transparent;
      color: #667eea;
      font-weight: 500;
      font-size: 14px;
      padding: 10px 20px;
      border: 2px solid #667eea;
    }

    .register-button:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    /* Plain HTML Form Styling */
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

    .input-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #667eea;
    }

    .icon-button {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
    }

    ::ng-deep .mat-icon {
      color: #667eea;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  onSubmit() {
    if (!this.email || !this.password) {
      this.snackBar.open('Por favor, preencha todos os campos', 'Fechar', {
        duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
      });
      return;
    }

    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token); // Salva o token
        localStorage.setItem('user', JSON.stringify(response.user)); // Salva o objeto de usuário completo
        this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
          duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
        });
        this.router.navigate(['/vehicles']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao fazer login', 'Fechar', {
          duration: 3000, verticalPosition: 'top', horizontalPosition: 'right'
        });
        this.snackBar.open(error.error?.error || 'Erro ao fazer login', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
