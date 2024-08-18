import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Sessions } from './Sessions';
import { Users } from './Users';

@Entity()
export class SessionUsers extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  session_user_id: number;

  @Column({ unsigned: true, type: 'int' })
  session_id: number;

  @Column({ unsigned: true, type: 'int' })
  user_id: number;

  @Column({ unsigned: true, type: 'int', default: 0 })
  score: number;

  @Column({ nullable: true })
  appreciation: string;

  @Column()
  assigned_skills: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Sessions, (s) => s.session_id)
  @JoinColumn({
    name: 'session_id',
    referencedColumnName: 'session_id',
  })
  session: Sessions;

  @ManyToOne(() => Users, (u) => u.user_id)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'user_id',
  })
  user: Users;
}
