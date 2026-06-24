import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Salle } from '../models/Salle';


const apiUrl = 'http://localhost:3000/salle';
@Injectable({
  providedIn: 'root'
})
export class SalleService {

  constructor(private http:HttpClient) { }



   // 🔹 Ajouter une salle
   ajouterSalle(salleData: any): Observable<any> {
    return this.http.post(`${apiUrl}/ajouterSalle`, salleData);
  }

  // 🔹 Récupérer toutes les salles
  getSalles(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/getSalles`);
  }


  
  deleteSalle(id: string):Observable<Salle>{
    return this.http.delete<Salle>(`${apiUrl}/suppSalle/${id}`);
  }

  affecterSalle(salleId: string, sessionId: string): Observable<any> {
    return this.http.put(`${apiUrl}/affecterSalle`, {
      salleId,
      sessionId
    });
  }
}

