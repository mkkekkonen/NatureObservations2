import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Observation } from './observation.entity';

@Entity('observationtype')
export class ObservationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageFileName: string;

  @OneToMany(t => Observation, observation => observation.type)
  observations: Observation[];

  get translationKey() {
    return `OBSTYPE.${this.name}`;
  }

  get imageUrl() {
    return `assets/icons/${this.imageFileName}`;
  }
}
