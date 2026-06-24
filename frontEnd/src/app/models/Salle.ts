import { SessionFormation } from './SessionFormation';

export class Salle {
  _id!: string;
  nom!: string;
  disponible!: boolean;
  sessions!: SessionFormation[];  // sessions affectées à cette salle
}
