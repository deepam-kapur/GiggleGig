import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Teams } from './Teams';

@Entity()
export class Channels extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  channel_id: number;

  @Column({ unsigned: true, type: 'int' })
  team_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slack_channel_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Teams, (team) => team.team_id)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'team_id' })
  team: Teams;
}
