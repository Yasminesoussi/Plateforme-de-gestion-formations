import { Component, OnInit } from '@angular/core';
import { AvisServiceService } from 'src/app/services/avis-service.service'; // Service pour gérer les appels API
import { ToastrService } from 'ngx-toastr'; // Pour afficher des notifications
import Swal from 'sweetalert2';

@Component({
  selector: 'app-avis-admin',
  templateUrl: './avis-admin.component.html',
  styleUrls: ['./avis-admin.component.css'],
})
export class AvisAdminComponent implements OnInit {
  avisList: any[] = []; // Liste des avis
  responseText: string = ''; // Texte de réponse
  selectedAvis: any = null; // Avis sélectionné pour répondre
  isLoading: boolean = false; // Indicateur de chargement

  constructor(private avisService: AvisServiceService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchAvis(); // Charger les avis à l'initialisation
  }

  // Charger la liste des avis
  fetchAvis(): void {
    this.isLoading = true;
    this.avisService.getAllAvis().subscribe(
      (response: any) => {
        this.avisList = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
        this.toastr.error('Erreur lors de la récupération des avis.');
        this.isLoading = false;
      }
    );
  }

  // Ouvrir le modal pour répondre à un avis
  openResponseModal(avis: any): void {
    this.selectedAvis = avis;
    this.responseText = avis.response || ''; // Pré-remplir avec la réponse existante si disponible
    const modal = document.getElementById('responseModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  // Fermer le modal
  closeModal(): void {
    const modal = document.getElementById('responseModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    this.responseText = '';
    this.selectedAvis = null;
  }

  // Envoyer une réponse
  submitResponse(): void {
    if (!this.selectedAvis || !this.responseText.trim()) {
      this.toastr.warning('La réponse ne peut pas être vide.');
      return;
    }

    const payload = {
      avisId: this.selectedAvis._id,
      response: this.responseText,
    };

    this.avisService.respondToAvis(payload).subscribe(
      (response: any) => {
        this.toastr.success('Réponse envoyée avec succès.');
        this.fetchAvis(); // Mettre à jour la liste des avis
        this.closeModal();
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de la réponse:', error);
        this.toastr.error('Erreur lors de l\'envoi de la réponse.');
      }
    );
  }



  deleteAvis(id: string): void {
    this.avisService.deleteAvis(id).subscribe(() => {
      this.toastr.success("Success", "Avis supprimé");
      this.fetchAvis(); // recharge la liste après suppression
    });
  }


  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cet avis ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAvis(id);
        Swal.fire('Supprimée !', 'L avis  a bien été supprimée.', 'success');
      }
    });
  }
}
