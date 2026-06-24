import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';

@Component({
  selector: 'app-profile-apprenant',
  templateUrl: './profile-apprenant.component.html',
  styleUrls: ['./profile-apprenant.component.css']
})
export class ProfileApprenantComponent implements OnInit {

  user: any = { _id: '', name: '', email: '', telephone: '', adresse: '' };
  formations: any[] = [];


 

  constructor(private ApprenantService: ApprenantServiceService, private ToastrService: ToastrService) {}

  ngOnInit(): void {
    const authData = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
    if (authData && authData.user) {
      this.user = authData.user;
      this.loadFormations();
    }
  }
  

  get imageUrl(): string | null {
    if (this.user.role === 'Apprenant' && this.user.image?.path) {
      // Nettoyer le chemin Windows et construire l'URL
      const cleanPath = this.user.image.path.replace(/\\/g, '/').split('uploads')[1];
      return `http://localhost:3000/uploads${cleanPath}`;
    }
    return null;
  }
  


  loadFormations(): void {
    this.ApprenantService.getFormationsByApprenantId(this.user._id).subscribe(
      (formations) => {
        this.formations = formations;
      },
      (error) => {
        this.ToastrService.error('Erreur lors du chargement des formations.', 'Erreur');
      }
    );
  }


  updateProfile(): void {
    console.log('Données envoyées :', this.user);
  
    if (!this.user._id || !this.user.name || !this.user.email) {
      this.ToastrService.error('Erreur : Nom ou Email manquant !', 'Erreur');
      return;
    }
  
    this.ApprenantService.updateProfile(this.user._id, {
      name: this.user.name,
      email: this.user.email,
      telephone: this.user.telephone,
      adresse: this.user.adresse
    }).subscribe(
      response => {
        const authData = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
        if (authData && authData.token) {
          // Mettre à jour uniquement les infos du user
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
