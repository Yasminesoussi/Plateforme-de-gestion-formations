export class Avis {
    user!: string;       // id MongoDB de l'utilisateur (Apprenant ou Formateur)
    userRole!: 'Apprenant' | 'Formateur'; // rôle utilisateur
    titre!: string;
    contenu!: string;
    dateExperience!: Date;
    note!: number;
    createdAt?: Date;     // optionnel, par défaut Date.now dans Mongoose
    
  }
  