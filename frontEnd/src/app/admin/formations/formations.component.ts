import { Category } from './../../models/Category';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Formation } from 'src/app/models/Formation';
import { ToastrService } from 'ngx-toastr';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { Apprenant } from 'src/app/models/Apprenant';
import Swal from 'sweetalert2';

// Convertit une date ISO string locale en format compatible input[type=datetime-local]
function isoDateToLocalDatetimeInput(dateStr: string | null): string {
  if (!dateStr) return '';
  // dateStr attendu au format "YYYY-MM-DDTHH:mm:ss" local, ex: "2025-05-28T13:15:00"
  return dateStr.substring(0,16); // "YYYY-MM-DDTHH:mm"
}

// Convertit la valeur du input[type=datetime-local] en string ISO locale avec secondes
function localDatetimeToLocalISOString(localDateTime: string): string {
  // localDateTime au format "YYYY-MM-DDTHH:mm"
  if (!localDateTime) return '';
  return localDateTime + ':00'; // rajoute ":ss"
}

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit {
  formations: Formation[] = [];
  formationForm!: FormGroup;
  formation = new Formation();
  categories: Category[] = [];
  selectedFile: File | null = null;
  apprenants: Apprenant[] = [];

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  constructor(
    private formationService: FormationServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private categoryService: CategoryServiceService
  ) {
    this.formationForm = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      prix: ['', Validators.required],
      image: ['', Validators.required],
      tags: ['', Validators.required],
      level: ['', Validators.required],
      startDate: ['', Validators.required], // valeur string format "YYYY-MM-DDTHH:mm"
      endDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllFormation();
    this.getAllCategorys();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getAllFormation();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllFormation();
  }

  getAllFormation() {
    this.formationService.getAllFormation().subscribe({
      next: (data: Formation[]) => {
        // Pas de conversion en Date ici, juste préparer les strings pour input
        this.formations = data;
        console.log("Formations récupérées :", this.formations);
      },
      error: err => {
        console.error(err.error?.message || err);
      }
    });
  }

  getAllCategorys() {
    this.categoryService.getAllCategorys().subscribe({
      next: data => {
        this.categories = data;
        console.log(this.categories);
      },
      error: err => {
        console.error(err.error?.message || err);
      }
    });
  }

 

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFormation(id);
        Swal.fire('Supprimée !', 'La formation a bien été supprimée.', 'success');
      }
    });
  }

  deleteFormation(id: string): void {
    this.formationService.deleteFormation(id).subscribe(() => {
      this.toastr.success("Success", "Formation supprimée");
      this.getAllFormation();
    });
  }

  onSubmit(): void {
    const formValue = this.formationForm.value;

    // Conversion du datetime-local input en string ISO locale avec secondes
    const startDateStr = localDatetimeToLocalISOString(formValue.startDate);
    const endDateStr = localDatetimeToLocalISOString(formValue.endDate);

    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('category', formValue.category);
    formData.append('prix', formValue.prix);
    formData.append('level', formValue.level);
    formData.append('tags', formValue.tags);
    formData.append('startDate', startDateStr);
    formData.append('endDate', endDateStr);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.formationService.createFormation(formData).subscribe(
      response => {
        this.toastr.success("Success", "Training added");
        this.getAllFormation();
        this.formationForm.reset();
      },
      error => {
        this.toastr.error(error.error?.message || "An error occurred");
        console.error('Error adding training:', error);
      }
    );
  }

  updateFormation() {
    const updatedFormation = this.formationForm.value;  // Récupérer les valeurs du formulaire


      // Conversion du datetime-local input en string ISO locale avec secondes
      const startDateStr = localDatetimeToLocalISOString(updatedFormation.startDate);
      const endDateStr = localDatetimeToLocalISOString(updatedFormation.endDate);
    

    this.formationService.updateFormation(updatedFormation._id, updatedFormation).subscribe(
      () => {
        this.toastr.success("Success", "Formation mise à jour");
        this.getAllFormation();
      },
      error => {
        this.toastr.error("Erreur lors de la mise à jour");
        console.error("Error updating formation:", error);
      }
    );
  }

  getByIdFormation(id: string) {
    this.formationService.getById(id).subscribe(formation => {
      this.formationForm.patchValue({
        _id: formation._id,
        name: formation.name,
        description: formation.description,
        category: formation.category?._id,
        prix: formation.prix,
        tags: formation.tags,
        level: formation.level,
        startDate: isoDateToLocalDatetimeInput(formation.startDate),
        endDate: isoDateToLocalDatetimeInput(formation.endDate),
        image: formation.image,
      });
    });
  }
}
