export class ObservationType {
  id: number;

  name: string;

  imageFileName: string;

  get translationKey() {
    return `OBSTYPE.${this.name}`;
  }

  get imageUrl() {
    return `assets/icons/${this.imageFileName}`;
  }
}
