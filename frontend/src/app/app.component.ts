import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container" [class.with-header]="showHeader">
      <app-header *ngIf="showHeader"></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title = 'vehicle-reservation-system';
  showHeader: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeader = this.shouldShowHeader(event.url);
    });
  }

  private shouldShowHeader(url: string): boolean {
    // Don't show header if user is not authenticated
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    // Don't show header on login and register pages
    return !url.startsWith('/login') && !url.startsWith('/register') && !url.startsWith('/welcome');
  }
}
