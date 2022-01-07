import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { Observation } from './observation.entity';

@Entity('imgdata')
export class ImgData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fileUri: string;

  @Column({ nullable: true })
  debugDataUri: string;

  @OneToOne(t => Observation, observation => observation.imgData, { onDelete: 'CASCADE' })
  @JoinColumn()
  observation: Observation;
}
