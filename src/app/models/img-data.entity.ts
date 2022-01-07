export class ImgData {
  id: number;

  fileUri: string;

  debugDataUri: string;

  observationId: number;

  constructor(fileUri: string, debugDataUri: string, observationId: number, id?: number) {
    this.id = id;
    this.fileUri = fileUri;
    this.debugDataUri = debugDataUri;
    this.observationId = observationId;
  }
}
