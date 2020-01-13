import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { Observation } from './observation';

@Entity('maplocation')
export class MapLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('real')
  latitude: number;

  @Column('real')
  longitude: number;

  @OneToOne(t => Observation)
  observation: Observation;
}
