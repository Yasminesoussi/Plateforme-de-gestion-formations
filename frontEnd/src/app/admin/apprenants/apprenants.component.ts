import { Component, OnInit } from '@angular/core';
import { Apprenant } from 'src/app/models/Apprenant';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';

@Component({
  selector: 'app-apprenants',
  templateUrl: './apprenants.component.html',
  styleUrls: ['./apprenants.component.css']
})
export class ApprenantsComponent implements OnInit {
  apprenants: Apprenant[] = [];
  searchTerm: string = '';

  constructor(private apprenantService: ApprenantServiceService) {}

  ngOnInit() {
    this.getAllApprenants();
  }

  getAllApprenants() {
    this.apprenantService.getAllApprenants().subscribe({
      next: data => {
        this.apprenants = data;
        console.log(data);
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.getAllApprenants();
    } else {
      this.apprenantService.getFilteredApprenants(this.searchTerm).subscribe({
        next: data => {
          this.apprenants = data;
          console.log('Résultats filtrés :', data);
        },
        error: err => {
          console.error('Erreur de filtrage :', err);
        }
      });
    }
  }
}
