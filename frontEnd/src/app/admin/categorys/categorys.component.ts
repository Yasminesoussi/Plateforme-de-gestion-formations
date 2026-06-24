import { Category } from './../../models/Category';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.css']
})
export class CategorysComponent implements OnInit {

  categoryForm!: FormGroup;
  categories: Category[] = [];
  category = new Category();

  constructor(
    private categoryService: CategoryServiceService, 
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire avec _id
    this.categoryForm = this.fb.group({
      _id: [''], // Ajout de l'ID caché
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllCategorys();
  }

  getAllCategorys() {
    this.categoryService.getAllCategorys().subscribe({
      next: data => {
        this.categories = data;
        console.log("Catégories récupérées :", data);
      },
      error: err => {
        console.error("Erreur lors de la récupération :", err.error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const data = this.categoryForm.value;
      this.categoryService.createCategory(data).subscribe(
        response => {
          console.log('Category added:', response);
          this.getAllCategorys();
          this.categoryForm.reset();
          this.toastr.success("Success", "Category added");
        },
        error => {
          this.toastr.error(error.error.message || "An error occurred");
          console.error('Error adding category:', error);
        }
      );
    }
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette categorie ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCategory(id);
        Swal.fire(
          'Supprimée !',
          'La category a bien été supprimée.',
          'success'
        );
      }
    });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.toastr.success("Success", "Category deleted");
      this.getAllCategorys();
    });
  }

  getByIdCategory(id: string) {
    this.categoryService.getById(id).subscribe(category => {
      this.categoryForm.patchValue({
        _id: category._id,  // Ajout de l'ID manquant
        name: category.name,
        description: category.description
      });
    });
  }
  


  updateCategory() {
    const updatedCategory = this.categoryForm.value; // Récupérer les valeurs du formulaire
  
    this.categoryService.updateCategory(updatedCategory._id, updatedCategory).subscribe(
      response => {
        this.toastr.success("Success", "Category updated");
        $('#editModal').modal('hide'); // Fermer le modal
        this.getAllCategorys(); // Rafraîchir la liste
      },
      error => {
        this.toastr.error("Erreur lors de la mise à jour");
        console.error("Error updating category:", error);
      }
    );
  }
  

}
