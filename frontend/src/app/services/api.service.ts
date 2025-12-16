import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor() { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Auth methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`, { headers: this.getHeaders() });
  }

  updateProfile(name: string, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile`, { name, email }, { headers: this.getHeaders() });
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/profile`, { headers: this.getHeaders() });
  }

  // User management methods (admin)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/users`, { headers: this.getHeaders() });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/users`, data, { headers: this.getHeaders() });
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/users/${id}`, data, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/users/${id}`, { headers: this.getHeaders() });
  }

  // Vehicle methods
  getVehicles(params?: any): Observable<any> {
    const httpParams = params ? new URLSearchParams(params).toString() : '';
    const url = httpParams ? `${this.apiUrl}/vehicles?${httpParams}` : `${this.apiUrl}/vehicles`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getAvailableVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicles/available`, { headers: this.getHeaders() });
  }

  createVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicles`, vehicleData, { headers: this.getHeaders() });
  }

  updateVehicle(id: string, vehicleData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/vehicles/${id}`, vehicleData, { headers: this.getHeaders() });
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicles/${id}`, { headers: this.getHeaders() });
  }

  getVehicleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicles/${id}`, { headers: this.getHeaders() });
  }

  // Reservation methods
  createReservation(vehicleId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations`, { vehicleId }, { headers: this.getHeaders() });
  }

  getUserReservations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations/my-reservations`, { headers: this.getHeaders() });
  }

  releaseReservation(reservationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservations/${reservationId}/release`, {}, { headers: this.getHeaders() });
  }

  cancelReservation(reservationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservations/${reservationId}/cancel`, {}, { headers: this.getHeaders() });
  }
}
