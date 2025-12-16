import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <!-- Header Desktop (Topo) -->
    <mat-toolbar color="primary" class="header-toolbar desktop-header" *ngIf="!isMobile">
      <div class="header-content">
        <div class="nav-links">
          <button mat-button routerLink="/vehicles" routerLinkActive="active-link">
            <mat-icon>directions_car</mat-icon> Veículos
          </button>
          <button mat-button routerLink="/reservations" routerLinkActive="active-link">
            <mat-icon>event_note</mat-icon>
            Minhas Reservas
          </button>
          <button mat-button routerLink="/users" routerLinkActive="active-link" *ngIf="isAdmin()">
            <mat-icon>group</mat-icon> Usuários
          </button>
          <button mat-button routerLink="/admin" routerLinkActive="active-link" *ngIf="isAdmin()">
            <mat-icon>admin_panel_settings</mat-icon> Admin
          </button>
        </div>

        <div class="user-actions">
          <!-- <button mat-button routerLink="/profile" routerLinkActive="active-link" class="profile-button">
            <mat-icon>account_circle</mat-icon> Meu Perfil
          </button> -->

          <div class="user-dropdown">
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu" class="user-menu" yPosition="above" xPosition="before" [hasBackdrop]="true">
              <div class="user-info">
                <p><strong>{{ userName }}</strong></p>
                <p>{{ userEmail }}</p>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>account_circle</mat-icon>
                <span>Meu Perfil</span>
              </button>
              <button mat-menu-item routerLink="/vehicles">
                <mat-icon>directions_car</mat-icon>
                <span>Veículos</span>
              </button>
              <button mat-menu-item routerLink="/admin" *ngIf="isAdmin()">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Painel Admin</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Sair</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </mat-toolbar>

    <!-- Header Mobile (Rodapé com Abas) -->
    <div class="mobile-header" *ngIf="isMobile">
      <mat-tab-group [(selectedIndex)]="selectedTab" (selectedTabChange)="onTabChange($event)" class="mobile-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>directions_car</mat-icon>
            <span *ngIf="!isVerySmallScreen()">Veículos</span>
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>event_note</mat-icon>
            <span *ngIf="!isVerySmallScreen()">Reservas</span>
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>account_circle</mat-icon>
            <span *ngIf="!isVerySmallScreen()">Perfil</span>
          </ng-template>
        </mat-tab>

        <mat-tab *ngIf="isAdmin()">
          <ng-template mat-tab-label>
            <mat-icon>admin_panel_settings</mat-icon>
            <span *ngIf="!isVerySmallScreen()">Admin</span>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .header-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; /* Adiciona um contexto de posicionamento */
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      padding: 8px 16px;
      width: 100%;
      height: 60px;
    }



    .nav-links {
      display: flex;
      gap: 8px;
    }

    .nav-links button {
      color: white;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .nav-links button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .active-link {
      background: rgba(255, 255, 255, 0.15);
    }

    .user-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px; /* Opcional: Adiciona espaço entre o botão de perfil e o dropdown */
    }

    .user-button {
      color: white;
      padding: 6px;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .user-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-menu {
      min-width: 240px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      background: white;
    }

    .user-info {
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 6px 6px 0 0;
    }

    .user-info strong {
      font-size: 14px;
      font-weight: 600;
    }

    .user-info p {
      margin: 2px 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .mat-mdc-menu-item {
      font-weight: 500;
    }

    .mat-mdc-menu-item:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .mat-mdc-menu-item mat-icon {
      margin-right: 8px;
      color: #667eea;
    }

    /* Mobile Header Styles */
    .mobile-header {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .mobile-tabs {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .mobile-tabs ::ng-deep .mat-mdc-tab-header {
      border-bottom: none;
      background: transparent;
    }

    .mobile-tabs ::ng-deep .mat-mdc-tab {
      min-width: 25%;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .mobile-tabs ::ng-deep .mat-mdc-tab.mdc-tab--active {
      opacity: 1;
    }

    .mobile-tabs ::ng-deep .mdc-tab__text-label {
      color: white;
      font-size: 10px;
      font-weight: 500;
    }

    /* Telas muito pequenas - apenas ícones */
    @media (max-width: 400px) {
      .mobile-tabs ::ng-deep .mat-mdc-tab {
        min-width: 20%;
        padding: 8px 4px;
      }

      .mobile-tabs ::ng-deep .mdc-tab__text-label {
        display: none;
      }

      .mobile-tabs ::ng-deep .mdc-tab__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 48px;
      }

      .mobile-tabs ::ng-deep .mdc-tab__content mat-icon {
        font-size: 24px;
        color: white;
        margin-bottom: 0;
        display: block;
      }
    }

    .mobile-tabs ::ng-deep .mat-mdc-tab-body-wrapper {
      display: none; /* Esconde o conteúdo das abas */
    }

    .mobile-tabs ::ng-deep .mat-icon {
      color: white;
      font-size: 20px;
      margin-bottom: 2px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-wrap: wrap; /* Permite que os itens quebrem para a próxima linha */
        padding: 8px;
        height: auto; /* Altura automática para acomodar múltiplas linhas */
        gap: 8px;
      }

      .nav-links {
        order: 2; /* Coloca os links de navegação na segunda linha */
        width: 100%; /* Ocupa toda a largura */
        justify-content: space-around; /* Distribui os botões */
      }

      .user-actions {
        order: 1; /* Mantém as ações do usuário na primeira linha */
      }

      .profile-button {
        display: none; /* Esconde o botão "Meu Perfil" com texto em telas menores */
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  isMobile: boolean = false;
  selectedTab: number = 0;
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.checkIfMobile();
    // Carrega informações do usuário no início
    if (this.authService.isAuthenticated()) {
      this.loadUserInfo();
    }

    // Recarrega as informações do usuário sempre que a navegação termina.
    // Isso garante que o header seja atualizado após o login.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Apenas carrega se o usuário estiver autenticado
      if (this.authService.isAuthenticated()) this.loadUserInfo();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  isVerySmallScreen(): boolean {
    return window.innerWidth <= 400;
  }

  loadUserInfo() {
    // This ensures we get the latest user info from the service
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || 'Usuário';
      this.userEmail = user.email || '';
    }
  }

  isAdmin(): boolean {
    console.log('Checking if user is admin');
    const user = this.authService.getUser();
    console.log('user: ', user);
    return user && user.role === 'admin';
  }

  goToHome() {
    this.router.navigate(['/vehicles']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onTabChange(event: any) {
    const routes = ['/vehicles', '/reservations', '/profile', '/admin'];
    const routeIndex = this.isAdmin() ? event.index : Math.min(event.index, 2);
    this.router.navigate([routes[routeIndex]]);
  }
}
