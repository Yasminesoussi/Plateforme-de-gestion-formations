import { ToastrService } from 'ngx-toastr';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import { Formation } from 'src/app/models/Formation';
import { Component, OnInit } from '@angular/core';
import { Formateur } from 'src/app/models/Formateur';
import { FormateurServiceService } from 'src/app/services/formateur-service.service';

@Component({
  selector: 'app-formateurs',
  templateUrl: './formateurs.component.html',
  styleUrls: ['./formateurs.component.css']
})
export class FormateursComponent implements OnInit {


  formateurs: Formateur[] = [];
  formations: Formation[] =[];
  selectedFormateurId!: string ;
  searchTerm: string = '';

  status: string = 'inactive';


  constructor (private formateurService: FormateurServiceService, private formationService: FormationServiceService , private toastr: ToastrService){}

  

  
  ngOnInit() {
    this.getAllFormateurs();
   // this.getAllFormations();
  }

  activeStatus(formateurId: string) {
    this.formateurService.activateFormateur(formateurId).subscribe(data=> {
      
    })
  }


  getAllFormateurs() {
    this.formateurService.getAllFormateurs().subscribe({next: data => {
      this.formateurs = data;
      console.log(data);
    }, error: err => {
      console.log(err.error.message)
    }
  })
  }



  openModal(formateurId: string){
    this.selectedFormateurId = formateurId;
    console.log(this.selectedFormateurId);
    this.formationService.getAllFormation().subscribe({next: data => {
      this.formations = data;
      console.log(data);
    }, error: err => {
      console.log(err.error.message)
    }
  })
  }


  affecterFormation(formationId: string) {
    if (formationId) {
      const formateurId = this.selectedFormateurId;
      this.formateurService.affecterFormation(formateurId, formationId).subscribe(
        () => {
          this.toastr.success("Succès", "Formation affectée avec succès");
        },
        error => {
          const msg = error?.error?.message || "Erreur d'affectation";
          this.toastr.warning("Erreur", msg);
        }
      );
    } else {
      this.toastr.warning("Erreur", "Veuillez sélectionner un formateur");
    }
  }
  


  downloadcv(id:string){
    this.formateurService.downloadCvByFormateur(id).subscribe((response) => {
      const blob = new Blob([response], {type:'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      

  },
 (error)  => {
    console.error(error);
    alert('file download failed');
  }
);
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.getAllFormateurs();
    } else {
      this.formateurService.getFilteredFormateurs(this.searchTerm).subscribe({
        next: data => {
          this.formateurs = data;
          console.log('Résultats filtrés :', data);
        },
        error: err => {
          console.error('Erreur de filtrage :', err);
        }
      });
    }
  }

}
