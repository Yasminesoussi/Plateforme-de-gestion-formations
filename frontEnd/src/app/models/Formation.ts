import { Formateur } from './Formateur';
import { Category } from './Category';
import { Apprenant } from './Apprenant';
export class Formation {
    _id!: string;
    name!: string;
    description!: string;
    apprenants!: Apprenant[];
    category!: Category;
    prix!: string;
    formateur!: Formateur;
    likesCount!: number;
    tags!: string;
    level!: string;
    image!: { name: string, path: string };
    startDate!: string; // date locale sous forme de string "YYYY-MM-DDTHH:mm:ss"
    endDate!: string;
}
