export class ObservationType {
  id: number;

  name: string;

  imageFileName: string;

  constructor(name: string, imageFileName: string, id?: number) {
    this.id = id;
    this.name = name;
    this.imageFileName = imageFileName;
  }

  get translationKey() {
    return `OBSTYPE.${this.name}`;
  }

  get imageUrl() {
    return `assets/icons/${this.imageFileName}`;
  }
}
