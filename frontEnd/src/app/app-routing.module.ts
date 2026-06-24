import { AvisComponent } from './user/avis/avis.component';
import { formateurRoleGuard } from './services/formateur-role.guard';
import { AboutComponent } from './user/about/about.component';
import { FormationbyCategoryComponent } from './user/formationby-category/formationby-category.component';
import { CoursesComponent } from './user/courses/courses.component';
import { DetailsFormationComponent } from './user/details-formation/details-formation.component';
import { ResetPasswordComponent } from './user/formateur/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './user/formateur/forget-password/forget-password.component';
import { ChangerPasswordComponent } from './user/formateur/changer-password/changer-password.component';
import { HeaderUserComponent } from './user/header-user/header-user.component';
import { ProfileFormateurComponent } from './user/formateur/profile-formateur/profile-formateur.component';

import { SignUpFormateurComponent } from './user/formateur/sign-up-formateur/sign-up-formateur.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';

import { HomeComponent } from './user/home/home.component';
import { adminguardGuard } from './services/adminguard.guard';
import { ProfileComponent } from './admin/profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenantsComponent } from './admin/apprenants/apprenants.component';
import { CategorysComponent } from './admin/categorys/categorys.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FormateursComponent } from './admin/formateurs/formateurs.component';
import { FormationsComponent } from './admin/formations/formations.component';
import { LoginComponent } from './admin/login/login.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { SessionsFormationsComponent } from './admin/sessions-formations/sessions-formations.component';
import { PaymentComponent } from './admin/payment/payment.component';
import { PayementApprenantComponent } from './user/payement-apprenant/payement-apprenant.component';
import { ProfileApprenantComponent } from './user/profile-apprenant/profile-apprenant.component';
import { ChangePasswordApprenantComponent } from './user/change-password-apprenant/change-password-apprenant.component';
import { apprenantRoleGuard } from './services/apprenant-role.guard';
import { ContactComponent } from './user/contact/contact.component';
import { UpdateCvComponent } from './user/formateur/update-cv/update-cv.component';
import { DetailsFormateurComponent } from './user/formateur/details-formateur/details-formateur.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { AvisAdminComponent } from './admin/avis-admin/avis-admin.component';
import { SalleComponent } from './admin/salle/salle.component';
import { CertificatsComponent } from './admin/certificats/certificats.component';



const routes: Routes = [
  {path:'', redirectTo:'adminlogin', pathMatch:'full'},
  {path: 'adminlogin', component:LoginComponent},
  {path: 'dashboard' , component:DashboardComponent , canActivate:[adminguardGuard]},
  {path: 'categorys' , component:CategorysComponent },
  {path: 'apprenants' , component:ApprenantsComponent },
  {path: 'formateurs' , component:FormateursComponent },
  {path: 'formations' , component:FormationsComponent },
  {path: 'reviews' , component:ReviewsComponent },
  {path: 'sessions-formations' , component:SessionsFormationsComponent },
  {path: 'profile' , component:ProfileComponent },
  {path: 'home' , component:HomeComponent },
  {path: 'signInUser' , component:SignInComponent },
  {path: 'signUpUser' , component:SignUpComponent },
  {path: 'signUpFormateur' , component:SignUpFormateurComponent },
  {path: 'profileFormateur' , component:ProfileFormateurComponent , canActivate:[formateurRoleGuard]}, 
  {path: 'headerUser' , component:HeaderUserComponent },
  {path: 'ChangerPassword' , component:ChangerPasswordComponent },
  {path: 'ForgetPassword' , component:ForgetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'DetailsFormation/:id', component: DetailsFormationComponent },
  { path: 'Courses', component: CoursesComponent },
  { path: 'FormationByCategory/:id', component: FormationbyCategoryComponent },
  { path: 'about', component: AboutComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'payement-apprenant/:id', component: PayementApprenantComponent},
  {path: 'profileApprenant' , component:ProfileApprenantComponent , canActivate:[apprenantRoleGuard]}, 
  {path: 'changePasswordApprenant' , component:ChangePasswordApprenantComponent },
  {path: 'contact' , component:ContactComponent },
  {path: 'updateCv/:id' , component:UpdateCvComponent },
  {path: 'detailsFormateur/:id' , component:DetailsFormateurComponent },
  { path: 'apprenant/verify-email', component: VerifyEmailComponent },
  { path: 'avis', component: AvisComponent },
  { path: 'avis-admin', component: AvisAdminComponent },
  { path: 'salle', component: SalleComponent },
  { path: 'certificat', component: CertificatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
