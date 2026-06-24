import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = '';
  message: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post<any>('http://localhost:3000/formateur/forgotPassword', { email: this.email })
      .subscribe({
        next: (response) => {
          this.message = response.message;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.error.message || "Une erreur est survenue.";
          this.message = '';
        }
      });
  }
}
