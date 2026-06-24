import { Component } from '@angular/core';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-apprenant',
  templateUrl: './change-password-apprenant.component.html',
  styleUrls: ['./change-password-apprenant.component.css']
})
export class ChangePasswordApprenantComponent {

  // ⬅️ Ajoute `implements OnInit`
  userId: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private apprenantService: ApprenantServiceService , private ToastrService: ToastrService) {}

  ngOnInit(): void {
    const storedUser = this.apprenantService.getUser();
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

    this.apprenantService.changePassword(this.userId, this.currentPassword, this.newPassword)
      .subscribe(() => {
        this.ToastrService.success('Mot de passe changé avec succès !', 'Succès');
      }, () => {
        this.ToastrService.error('Erreur lors du changement de mot de passe.', 'Erreur');
      });
  }

}
