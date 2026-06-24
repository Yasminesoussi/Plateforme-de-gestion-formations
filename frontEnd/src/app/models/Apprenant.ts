import { Formation } from "./Formation";

export class Apprenant {
    _id!: string;
    name!: string;
    email!: string;
    telephone!: string;
    adresse!: string;
    formations!: Formation[]; // ✅

    status!: string;
    image!: string;
}