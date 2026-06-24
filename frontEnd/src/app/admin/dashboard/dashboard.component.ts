
import { SessionFormation } from './../../models/SessionFormation';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { Component, OnInit } from '@angular/core';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import { FormateurServiceService } from 'src/app/services/formateur-service.service';
import { SessionFormationService } from 'src/app/services/session-formation.service';
import { SalleService } from 'src/app/services/salle.service';
import { AvisServiceService } from 'src/app/services/avis-service.service';
import { CertificatService } from 'src/app/services/certificat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit {



  apprenantCount: number = 0;
  categoryCount: number = 0;
  formationCount: number = 0;
  formateurCount: number =0;
 SessionCount: number =0;
 salleCount: number =0;
 avisCount: number =0;
 certificatCount: number =0;

  constructor (private apprenantService: ApprenantServiceService , private categoryService: CategoryServiceService , private formationService: FormationServiceService , private formateurService: FormateurServiceService , private SessionFormation: SessionFormationService , private SalleService: SalleService , private AvisService: AvisServiceService , private CertificatService: CertificatService ){}

  ngOnInit() {
    this.countApprenants();
    this.countCategories();
    this.countFormations();
    this.countFormateurs();
    this.countSessions();
    this.countSalles();
    this.countAvis();
    this.countCertificat();
  }




  countCertificat() {
    this.CertificatService.getAllCertifs().subscribe({
      next: data => {
        this.certificatCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des certifs:', err.error.message);
      }
    });
  }



  countAvis() {
    this.AvisService.getAllAvis().subscribe({
      next: data => {
        this.avisCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des avis:', err.error.message);
      }
    });
  }




  countSalles() {
    this.SalleService.getSalles().subscribe({
      next: data => {
        this.salleCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des salles:', err.error.message);
      }
    });
  }


  countSessions() {
    this.SessionFormation.getAllSessions().subscribe({
      next: data => {
        this.SessionCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des sessions:', err.error.message);
      }
    });
  }

  countApprenants() {
    this.apprenantService.getAllApprenants().subscribe({
      next: data => {
        this.apprenantCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des apprenants:', err.error.message);
      }
    });
  }

  countCategories() {
    this.categoryService.getAllCategorys().subscribe({
      next: data => {
        this.categoryCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des categories:', err.error.message);
      }
    });
  }
  

  countFormations() {
    this.formationService.getAllFormation().subscribe({
      next: data => {
        this.formationCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des categories:', err.error.message);
      }
    });
  }


  countFormateurs() {
    this.formateurService.getAllFormateurs().subscribe({
      next: data => {
        this.formateurCount = data.length;  // Nombre total
      },
      error: err => {
        console.error('Erreur lors du comptage des categories:', err.error.message);
      }
    });
  }
  

}
