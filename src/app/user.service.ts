import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) {}

  // Get the JWT token from local storage
  private getToken(): string | null {
    return localStorage.getItem('token'); 
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // getUsers(page: number, limit: number, sortBy: string, sortOrder: string, filter: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', limit.toString())
  //     .set('sortBy', sortBy)
  //     .set('sortOrder', sortOrder)
  //     .set('filter', filter);

  //   return this.http.get<any>(`${this.apiUrl}`, { params, headers: this.getAuthHeaders() });
  // }
  getUsers(page: number, limit: number, sortBy: string, sortOrder: string, filter: string): Observable<any> {
    const token = localStorage.getItem('token'); // Replace with your token retrieval logic
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}`, { headers });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  logout() {
    localStorage.removeItem('token');
  }
}
