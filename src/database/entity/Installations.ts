import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Teams } from './Teams';
import { Users } from './Users';

@Entity()
export class Installations extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  installation_id: number;

  @Column({ unsigned: true, type: 'int', unique: true })
  team_id: number;

  @Column({ unsigned: true, type: 'int' })
  authed_user_id: number;

  @Column({ nullable: true })
  enterprise_id: string;

  @Column()
  bot_token: string;

  @Column()
  token_version: string;

  @Column({ nullable: true })
  bot_id: string;

  @Column()
  bot_user_id: string;

  @Column({ nullable: true })
  scope: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @OneToOne(() => Teams, (team) => team.team_id)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'team_id' })
  team: Teams;

  @OneToOne(() => Users, (user) => user.user_id)
  @JoinColumn({ name: 'authed_user_id', referencedColumnName: 'user_id' })
  authed_user: Users;
}
