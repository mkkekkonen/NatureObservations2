export class ImgData {
  id: number;

  fileUri: string;

  debugDataUri: string;

  constructor(fileUri: string, debugDataUri: string, id?: number) {
    this.id = id;
    this.fileUri = fileUri;
    this.debugDataUri = debugDataUri;
  }
}
