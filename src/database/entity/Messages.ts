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

import { Channels } from './Channels';
import { Sessions } from './Sessions';

@Entity()
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  message_id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true })
  session_id: number;

  @Column({ type: 'int', unsigned: true })
  channel_id: number;

  @Column({ type: 'varchar', length: 64 })
  thread_ts: string;

  @Column({ type: 'text' })
  latest_text: string;

  @Column({ type: 'varchar', length: 64 })
  latest_timestamp: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  slack_message_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Sessions, (s) => s.session_id)
  @JoinColumn({
    name: 'session_id',
    referencedColumnName: 'session_id',
  })
  session: Sessions;

  @ManyToOne(() => Channels, (c) => c.channel_id)
  @JoinColumn({
    name: 'channel_id',
    referencedColumnName: 'channel_id',
  })
  channel: Channels;
}
