import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormateurServiceService } from 'src/app/services/formateur-service.service';
import { Formateur } from 'src/app/models/Formateur';
import { SessionFormation } from 'src/app/models/SessionFormation';
import { SessionFormationService } from 'src/app/services/session-formation.service';
import { Formation } from 'src/app/models/Formation';

@Component({
  selector: 'app-details-formateur',
  templateUrl: './details-formateur.component.html',
  styleUrls: ['./details-formateur.component.css']
})
export class DetailsFormateurComponent implements OnInit  {

  formationsAffectees: Formation[] = [];


  formateur!: SessionFormation[]; // Initialisation de formateur avec une valeur null
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private formateurService: FormateurServiceService, // Service pour récupérer le formateur
    private toastr: ToastrService,
    private session: SessionFormationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id']; // Assurez-vous que l'URL contient bien :id
  
      // Récupérer les sessions de formation du formateur
      this.sessionFormateur(this.id);
  
      // Récupérer les formations affectées au formateur
      this.getFormationsAffectees(this.id);
    });
  }


  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  sessionFormateur(id: string): void {
    // Appel du service pour récupérer le formateur par ID
    this.session.getSessionFormateur(id).subscribe({
      next: (data) => {
        this.formateur = data; // Assignation des données reçues à la variable formateur
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la récupération des données.', 'Erreur');
        console.error(err);
      }
    });
  }

  getFormationsAffectees(id: string): void {
    this.formateurService.getFormationsDuFormateur(id).subscribe({
      next: (res) => {
        this.formationsAffectees = res.formations;
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement des formations affectées.');
        console.error(err);
      }
    });
  }
  
}
