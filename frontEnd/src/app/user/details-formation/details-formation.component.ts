import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/models/Formation';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service'; 
import { AuthServiceService } from './../../services/auth-service.service';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css']
})
export class DetailsFormationComponent implements OnInit {
  formationId!: string | null;
  formation!: Formation;
  apprenantId!: string; // ID de l'apprenant connecté
  isInscrit: boolean = false;

  constructor(
    private forService: FormationServiceService,
    private route: ActivatedRoute,
    private apprenantService: ApprenantServiceService,
    public authService: AuthServiceService

  ) {}



  getUser() {
    return this.authService.getUser();
  }

  
  desinscrireApprenant(): void {
    if (!this.apprenantId || !this.formationId) return;

    this.apprenantService.desinscrireApprenantFormation(this.apprenantId, this.formationId!)
      .subscribe({
        next: (res) => {
          this.isInscrit = false;
          Swal.fire('Succès', res.message, 'success');
        },
        error: (err) => {
          Swal.fire('Erreur', err.error.message, 'error');
          console.error(err);
        }
      });
  }

  ngOnInit(): void {
    this.formationId = this.route.snapshot.paramMap.get('id');
    
    // Récupération des données de la formation, indépendamment de l'état de connexion
    if (this.formationId) {
      this.forService.getById(this.formationId).subscribe(
        data => {
          this.formation = data;
          console.log('Données de formation reçues:', data); // Ajouté pour vérifier les données
  
          // Vérification de l'inscription uniquement si l'utilisateur est connecté
          const user = this.authService.getUser();
          if (user) {
            this.apprenantId = user.user._id; // Récupérer l'ID de l'apprenant si connecté
            this.apprenantService.estInscritFormation(this.apprenantId, this.formationId!).subscribe(
              (res: any) => {
                this.isInscrit = res.estInscrit; // true ou false
              },
              error => console.error("Erreur lors de la vérification d'inscription :", error)
            );
          }
        },
        error => {
          console.error("Erreur lors de la récupération de la formation :", error);
        }
      );
    }
  }

  formatDate(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);
  }
  

  inscrireApprenant(): void {
    if (!this.apprenantId || !this.formationId) return;

    this.apprenantService.inscrireApprenantFormation(this.apprenantId, this.formationId!)
      .subscribe({


        next: (res) => {
          this.isInscrit = true; // ✅ force le bouton à se mettre à jour
          Swal.fire('Succès', res.message, 'success');
        },
        error: (err) => {
          this.isInscrit = false;
          Swal.fire('Erreur', err.error.message, 'error');
          console.error(err);
        }
      });
  }









}



