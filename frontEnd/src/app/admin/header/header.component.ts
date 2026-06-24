import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogeddIn = false;
  user: any;
  searchQuery: string = '';

  constructor(private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser().admin || null;
  }

  logout() {
    this.isLogeddIn = false;
    localStorage.removeItem('auth-user');
    this.router.navigate(['/adminlogin']);
  }

  searchAndNavigate() {
    let query = this.searchQuery.toLowerCase().trim();
  
    // Fonction pour retirer les accents
    function normalize(str: string) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  
    query = normalize(query);
  
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'categories': '/categorys',
      'catégories': '/categorys',
      'formations': '/formations',
      'apprenants': '/apprenants',
      'formateurs': '/formateurs',
      'sessions': '/sessions-formations',
      'salles': '/salle',
      'avis': '/avis-admin',
      'likes': '/reviews',
      'certificats': '/certificat'
    };
  
    for (const key in routeMap) {
      const normalizedKey = normalize(key);
  
      // Recherche si query contient une partie du mot clé ou inversement
      if (normalizedKey.includes(query) || query.includes(normalizedKey)) {
        this.router.navigate([routeMap[key]]);
        this.searchQuery = '';
        return;
      }
    }
  
    alert('Aucune page correspondante trouvée.');
  }
  
}
