import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

isLogeddIn = false;  
form: any = {
  email: null,
  password: null
}

constructor(private authService : AuthServiceService, private router: Router,private socket:Socket, private notifService:NotificationServiceService) {

}

login() {
  this.authService.loginAdmin(this.form.email, this.form.password).subscribe({
    next: async  (res) => {
      if (res?.admin?._id) {
        this.isLogeddIn = true;
        this.authService.saveUser(res, 'admin');

       // Nouvelle approche robuste
       this.notifService.initializeSocket(res.admin._id).then(() => {
        console.log('Socket prêt et admin authentifié');
      });

        Swal.fire({
          icon: 'success',
          title: 'Connexion Admin Réussie',
          text: `Bienvenue ${res.admin?.name} !`,
          toast: true,
          timer: 2500,
          position: 'top-end',
          showConfirmButton: false
        });

        this.router.navigate(['/dashboard']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de se connecter. Veuillez réessayer.',
        });
      }
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Échec de connexion',
        text: err.error?.message || 'Identifiants invalides ou erreur serveur.',
        confirmButtonColor: '#dc3545'
      });
    }
  });
}

// Ajoutez cette méthode dans votre composant
private ensureSocketConnection(): Promise<void> {
  return new Promise((resolve) => {
    if (this.socket.connected) {
      resolve();
    } else {
      this.socket.on('connect', () => {
        console.log('Socket.io maintenant connecté');
        resolve();
      });
      
      // Timeout de sécurité
      setTimeout(resolve, 500);
    }
  });
}
ngOnInit(): void {
    
}

}

