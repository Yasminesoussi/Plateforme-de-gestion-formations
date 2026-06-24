import { Component, OnInit } from '@angular/core';
import { CertificatService } from 'src/app/services/certificat.service';
import { Certificat } from 'src/app/models/Certificat';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-certificats',
  templateUrl: './certificats.component.html',
  styleUrls: ['./certificats.component.css']
})
export class CertificatsComponent implements OnInit {
  certificats: Certificat[] = [];
  isLoading: boolean = true;
  selectedImage: string | null = null;
  searchTerm: string = '';
  constructor(
    private certificatService: CertificatService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllCertifs();
  }

  getAllCertifs(): void {
    this.certificatService.getAllCertifs().subscribe({
      next: (data) => {
        this.certificats = data.map((cert: Certificat) => ({
          ...cert,
          path: `http://localhost:3000${cert.path}`
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des certificats :', err);
        this.isLoading = false;
      }
    });
  }

  openImage(path: string) {
    this.selectedImage = path;
  }

  closeImage() {
    this.selectedImage = null;
  }

  deleteCertificat(id: string): void {
    this.certificatService.deleteCertificat(id).subscribe(() => {
      this.toastr.success("Success", "Certificat supprimé");
      this.getAllCertifs(); // recharge la liste après suppression
    });
  }


  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette certificat ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCertificat(id);
        Swal.fire('Supprimée !', 'La certificat a bien été supprimée.', 'success');
      }
    });
  }

   // Récupérer les certificats filtrés selon searchTerm
   filterCertificates(): void {
    this.isLoading = true;
    this.certificatService.getFilteredCertificates(this.searchTerm).subscribe({
      next: (data) => {
        this.certificats = data.map((cert: Certificat) => ({
          ...cert,
          path: `http://localhost:3000${cert.path}`
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des certificats filtrés :', err);
        this.isLoading = false;
      }
    });
  }

}
