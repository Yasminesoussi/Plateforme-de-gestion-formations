import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  token: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Récupérer le token depuis l'URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    if (!this.newPassword) {
      this.errorMessage = "Veuillez entrer un nouveau mot de passe.";
      return;
    }
  
    console.log("Token:", this.token);
    console.log("Mot de passe envoyé:", this.newPassword);
  
    this.http.post(`http://localhost:3000/formateur/reset-password/${this.token}`, {
      newPassword: this.newPassword
    }).subscribe(
      () => {
        this.message = "Mot de passe réinitialisé avec succès !";
        this.errorMessage = "";
        setTimeout(() => {
          this.router.navigate(['/signInUser']);
        }, 2000);
      },
      (error) => {
        console.error("Erreur backend :", error);
        this.errorMessage = error.error.message || "Une erreur est survenue.";
      }
    );
  }
  
}