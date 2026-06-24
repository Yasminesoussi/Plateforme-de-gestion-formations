import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  reviews: any[] = [];
  searchTerm: string = '';


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.http.get<any[]>('http://localhost:3000/formation/getFormationsWithLikes').subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des reviews :', err);
      }
    });
  }



  get filteredReviews(): any[] {
    if (!this.searchTerm) return this.reviews;
    return this.reviews.filter(review =>
      review.formation.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}