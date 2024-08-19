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

import { STATUS } from '../../config/constants/common.constants';
import { Teams } from './Teams';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  user_id: number;

  @Column({ unique: true })
  slack_user_id: string;

  @Column({ unsigned: true, type: 'int' })
  team_id: number;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Teams, (team) => team.team_id)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'team_id' })
  team: Teams;
}
