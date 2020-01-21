import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { Observation } from './observation.entity';

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

  @OneToOne(t => Observation, observation => observation.mapLocation)
  @JoinColumn()
  observation: Observation;
}
