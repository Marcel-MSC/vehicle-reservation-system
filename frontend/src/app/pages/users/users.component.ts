import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Gerenciamento de Usuários</h1>
        <button mat-raised-button color="primary" (click)="openCreateUserDialog()">
          <mat-icon>add</mat-icon> Novo Usuário
        </button>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Carregando usuários...</p>
      </div>

      <div *ngIf="!loading" class="table-container">
        <table mat-table [dataSource]="users" class="users-table">
          <!-- Colunas da Tabela -->
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
            <th mat-header-cell *matHeaderCellDef> Data de Criação </th>
            <td mat-cell *matCellDef="let user"> {{ formatDate(user.createdAt) }} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Ações </th>
            <td mat-cell *matCellDef="let user">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openEditUserDialog(user)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="openDeleteUserDialog(user)" title="Excluir">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
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

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 15px;
    }

    .table-container {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .users-table {
      width: 100%;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['name', 'email', 'role', 'createdAt', 'actions'];

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar usuários.', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.loading = false;
      }
    });
  }

  openCreateUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openDeleteUserDialog(user: User) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

@Component({
  selector: 'app-user-dialog',
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
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" placeholder="Nome completo">
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="exemplo@email.com">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="!isEditMode">
          <mat-label>Senha</mat-label>
          <input matInput formControlName="password" type="password" placeholder="Senha">
          <mat-icon matSuffix>lock</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Função</mat-label>
          <mat-select formControlName="role">
            <mat-option value="user">Usuário</mat-option>
            <mat-option value="admin">Admin</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-raised-button (click)="save()" [disabled]="userForm.invalid" color="primary">
        <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon> {{ isEditMode ? 'Salvar' : 'Criar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 10px; /* Adiciona espaço no topo do formulário */
    }

    mat-form-field {
      width: 100%; /* Garante que os campos ocupem toda a largura */
    }
  `]
})
export class UserDialogComponent {
  isEditMode = false;
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['user', Validators.required]
  });

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.mode === 'edit';
    if (this.isEditMode) {
      this.userForm.patchValue(data.user);
      this.userForm.get('password')?.clearValidators(); // Senha não é obrigatória na edição
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  save() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.getRawValue();
    const apiCall = this.isEditMode
      ? this.apiService.updateUser(this.data.user._id, userData)
      : this.apiService.createUser(userData);

    apiCall.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!';
        this.snackBar.open(message, 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Ocorreu um erro', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }
}

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Excluir Usuário</h2>
    <mat-dialog-content>
      <p>Tem certeza que deseja excluir o usuário <strong>{{ data.user?.name }}</strong>?</p>
      <p>Esta ação não pode ser desfeita.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-raised-button (click)="deleteUser()" color="warn">
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
export class DeleteUserDialogComponent {
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteUser() {
    this.apiService.deleteUser(this.data.user._id).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Erro ao excluir usuário', 'Fechar', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }
}
