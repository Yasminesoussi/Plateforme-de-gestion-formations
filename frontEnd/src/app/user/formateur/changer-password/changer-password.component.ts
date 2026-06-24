import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent implements OnInit {  // ⬅️ Ajoute `implements OnInit`
  userId: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private authService: AuthServiceService, private ToastrService: ToastrService) {}

  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    console.log("Utilisateur récupéré dans ChangerPasswordComponent:", storedUser); // Debug
  
    if (storedUser && storedUser.user && storedUser.user._id) {
      this.userId = storedUser.user._id;
    } else {
      console.error("Utilisateur non trouvé !");
    }
  }
  

  changePassword(): void {
    if (!this.userId) {
      alert('Erreur : utilisateur non trouvé !');
      return;
    }

    this.authService.changePassword(this.userId, this.currentPassword, this.newPassword)
      .subscribe(() => {
        this.ToastrService.success('Mot de passe changé avec succès !', 'Succès');
      }, () => {
        this.ToastrService.error('Erreur lors du changement de mot de passe.', 'Erreur');
      });
  }
}
