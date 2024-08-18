import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Channels } from './Channels';
import { Users } from './Users';

@Entity()
export class ChannelUsers extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  channel_user_id: number;

  @Column()
  channel_id: number;

  @Column({ unsigned: true, type: 'int' })
  user_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  @ManyToOne(() => Users, (user) => user.user_id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: Users;

  @ManyToMany(() => Channels, (channel) => channel.channel_id)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'channel_id' })
  channel: Channels;
}
