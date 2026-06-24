import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avis } from '../models/Avis';
@Injectable({
  providedIn: 'root'
})
export class AvisServiceService {
  private apiUrl = 'http://localhost:3000/avis'; 

  constructor(private http: HttpClient) {}

  // Soumettre un avis
  submitAvis(avis: any): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/avisadd`, avis);
  }

  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/getAllAvis`);
  }
  
  

   // Répondre à un avis
   respondToAvis(payload: { avisId: string; response: string }): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/respond`, payload);
  }


  deleteAvis(id: string):Observable<Avis>{
    return this.http.delete<Avis>(`${this.apiUrl}/avisSupp/${id}`);
  }
}
