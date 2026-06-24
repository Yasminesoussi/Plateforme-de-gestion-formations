import { Apprenant } from './Apprenant';
import { SessionFormation } from './SessionFormation';

export class Certificat {
  _id!: string; // ID unique du certificat
  apprenant!: Apprenant | null; // Référence à l'apprenant
  session!: SessionFormation | null; // Référence à la session de formation
  path!: string; // Chemin relatif du fichier du certificat
  createdAt!: Date; // Date de création du certificat
}
