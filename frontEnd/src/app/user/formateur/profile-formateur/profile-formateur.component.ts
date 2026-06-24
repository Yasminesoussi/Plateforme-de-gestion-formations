import { Component, OnInit } from '@angular/core';
import {  FormateurServiceService } from 'src/app/services/formateur-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile-formateur',
  templateUrl: './profile-formateur.component.html',
  styleUrls: ['./profile-formateur.component.css']
})
export class ProfileFormateurComponent implements OnInit{

  user: any = { _id: '', name: '', email: '' , telephone:'' , adresse:''};
  constructor(private FormateurService: FormateurServiceService, private ToastrService: ToastrService) {}

  ngOnInit(): void {
    const authData = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
    if (authData && authData.user) {
      this.user = authData.user;
    }
  }


  get imageUrl(): string | null {
    if (this.user.role === 'formateur' && this.user.image?.path) {
      const cleanPath = this.user.image.path.replace(/\\/g, '/').split('/uploads/')[1]; // <- correction ici
      return `http://localhost:3000/uploads/${cleanPath}`;
    }
    return null;
  }
  

  updateProfile(): void {
    console.log('Données envoyées :', this.user);

    if (!this.user._id || !this.user.name || !this.user.email) {
      this.ToastrService.error('Nom ou Email manquant !', 'Erreur');
      return;
    }

    this.FormateurService.updateProfile(this.user._id, {
      name: this.user.name,
      email: this.user.email,
      telephone: this.user.telephone,
      adresse: this.user.adresse
    }).subscribe(
      response => {
        const authData = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
        if (authData && authData.token) {
          // Mettre à jour uniquement les infos du formateur
          authData.user = { ...authData.user, ...response };
          sessionStorage.setItem('auth-user', JSON.stringify(authData));

          // Mettre à jour aussi this.user localement
          this.user = authData.user;

          this.ToastrService.success('Profil mis à jour avec succès !', 'Succès');
        }
      },
      error => {
        console.error('Erreur mise à jour :', error);
        this.ToastrService.error('Erreur lors de la mise à jour du profil.', 'Erreur');
      }
    );
  }
}
