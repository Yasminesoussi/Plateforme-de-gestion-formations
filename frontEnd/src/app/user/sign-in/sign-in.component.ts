import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import  axios  from 'axios';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false; 
  constructor(private router: Router, private toastr: ToastrService, private authService: ApprenantServiceService) {}


 

  onSubmit() {
    this.authService.signIn(this.form.email, this.form.password).subscribe({
      next: (res) => {
        if (res) {
          sessionStorage.setItem('auth-user', JSON.stringify(res));
          this.isLoggedIn = true;
          sessionStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));
  
          // 🔥 Message de succès
          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            text: `Bienvenue ${res.user.name}!`,
            timer: 4000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
  
          // Redirection selon rôle
          const role = res.user.role;
          const userId = res.user._id;
          const url = role === "Apprenant"
            ? `http://localhost:3000/apprenant/getById/${userId}`
            : `http://localhost:3000/formateur/getById/${userId}`;
  
          axios.get(url).then(() => {
            this.router.navigate(['/home']);
          });
        }
      },
      error: (err) => {
        const message = err?.error?.message?.toLowerCase?.();
  
        if (message?.includes("formateur") && message?.includes("n'est pas encore activé")) {
          Swal.fire({
            icon: 'warning',
            title: 'Compte inactif',
            text: 'Votre compte formateur n\'est pas encore activé. Veuillez contacter l\'administration.',
            confirmButtonColor: '#ffc107'
          });
        } else if (message?.includes("apprenant") && message?.includes("n'est pas encore activé")) {
          Swal.fire({
            icon: 'warning',
            title: 'Compte inactif',
            text: 'Votre compte apprenant n\'est pas encore activé. Veuillez contacter l\'administration.',
            confirmButtonColor: '#ffc107'
          });
        } else if (message?.includes("identifiants invalides")) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Identifiants invalides. Veuillez réessayer.',
            confirmButtonColor: '#dc3545'
          });
        } else {
          // Cas imprévu
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue. Veuillez réessayer plus tard.',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    });
  }
  
  
  
  
  

}


