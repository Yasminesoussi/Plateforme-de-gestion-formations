import { Component, OnInit } from '@angular/core';
import { SalleService } from 'src/app/services/salle.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salle',
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.css']
})
export class SalleComponent implements OnInit {

  salles: any[] = [];
  newSalle = {
    nom: ''
  };

  constructor(private salleService: SalleService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.chargerSalles();
  }


  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSalle(id);
        Swal.fire('Supprimée !', 'La salle a bien été supprimée.', 'success');
      }
    });
  }

  deleteSalle(id: string): void {
    this.salleService.deleteSalle(id).subscribe(() => {
      this.toastr.success("Success", "Salle supprimée");
      this.chargerSalles();
    });
  }

  chargerSalles() {
    this.salleService.getSalles().subscribe({
      next: (data) => {
        this.salles = data;
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement des salles');
        console.error(err);
      }
    });
  }

  ajouterSalle() {
    if (!this.newSalle.nom.trim()) {
      this.toastr.warning('Le nom est requis');
      return;
    }

    this.salleService.ajouterSalle(this.newSalle).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Salle ajoutée avec succès');
        this.newSalle.nom = '';
        this.chargerSalles();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Erreur lors de l\'ajout de la salle');
        console.error(err);
      }
    });
  }
}
