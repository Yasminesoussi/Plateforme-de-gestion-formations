import { Formation } from './../models/Formation';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../models/Payment';


const apiUrl = 'http://localhost:3000/payment';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { 
  }

  getPayment(id: any,):Observable<Payment[]>{
    return this.http.get<any[]>(`${apiUrl}/getPayment/${id}`);
  }

  getAllPayments(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/getAllPayments`);  // Assurez-vous que l'URL de votre API correspond à la bonne route
  }
  

  getAllFormation(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/formationAll`);
  }

  addPayment(apprenantId: string, formationId: string, tranches: { montant_tranche: number}) {
    return this.http.post<any>(`${apiUrl}/${apprenantId}/addPayment/${formationId}`, { tranches });

  }
  
}
