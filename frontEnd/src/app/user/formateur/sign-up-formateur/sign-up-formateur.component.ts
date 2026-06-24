import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Formateur } from './../../../models/Formateur';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up-formateur',
  templateUrl: './sign-up-formateur.component.html',
  styleUrls: ['./sign-up-formateur.component.css']
})
export class SignUpFormateurComponent {

  cv!: File | null;
  image!: File | null; // Nouveau champ pour l'image
  name!: string;
  email!: string;
  password!: string;
  telephone!: string;
  adresse!: string;
  formateur!: Formateur; 
  specialite: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Fonction pour gérer le changement de fichier pour le CV
  onCvChange(event: any) {
    this.cv = event.target.files[0];
  }

  // Fonction pour gérer le changement de fichier pour l'image
  onImageChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.cv) {
      this.toastr.error('Veuillez sélectionner un CV.', 'Erreur');
      return;
    }
    
    if (!this.image) {
      this.toastr.error('Veuillez sélectionner une image.', 'Erreur');
      return;
    }
  
    // Création du FormData pour envoyer le fichier et les autres informations
    const formData = new FormData();
    formData.append('cv', this.cv);
    formData.append('image', this.image); // Ajout du fichier image
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('telephone', this.telephone);
    formData.append('adresse', this.adresse);
    formData.append('specialite', this.specialite);
  
    this.http.post<any>('http://localhost:3000/formateur/signupFormateur', formData)
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Succès');
          this.router.navigate(['/signInUser']);
        },
        error: (error) => {
          const errorMsg = error?.error?.message || 'Erreur inconnue';
          this.toastr.error(errorMsg, 'Erreur');
          console.error('Erreur:', error);
        }
      });
  }

  ngOnInit(): void {}

}
