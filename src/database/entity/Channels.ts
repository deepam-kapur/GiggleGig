import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Channels extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  channel_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slack_channel_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;
}
