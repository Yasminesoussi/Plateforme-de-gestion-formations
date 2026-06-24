import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormationServiceService } from './../../services/formation-service.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'owl.carousel';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/models/Category';
import { CategoryServiceService } from 'src/app/services/category-service.service';
declare var $: any;
import { ParamMap } from '@angular/router';

@Component({
  selector: 'app-formationby-category',
  templateUrl: './formationby-category.component.html',
  styleUrls: ['./formationby-category.component.css']
})

export class FormationbyCategoryComponent  implements  OnInit {

  customOptions: any = {
    loop: true,
 margin: 10,
 autoplay: true,              // ← Activation de l'autoplay
 autoplayTimeout: 3000,       // ← Temps entre les slides (en ms)
 autoplayHoverPause: true,    // ← Pause quand la souris passe sur le slide
 items: 1,
 dots: true,
 nav: false
 };

 user: any;
 categorys: Category[] = []; // Tableau pour stocker les catégories
  formations: any[] = []; // Tableau pour stocker les formations
  id!: any;
  likedFormations: string[] = [];
  currentCategoryName: string = '';



  constructor(
    private router: Router, 
    private authService: AuthServiceService, 
    private formationService: FormationServiceService,
    private categoryService: CategoryServiceService,
    private http: HttpClient,
    private route: ActivatedRoute, 
  ) {}



  ngOnInit(): void {
    const authData = this.authService.getUser();
    this.user = authData ? authData.user : null;
  
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.getFormationsByCategory();
        this.getCategoryNameById(this.id); // ➕ Ajout ici
      }
    });
  
    this.getAllCategorys();
  }

  getCategoryNameById(categoryId: string): void {
    this.categoryService.getById(categoryId).subscribe(
      (category: any) => {
        this.currentCategoryName = category.name;
      },
      (error) => {
        console.error("Erreur lors de la récupération de la catégorie :", error);
        this.currentCategoryName = 'Inconnue';
      }
    );
  }
  
  

  getFormationsByCategory(): void {
    
    this.formationService.getByCategory(this.id).subscribe(
      (data) => {
        this.formations = data;
        //console.log(`Formations for ${category}:`, this.formations);
      },
      (error) => console.error('Erreur lors de la récupération des formations:', error)
    );
  }









  getAllCategorys(): void {
    this.categoryService.getAllCategorys().subscribe(
      (data) => {
        this.categorys = data.map((cat: any) => ({
          ...cat,
          checked: false
        }));
        console.log("Catégories récupérées :", this.categorys);
      },
      (error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    );
  }

 

  getAllFormation(): void {
    this.formationService.getAllFormation().subscribe(
      (data) => {
        this.formations = data;
        console.log("Formations récupérées :", this.formations);
      },
      (error) => {
        console.error("Erreur lors de la récupération des formations :", error);
      }
    );
  }


  
  likeTraining(formationId: string): void {
    this.formationService.likeFormation(formationId, this.user._id).subscribe({
      next: () => {
        this.likedFormations.push(formationId);
        this.updateFormationLikeCount(formationId, 1);
      },
      error: (err) => console.error(err)
    });
  }

  unlikeTraining(formationId: string): void {
    this.formationService.dislikeFormation(formationId, this.user._id).subscribe({
      next: () => {
        this.likedFormations = this.likedFormations.filter(id => id !== formationId);
        this.updateFormationLikeCount(formationId, -1);
      },
      error: (err) => console.error(err)
    });
  }

  isLiked(formationId: string): boolean {
    return this.likedFormations.includes(formationId);
  }

  toggleLike(formationId: string): void {
    if (this.isLiked(formationId)) {
      this.unlikeTraining(formationId);
    } else {
      this.likeTraining(formationId);
    }
  }

  private updateFormationLikeCount(formationId: string, increment: number): void {
    this.formations = this.formations.map((formation: any)=> {
      if (formation._id === formationId) {
        return {
          ...formation,
          likesCount: (formation.likesCount || 0) + increment
        };
      }
      return formation;
    });
  }
 
  

}
