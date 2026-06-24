import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificat } from '../models/Certificat';

const apiUrl = 'http://localhost:3000/certificat';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les certificats depuis l'API
   * @returns Observable des certificats
   */
  
  getAllCertifs(): Observable<Certificat[]> {
  return this.http.get<Certificat[]>(`${apiUrl}/getAllCertifs`);
}


  deleteCertificat(id: string):Observable<Certificat>{
    return this.http.delete<Certificat>(`${apiUrl}/certificatSupp/${id}`);
  }

  getFilteredCertificates(search: string): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(`${apiUrl}/getFilteredCertificates`, {
      params: { search }
    });
  }


  
}
