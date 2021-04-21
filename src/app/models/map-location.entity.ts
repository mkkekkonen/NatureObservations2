export interface ICoords {
  latitude: number
  longitude: number
}

export class MapLocation {
  id: number;

  name: string | null;

  coords: ICoords
}
