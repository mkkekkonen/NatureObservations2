import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { Observation } from './observation.entity';

@Entity('imgdata')
export class ImgData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileUri: string;

  @Column()
  debugDataUri: string;

  @OneToOne(t => Observation)
  observation: Observation;
}
