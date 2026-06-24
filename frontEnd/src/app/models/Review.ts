import { Apprenant } from './Apprenant';
import { Formation } from './Formation';
export class Review {
    _id!: string;
    user!: Apprenant;  
    formation!: Formation;
    
}