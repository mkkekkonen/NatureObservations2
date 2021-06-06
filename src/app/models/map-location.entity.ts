export interface ICoords {
  latitude: number
  longitude: number
}

export class MapLocation {
  id: number;

  name: string | null;

  coords: ICoords

  observationId: number;
  
  constructor(name: string | null, latitude: number, longitude: number, observationId: number, id?: number) {
    this.id = id;
    this.name = name;
    this.coords = { latitude, longitude };
    this.observationId = observationId;
  }
}
