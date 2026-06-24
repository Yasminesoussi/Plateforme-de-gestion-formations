import { HttpClient } from '@angular/common/http';
import { TmplAstHoverDeferredTrigger } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Formateur } from '../models/Formateur';
import { Formation } from '../models/Formation';

const apiUrl = 'http://localhost:3000/formateur';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class FormateurServiceService {

  constructor(private http:HttpClient) { 

  }

  saveUser(user: any) {
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  

  getAllFormateurs(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/getAllFormateurs`);
  }

  affecterFormation(formateurId: string, formationId:string): Observable<any> {
    return this.http.post<any>(`${apiUrl}/AffecterFormationAFormateur`, {formateurId, formationId});
}


updateProfile(id: string, data: any) {
  return this.http.put(`${apiUrl}/editProfile/${id}`, data);
}


getFormateurBFormation(formationId: string): Observable<Formateur[]>{
  if(!formationId){
    return throwError(() => new Error ('formation id is required'));
  }

  return this.http.get<Formateur[]>(`${apiUrl}/getFormateurByFormation/${formationId}`)
}


downloadCvByFormateur(id: string) {
  return this.http.get(`${apiUrl}/downloadcv/${id}`,{responseType:'blob'});
}

activateFormateur(formateurId: string): Observable<any> {
  return this.http.post(`${apiUrl}/${formateurId}/activate`, {});
}



updateCv(formateurId: string, cvFile: File): Observable<any> {
  const formData = new FormData();
  formData.append('cv', cvFile);
  return this.http.put(`${apiUrl}/${formateurId}/cv`, formData);
}



getFormateurById(id: string): Observable<any> {
  return this.http.get(`${apiUrl}/getbyId/${id}`);
}

getFormationsDuFormateur(id: string) {
  return this.http.get<{ formations: Formation[] }>(`${apiUrl}/formations/${id}`);
}




getFilteredFormateurs(name: string): Observable<Formateur[]> {
  return this.http.get<Formateur[]>(`${apiUrl}/filterFormateur`, {
    params: { name }
  });
}



}