export class ObservationType {
  constructor(public name: string, public imageFileName: string) {}

  get translationKey() {
    return `OBSTYPE.${this.name}`;
  }

  get imageUrl() {
    return `assets/icons/${this.imageFileName}`;
  }
}
