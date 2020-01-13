import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';

import { ObservationType, MapLocation, ImgData } from '.';

@Entity('observation')
export class Observation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('datetime')
  date: string;

  @ManyToOne(t => ObservationType, observationType => observationType.observations)
  type: ObservationType;

  @OneToOne(t => MapLocation, mapLocation => mapLocation.observation)
  mapLocation: MapLocation;

  @OneToOne(t => ImgData, imgData => imgData.observation)
  imgData: ImgData;
}
