import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>🚗 Sistema de Reserva de Veículos</h1>
      <p>Bem-vindo ao sistema de gestão de reservas de veículos.</p>
      <div class="info">
        <h3>Backend API:</h3>
        <ul>
          <li>✅ Node.js + TypeScript + Express</li>
          <li>✅ MongoDB com Mongoose</li>
          <li>✅ Autenticação JWT</li>
          <li>✅ CRUD de Usuários, Veículos e Reservas</li>
          <li>✅ Validação e tratamento de erros</li>
        </ul>

        <h3>Frontend:</h3>
        <ul>
          <li>⏳ Angular 18 (em desenvolvimento)</li>
          <li>⏳ Material Design</li>
          <li>⏳ Interface responsiva</li>
        </ul>
      </div>

      <div class="actions">
        <h3>Como executar:</h3>
        <ol>
          <li>Configure o MongoDB localmente</li>
          <li>Execute: <code>cd backend && npm install && npm run dev</code></li>
          <li>Execute: <code>cd frontend && npm install && npm start</code></li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }

    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
    }

    .info, .actions {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    h3 {
      color: #495057;
      margin-top: 0;
    }

    ul, ol {
      padding-left: 2rem;
    }

    li {
      margin: 0.5rem 0;
    }

    code {
      background: #e9ecef;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }

    .status-ok {
      color: #28a745;
    }

    .status-progress {
      color: #ffc107;
    }
  `]
})
export class WelcomeComponent {
  title = 'Sistema de Reserva de Veículos';
}
