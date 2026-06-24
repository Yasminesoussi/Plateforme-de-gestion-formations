import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SideBarComponent } from './admin/side-bar/side-bar.component';
import { HeaderComponent } from './admin/header/header.component';
import { CategorysComponent } from './admin/categorys/categorys.component';
import { FormationsComponent } from './admin/formations/formations.component';
import { ApprenantsComponent } from './admin/apprenants/apprenants.component';
import { FormateursComponent } from './admin/formateurs/formateurs.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { SessionsFormationsComponent } from './admin/sessions-formations/sessions-formations.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './admin/login/login.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { HomeComponent } from './user/home/home.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignUpFormateurComponent } from './user/formateur/sign-up-formateur/sign-up-formateur.component';
import { ProfileFormateurComponent } from './user/formateur/profile-formateur/profile-formateur.component';
import { HeaderUserComponent } from './user/header-user/header-user.component';
import { ChangerPasswordComponent } from './user/formateur/changer-password/changer-password.component';
import { ForgetPasswordComponent } from './user/formateur/forget-password/forget-password.component';
import { ResetPasswordComponent } from './user/formateur/reset-password/reset-password.component';
import { DetailsFormationComponent } from './user/details-formation/details-formation.component';
import { FooterUserComponent } from './user/footer-user/footer-user.component';
import { CoursesComponent } from './user/courses/courses.component';
import { FormationbyCategoryComponent } from './user/formationby-category/formationby-category.component';
import { AboutComponent } from './user/about/about.component';
import { PaymentComponent } from './admin/payment/payment.component';
import { PayementApprenantComponent } from './user/payement-apprenant/payement-apprenant.component';
import { ProfileApprenantComponent } from './user/profile-apprenant/profile-apprenant.component';
import { ChangePasswordApprenantComponent } from './user/change-password-apprenant/change-password-apprenant.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ContactComponent } from './user/contact/contact.component';
import { UpdateCvComponent } from './user/formateur/update-cv/update-cv.component';
import { DetailsFormateurComponent } from './user/formateur/details-formateur/details-formateur.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NotificationsComponent } from './user/notifications/notifications.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';

import { ChatbotComponent } from './user/chatbot/chatbot.component';
import { AvisComponent } from './user/avis/avis.component';
import { AvisAdminComponent } from './admin/avis-admin/avis-admin.component';
import { SalleComponent } from './admin/salle/salle.component';
import { CertificatsComponent } from './admin/certificats/certificats.component';



const config: SocketIoConfig = { 
  url: 'http://localhost:3000',
  options: {} 
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideBarComponent,
    HeaderComponent,
    CategorysComponent,
    FormationsComponent,
    ApprenantsComponent,
    FormateursComponent,
    ReviewsComponent,
    SessionsFormationsComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignUpFormateurComponent,
    ProfileFormateurComponent,
    HeaderUserComponent,
    ChangerPasswordComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    DetailsFormationComponent,
    FooterUserComponent,
    CoursesComponent,
    FormationbyCategoryComponent,
    AboutComponent,
    PaymentComponent,
    PayementApprenantComponent,
    ProfileApprenantComponent,
    ChangePasswordApprenantComponent,
    ContactComponent,
    UpdateCvComponent,
    DetailsFormateurComponent,
    NotificationsComponent,
    VerifyEmailComponent,
  
    ChatbotComponent,
       AvisComponent,
       AvisAdminComponent,
       SalleComponent,
       CertificatsComponent,
       
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    CarouselModule,
    
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
