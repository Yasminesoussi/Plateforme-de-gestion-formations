import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:3000';

  constructor( private http: HttpClient) { }

  loginAdmin(email: string, password: string):  Observable<any>{
    return this.http.post(
      'http://localhost:3000/admin/signIn',
      {
        email,
        password
      }
    )
}


updateProfile(id: string, data: any) {
  return this.http.put(`http://localhost:3000/admin/editProfile/${id}`, data);
}


saveUser(user: any, type: 'admin' | 'formateur') {
  const storage = type === 'admin' ? localStorage : sessionStorage;
  storage.setItem('auth-user', JSON.stringify(user));
}


getUser(): any {
  let user = sessionStorage.getItem('auth-user');
  if (!user) {
    user = localStorage.getItem('auth-user');
  }
  return user ? JSON.parse(user) : null;
}


isAuthenticated(): boolean {
  return !!this.getUser();
}




changePassword(id: string, currentPassword: string, newPassword: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/formateur/changePassword/${id}`, { currentPassword, newPassword });
}


private api = 'http://localhost:3000/admin';


getNotifications() {
  return this.http.get<any[]>(`${this.api}/notifications`);
}

markNotificationsAsRead(notificationIds: string[]) {
  return this.http.patch(`${this.api}/notifications/read`, { ids: notificationIds });
}


clearNotifications() {
  return this.http.delete(`${this.api}/notifications/clear`);
}

}



