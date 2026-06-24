import { Component, OnInit } from '@angular/core';
import { AvisServiceService } from 'src/app/services/avis-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { Avis } from 'src/app/models/Avis';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css'],
})
export class AvisComponent implements OnInit {
  titre: string = '';
  contenu: string = '';
  dateExperience: string = '';
  selectedRating: number = 0;
  hoverRating: number = 0;
  isLoggedIn: boolean = false;
  isModalOpen: boolean = false;

  avisList: any[] = []; // Liste des avis
  showAll: boolean = false; // État pour le bouton Voir plus/Voir moins



  constructor(
    private avisService: AvisServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Vérifie si l'utilisateur est connecté
    this.isLoggedIn = !!this.authService.getUser();

    // Charge les avis existants
    this.loadAvis();
    
  }

  loadAvis(): void {
    this.avisService.getAllAvis().subscribe(
      (data: Avis[]) => { // ✅ ici tu dis que data est un tableau d'avis
        console.log('Données reçues :', data);
        this.avisList = data;
      },
      (error) => {
        console.error('Erreur récupération avis:', error);
      }
    );
  }
  

  openModal(): void {
    if (!this.isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour écrire un avis.',
      });
      return;
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  submitAvis(): void {
    if (!this.titre || !this.contenu || !this.dateExperience || this.selectedRating < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs correctement.',
      });
      return;
    }

    const authData = this.authService.getUser();

    if (!authData || !authData.user || !authData.user._id || !authData.user.role) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de récupérer les informations utilisateur.',
      });
      console.error('Erreur AuthService : Données utilisateur manquantes ou invalides', authData);
      return;
    }

    const avisData = {
      titre: this.titre,
      contenu: this.contenu,
      dateExperience: this.dateExperience,
      note: this.selectedRating,
      userId: authData.user._id,
      userRole: authData.user.role
    };

    this.avisService.submitAvis(avisData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Avis soumis !',
          text: 'Merci pour votre retour, votre avis a été enregistré.',
        });
        this.resetForm();
        this.closeModal();
        this.loadAvis();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur s\'est produite lors de l\'envoi de votre avis.',
        });
        console.error(error);
      }
    );
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  resetForm(): void {
    this.titre = '';
    this.contenu = '';
    this.dateExperience = '';
    this.selectedRating = 0;
  }

  // Méthode pour afficher ou masquer les avis supplémentaires
  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  // Méthode pour générer tableau booléens d’étoiles actives/inactives
  getStars(note: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < note);
  }

  // Formatage de la date en français
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
