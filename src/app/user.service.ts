import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Socket } from 'ngx-socket-io';

interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string[];
}
interface Message {
  sender: string;
  receiver: string; 
  content: string;
  timestamp?: string;
  type: 'text' | 'image'; 
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrl = 'http://localhost:3000/api/users'; 
  private messages: Message[] = [];

  constructor(private http: HttpClient, private socket: Socket) {
    this.loadMessages();
  }

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

  // API calls

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
 

  

  // loginUser(credentials: { email: string; password: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials);
  // }
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming response includes token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user data
      })
    );
  }
  

  getUsers(page: number, limit: number, sortBy: string, sortOrder: string, filter: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}`, { headers });
  }
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
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

  // Socket.IO functionality

  joinRoom(roomId: string, userId: string) {
    this.socket.emit('join', { roomId, userId });
  }
  // joinChatRoom(userId: string) {
  //   this.socket.emit('login', userId); // Join user's socket room
  // }


  
  //   receiveMessages(): Observable<any> {
    //     return this.socket.fromEvent('chat message');
    //   }

    //   sendMessage(message: string, roomId: string, sender: string) {
    //     this.socket.emit('chat message', { message, roomId, sender });
    // }
// sendMessage(message: string, recipientId: string, senderId: string) {
//   this.socket.emit('chat message', { message, roomId: recipientId, sender: senderId });
// }
// sendMessage(message: { sender: string, receiverId: string, message: string }) {
//   this.socket.emit('chat message', message); // Send a message
// }
// UserService
sendMessage(messageData: any): Observable<void> {
  return new Observable<void>((observer) => {
      this.socket.emit('chat message', messageData, (response: any) => {
          if (response.success) {
              observer.next();
              observer.complete();
          } else {
              observer.error(response.error);
          }
      });
  });
}




// receiveMessages(): Observable<any> {
//   return this.socket.fromEvent('chat message');
// }
  // Listen for events when a user disconnects
  // onDisconnect(): Observable<any> {
  //   return this.socket.fromEvent('disconnect');
  // }
  // getLoggedInUserName(): string {
  //   const userData = JSON.parse(localStorage.getItem('user') || '{}'); // Assuming user data is stored in localStorage
  //   return userData.name || 'Unknown User'; // Return the name or a fallback
  // }
  // UserService updates

getLoggedInUserName(): string {
  const userData = localStorage.getItem('user'); 
  if (userData) {
    const parsedData = JSON.parse(userData); 
    return parsedData.name || 'Unknown User'; 
  }
  return 'Unknown User'; 
}

 receiveMessages() {
    return this.socket.fromEvent('chat message'); // Make sure this is the same event name used in the server
  }

 

  joinChatRoom(roomId: string) {
    this.socket.emit('login', roomId); // Make sure this event is sent correctly
  }

  onDisconnect() {
    return this.socket.fromEvent('disconnect'); // Ensure this is used for handling disconnection
  }

 

  saveMessage(message: Message) {
    this.messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(this.messages)); // Save to local storage
  }

  loadMessages() {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
    return this.messages;
  }

  clearMessages() {
    this.messages = [];
    localStorage.removeItem('chatMessages'); // Clear local storage
  }


  
}
