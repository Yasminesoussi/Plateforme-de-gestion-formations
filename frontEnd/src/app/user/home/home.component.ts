import { Category } from './../../models/Category';
import { HttpClient } from '@angular/common/http';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { FormationServiceService } from './../../services/formation-service.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Router } from '@angular/router';
import {  Component, OnInit } from '@angular/core';


import 'owl.carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements  OnInit {

  
 
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
  
  

  
  formations: any[] = []; // Tableau pour stocker les formations
  categorys: Category[] = []; // Tableau pour stocker les catégories
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  tags: string = '';
  user: any;
  likedFormations: string[] = [];
  levels = [
    { name: 'Tous les niveaux', checked: false, count: 10000 },
    { name: 'Débutant', checked: false, count: 10000 },
    { name: 'Intermédiaire', checked: false, count: 5791 },
    { name: 'Confirmé', checked: false, count: 675 }
  ];

  constructor(
    private router: Router, 
    private authService: AuthServiceService, 
    private formationService: FormationServiceService,
    private categoryService: CategoryServiceService,
    private http: HttpClient
  ) { }

  onSearch() {
    const params: any = {};
    if (this.searchQuery) params.query = this.searchQuery;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;
    if (this.tags) params.tags = this.tags;

    const selectedCategories = this.categorys
      .filter(cat => cat.checked)
      .map(cat => cat._id); //on envoie les ids des catégories

    const selectedLevels = this.levels
      .filter(l => l.checked)
      .map(l => l.name);

    if (selectedCategories) params.categories = selectedCategories;
    if (selectedLevels) params.levels = selectedLevels;

    this.http.get('http://localhost:3000/formation/searchTraining', { params })
      .subscribe((results: any) => {
        this.formations = results;
      });
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

  ngOnInit(): void {
    const authData = this.authService.getUser();
    this.user = authData ? authData.user : null;
    this.getAllFormation();
    this.getAllCategorys();
   
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
    this.formations = this.formations.map(formation => {
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
