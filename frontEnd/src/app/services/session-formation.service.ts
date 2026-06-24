import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { SessionFormation } from '../models/SessionFormation';

const apiUrl = 'http://localhost:3000/session';
@Injectable({
  providedIn: 'root'
})
export class SessionFormationService {

  constructor(private http:HttpClient) { }


  addSession(sessionData: SessionFormation): Observable<any> {
    return this.http.post<any>('http://localhost:3000/session/addSessionFormation', sessionData);
  }

  getAllSessions(): Observable<SessionFormation[]> {
    return this.http.get<SessionFormation[]>(`${apiUrl}/allSessions`);
  }

  
getSessionFormateur(id: string): Observable<any> {
  return this.http.get(`${apiUrl}/getSessionByFormateur/${id}`);
}


deleteSession(id: string):Observable<SessionFormation>{
  return this.http.delete<SessionFormation>(`${apiUrl}/SessionSupp/${id}`);
}
}
