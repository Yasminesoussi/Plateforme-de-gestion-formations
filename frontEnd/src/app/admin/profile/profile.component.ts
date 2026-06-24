import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = { _id: '', name: '', email: '' };

  constructor(private authService: AuthServiceService,   private toastr: ToastrService) {}

  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    if (storedUser && storedUser.admin) {
      this.user = storedUser.admin;
    }
  }

  updateProfile(): void {
    console.log('Données envoyées :', this.user); // 🟢 Vérifier si _id est présent
  
    if (!this.user._id || !this.user.name || !this.user.email) {
      this.toastr.error('Nom ou Email manquant !', 'Erreur');
      return;
    }
  
    this.authService.updateProfile(this.user._id, {
      name: this.user.name,
      email: this.user.email
    }).subscribe(response => {
      this.toastr.success('Profil mis à jour avec succès !', 'Succès');
      this.authService.saveUser({ admin: response }, 'admin');
  
    }, error => {
      console.error('Erreur mise à jour :', error);
      this.toastr.error('Erreur lors de la mise à jour du profil.', 'Erreur');
    });
  }
  
  
}
