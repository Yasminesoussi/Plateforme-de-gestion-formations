import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';
import { ToastrService } from 'ngx-toastr';  // Importer ToastrService

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ApprenantServiceService,
    private toastr: ToastrService  // Injection de ToastrService
  ) {
    // Initialisation du formulaire avec validation
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  // Fonction pour envoyer les données du formulaire
  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;

      // Appel de la méthode du service pour envoyer les données
      this.contactService.sendMessage(formData).subscribe(
        (response) => {
          // Afficher un message de succès
          this.toastr.success('Message envoyé avec succès!', 'Succès');
        },
        (error) => {
          // Afficher un message d'erreur
          this.toastr.error('Erreur lors de l\'envoi du message', 'Erreur');
        }
      );
    } else {
      // Si le formulaire n'est pas valide, afficher un message d'erreur
      this.toastr.warning('Le formulaire est invalide', 'Attention');
    }
  }
}
