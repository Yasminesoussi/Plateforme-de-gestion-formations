import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormateurServiceService } from 'src/app/services/formateur-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-cv',
  templateUrl: './update-cv.component.html',
  styleUrls: ['./update-cv.component.css'],
})
export class UpdateCvComponent implements OnInit {
  formateurId: string = ''; // L'ID du formateur sera défini ici
  selectedFile: File | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private formateurService: FormateurServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.route.params.subscribe((params) => {
      this.formateurId = params['id']; // Assurez-vous que l'URL contient :id
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateCv() {
    if (this.formateurId && this.selectedFile) {
      this.formateurService.updateCv(this.formateurId, this.selectedFile).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Succès');
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la mise à jour du CV.', 'Erreur');
          console.error(err);
        },
      });
    } else {
      this.toastr.warning('Veuillez sélectionner un fichier.', 'Attention');
    }
  }
}
