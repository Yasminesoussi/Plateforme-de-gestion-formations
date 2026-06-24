import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import { FormateurServiceService } from 'src/app/services/formateur-service.service';
import { SessionFormationService } from 'src/app/services/session-formation.service';
import { SalleService } from 'src/app/services/salle.service';
import { Formation } from './../../models/Formation';
import { Formateur } from 'src/app/models/Formateur';
import { SessionFormation } from './../../models/SessionFormation';
import { ToastrService } from 'ngx-toastr';
import { Salle } from './../../models/Salle';
import Swal from 'sweetalert2';
import { Apprenant } from 'src/app/models/Apprenant';

@Component({
  selector: 'app-sessions-formations',
  templateUrl: './sessions-formations.component.html',
  styleUrls: ['./sessions-formations.component.css']
})
export class SessionsFormationsComponent implements OnInit {
  sessionForm: FormGroup;
  formations: Formation[] = [];
  apprenants: Apprenant[] = [];
  formateurs: Formateur[] = [];
  isLoading = false;
  isFormateursLoading = false;
  successMessage = '';
  errorMessage = '';
  sessions: SessionFormation[] = [];
  salles: Salle[] = [];


  sessionSelectionnee: SessionFormation | null = null;
  salleSelectionnee: string = '';

  constructor(
    private sessionService: SessionFormationService,
    private fb: FormBuilder,
    private formationService: FormationServiceService,
    private formateurService: FormateurServiceService,
    private salleService: SalleService,
    private toastr: ToastrService
  ) {
    this.sessionForm = this.fb.group({
      formationId: ['', Validators.required],
      formateurId: ['', Validators.required],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadSessions();
    this.loadSalles();

  }

  loadFormations(): void {
    this.formationService.getAllFormation().subscribe({
      next: (data) => this.formations = data,
      error: () => this.errorMessage = 'Erreur chargement formations'
    });
  }

  onFormationChange(): void {
    const formationId = this.sessionForm.get('formationId')?.value;
    const formateurControl = this.sessionForm.get('formateurId');

    formateurControl?.reset();
    if (formationId) {
      formateurControl?.enable();
      this.loadFormateurs(formationId);
    }
  }

  loadFormateurs(formationId: string): void {
    this.isFormateursLoading = true;
    this.formateurs = [];

    this.formateurService.getFormateurBFormation(formationId).subscribe({
      next: (formateurs) => {
        this.isFormateursLoading = false;
        this.formateurs = formateurs || [];

        if (this.formateurs.length === 0) {
          this.sessionForm.get('formateurId')?.disable();
          this.errorMessage = 'Aucun formateur disponible pour cette formation';
        }
      },
      error: (err) => {
        this.isFormateursLoading = false;
        this.sessionForm.get('formateurId')?.disable();
        this.errorMessage = err.message || 'Erreur chargement formateurs';
      }
    });
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (data) => this.sessions = data,
      error: (err) => console.error('Erreur chargement sessions :', err)
    });
  }

  loadSalles(): void {
    this.salleService.getSalles().subscribe({
      next: (data) => this.salles = data,
      error: () => this.toastr.error('Erreur chargement des salles')
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

  ouvrirModalAffecter(session: SessionFormation): void {
    this.sessionSelectionnee = session;
    this.salleSelectionnee = '';
  }

  affecterSalle(): void {
    if (!this.salleSelectionnee) {
      this.toastr.warning('Veuillez choisir une salle');
      return;
    }
    if (!this.sessionSelectionnee) {
      this.toastr.error('Session non sélectionnée');
      return;
    }
  
    this.salleService.affecterSalle(this.salleSelectionnee, this.sessionSelectionnee._id).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Salle affectée avec succès');
        this.sessions = this.sessions.map(s => {
          if (s._id === this.sessionSelectionnee?._id) {
            const salleTrouvee = this.salles.find(salle => salle._id === this.salleSelectionnee);
            if (salleTrouvee) {
              return { ...s, salle: salleTrouvee };
            }
            return s;
          }
          return s;
        });
      },
      error: (err) => this.toastr.error(err.error?.message || 'Erreur affectation salle')
    });
  }


  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette session de formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSession(id);
        Swal.fire('Supprimée !', 'La session a bien été supprimée.', 'success');
      }
    });
  }

  deleteSession(id: string): void {
    this.sessionService.deleteSession(id).subscribe(() => {
      this.toastr.success("Success", "Session supprimée");
      this.loadSessions();
    });
  }
  
}
