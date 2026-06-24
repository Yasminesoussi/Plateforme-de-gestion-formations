import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {




  verificationStatus: string = 'Vérification en cours...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`http://localhost:3000/apprenant/verify-email?token=${token}`)
        .subscribe({
          next: (res) => {
            this.verificationStatus = 'Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.';
            // Redirection après quelques secondes
            setTimeout(() => this.router.navigate(['/signInUser']), 4000);
          },
          error: (err) => {
            this.verificationStatus = 'Le lien est invalide ou expiré.';
          }
        });
    } else {
      this.verificationStatus = 'Token manquant.';
    }
  }

}
