import { Formation } from 'src/app/models/Formation';
import { FormationServiceService } from 'src/app/services/formation-service.service';
import { CategoryServiceService } from './../../services/category-service.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent {
  selectedCategory: string = '';
  categorys: any[] = []; // Tableau pour stocker les categorys
  formations: any;
 



  constructor(private router: Router, private formationService: FormationServiceService , private categoryService:CategoryServiceService) {}
 // isLoggedIn  = false ;
 isLoggedIn: boolean = (sessionStorage.getItem("isLoggedIn") ?? "false") === "true";
  user: any;
  id!:string;
  formateurId: string = ''; 
  signOut() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    sessionStorage.setItem('isLoggedIn',JSON.stringify(this.isLoggedIn))   
   
    this.router.navigate(['/signInUser'])
  }

  ngOnInit(): void {

    if(window.sessionStorage.getItem('auth-user')!==null){
     this.user =   JSON.parse(sessionStorage.getItem('auth-user')!).user || null;
     console.log("user ",this.user._id)
    } else this.user = "user";
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === "true";
    console.log("logged",sessionStorage.getItem('isLoggedIn'))
    this.id = this.user._id;
    console.log(this.id);

    

    this.getAllCategorys();
  }




  getAllCategorys(): void {
    this.categoryService.getAllCategorys().subscribe(
      (data) => {
        this.categorys = data;
        console.log("Formations récupérées :", this.categorys);
      },
      (error) => {
        console.error("Erreur lors de la récupération des formations :", error);
      }
    );
  }




}
