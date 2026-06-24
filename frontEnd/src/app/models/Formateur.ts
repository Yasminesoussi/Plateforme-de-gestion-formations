import { Formation } from "./Formation";

export class Formateur {
    _id!: string;
    name!: string;
    email!: string;
    password!:string;
    telephone!: string;
    adresse!: string;
    formations!: Formation[]; // 👈 Tableau de Formation
    cv! :string;
    status!: string;
    specialite!: string;
    image!: string;
}