import { Formation } from './Formation';
import { Apprenant } from "./Apprenant";

export class Payment {
    _id!: string;
    apprenant!: Apprenant;
    formation!: Formation;
    totalAmount!: string;
    status!: string;
    tranches!: { montant_tranche: number, date_depot_tranche: string }[];  // Array of objects for tranches
    montant_restant!: string;
    createdAt!: string;
    updatedAt!: string;
  }
  