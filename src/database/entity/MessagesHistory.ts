import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChannelUsers } from './ChannelUsers';
import { Messages } from './Messages'; // Adjust the path to where your Message entity is located

@Entity()
export class MessagesHistory extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  ts: string;

  @PrimaryColumn({ type: 'int', unsigned: true })
  channel_user_id: number;

  @Column({ type: 'int', unsigned: true })
  message_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => ChannelUsers, (cu) => cu.channel_user_id)
  @JoinColumn({
    name: 'channel_user_id',
    referencedColumnName: 'channel_user_id',
  })
  channel_user: ChannelUsers;

  @ManyToOne(() => Messages, (message) => message.message_id)
  @JoinColumn({ name: 'message_id', referencedColumnName: 'message_id' })
  message: Messages;
}
