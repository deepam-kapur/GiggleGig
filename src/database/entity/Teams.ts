import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { STATUS } from '../../config/constants/common.constants';

@Entity()
export class Teams extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  team_id: number;

  @Column({ type: 'varchar', length: 512 })
  name: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  slack_team_id: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  slack_enterprise_id?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  slack_enterprise_name?: string;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  domain?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  email_domain?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  icon_image?: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // updateStatusUpdatedAt() {
  //   if (this.status) {
  //     this.status_updated_at = new Date();
  //   }
  // }
}
