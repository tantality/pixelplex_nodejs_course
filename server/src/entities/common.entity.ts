import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
