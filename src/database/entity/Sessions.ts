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

import { SESSION_STATUS } from '../../config/constants/common.constants';
import { Channels } from './Channels';

@Entity()
export class Sessions extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  session_id: number;

  @Column({ type: 'int', unsigned: true })
  channel_id: number;

  @Column({ type: 'varchar', length: 64 })
  thread_ts: string;

  @Column({
    type: 'enum',
    enum: SESSION_STATUS,
    default: SESSION_STATUS.IN_PROGRESS,
  })
  status: string;

  @Column()
  job_role: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Channels, (c) => c.channel_id)
  @JoinColumn({
    name: 'channel_id',
    referencedColumnName: 'channel_id',
  })
  channel: Channels;
}
