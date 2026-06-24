import { Apprenant } from './../models/Apprenant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const apiUrl = 'http://localhost:3000/apprenant';
@Injectable({
  providedIn: 'root'
})
export class ApprenantServiceService {

  constructor(private http:HttpClient) { 

  }

  getAllApprenants(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/getAllApprenants`);
  }


  
  signIn( email: string,password: string ): Observable<any> {
    return this.http.post<any>(`${apiUrl}/signIn`, {email,password});
}


signUp(apprenantData : FormData): Observable<Apprenant> {
  return this.http.post<Apprenant>(`${apiUrl}/signupApprenant` , apprenantData);

}

estInscritFormation(apprenantId: string, formationId: string): Observable<any> {
  return this.http.get<any>(
    `${apiUrl}/${apprenantId}/formations/${formationId}/est-inscrit`
  );
}



inscrireApprenantFormation(apprenantId: string, formationId: string): Observable<any> {
  return this.http.post<any>(
    `${apiUrl}/${apprenantId}/formations/${formationId}/enroll/`,
    {}
  );
}

desinscrireApprenantFormation(apprenantId: string, formationId: string) {
  return this.http.post<any>(
    `${apiUrl}/${apprenantId}/formations/${formationId}/unenroll/`,
    {}
  );
}


updateProfile(id: string, data: any) {
  return this.http.put(`${apiUrl}/editProfile/${id}`, data);
}


changePassword(id: string, currentPassword: string, newPassword: string): Observable<any> {
  return this.http.put(`${apiUrl}/changePassword/${id}`, { currentPassword, newPassword });
}


getUser(): any {
  let user = sessionStorage.getItem('auth-user');
  if (!user) {
    user = localStorage.getItem('auth-user');
  }
  return user ? JSON.parse(user) : null;
}


getFormationsByApprenantId(apprenantId: string): Observable<any[]> {
  return this.http.get<any[]>(`${apiUrl}/${apprenantId}/formations`);
}


sendMessage(data: { name: string; email: string; message: string }): Observable<any> {
  return this.http.post(`${apiUrl}/contact`, data);
}

getFilteredApprenants(name: string): Observable<Apprenant[]> {
  return this.http.get<Apprenant[]>(`${apiUrl}/filter`, {
    params: { name }
  });
}



}

