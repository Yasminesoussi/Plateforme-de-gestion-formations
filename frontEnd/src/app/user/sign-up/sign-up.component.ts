import { ApprenantServiceService } from 'src/app/services/apprenant-service.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  userForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private apprenantService: ApprenantServiceService , private toastr: ToastrService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      image: [null]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  onSubmit() {
    if (this.userForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.userForm.get('name')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('password', this.userForm.get('password')?.value);
      formData.append('telephone', this.userForm.get('telephone')?.value);
      formData.append('adresse', this.userForm.get('adresse')?.value);
      formData.append('image', this.selectedFile);
  
      this.apprenantService.signUp(formData)
        .subscribe(
          (response) => {
            this.toastr.success('Un e-mail de vérification vous a été envoyé à votre adresse. Veuillez consulter votre boîte de réception.', 'Succès');
        
          },
          (error) => {
            this.toastr.error('Erreur lors de l\'inscription.', 'Erreur');
            console.error(error);
          }
        );
    } else {
      this.toastr.warning('Formulaire invalide ou image manquante.', 'Attention');
    }
  }
  
  ngOnInit(): void {
      
  }


}
