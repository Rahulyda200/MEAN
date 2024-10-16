import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  


  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  
    loginUser(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, credentials);
    }

  // getUsers(): Observable<any> {
  //   return this.http.get(this.apiUrl);
  // }
  getUsers(page: number, limit: number, sortBy: string, sortOrder: string, filter: string) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('filter', filter);

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }


  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  // updateUser(id: string, user: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, user);
  // }
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }


  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
