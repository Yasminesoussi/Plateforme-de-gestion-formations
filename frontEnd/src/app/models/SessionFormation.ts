import { Apprenant } from './Apprenant';
import { Formateur } from './Formateur';
import { Formation } from './Formation';
import { Salle } from './Salle';
export class SessionFormation {
    _id!: string;
    formation!: Formation;  
    status!: string; 
    formateur!: Formateur;  
    startDate!: string; // date locale sous forme de string "YYYY-MM-DDTHH:mm:ss"
    endDate!: string;
    salle!: Salle;
  apprenants!: Apprenant[];
    
}