import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

const apiUrl = 'http://localhost:3000/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  constructor(private http:HttpClient) { 

  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${apiUrl}/categoryupdate/${id}`, category);
}



  deleteCategory(id: string):Observable<Category>{
    return this.http.delete<Category>(`${apiUrl}/categoryDelete/${id}`);
  }


  getById(id: any):Observable<Category>{
    return this.http.get<Category>(`${apiUrl}/categorygetById/${id}`);
  }

 
  getAllCategorys(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/categoryGet`);
  }


  createCategory(categoryData: Category): Observable<Category>{
    return this.http.post<Category>(`${apiUrl}/categoryAdd` , categoryData);
  }
}
