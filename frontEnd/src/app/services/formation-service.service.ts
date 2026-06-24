import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Formation } from '../models/Formation';

const apiUrl = 'http://localhost:3000/formation';
@Injectable({
  providedIn: 'root'
})
export class FormationServiceService {

  constructor(private http:HttpClient) { 

  }

  getAllFormation(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/formationAll`);
  }


  createFormation(formationData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrl}/formationAdd`, formationData);
  }
  

  updateFormation(id: string, formationData: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${apiUrl}/formationUpdate/${id}`, formationData);
  }

  getById(id: any):Observable<Formation>{
    return this.http.get<Formation>(`${apiUrl}/formationgetById/${id}`);
  }

  getByCategory(category: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${apiUrl}/formationByCategory/${category}`);
  }
  
  

  
  deleteFormation(id: string):Observable<Formation>{
    return this.http.delete<Formation>(`${apiUrl}/formationsSupp/${id}`);
  }

  likeFormation(formationId: string, apprenantId: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}/${formationId}/${apprenantId}/like`, {});
  }
  
  dislikeFormation(formationId: string, apprenantId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/${formationId}/${apprenantId}/dislike`);
  }

  

}