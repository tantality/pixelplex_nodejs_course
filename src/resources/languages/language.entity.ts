import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ILanguage } from './language.interface';

@Entity('languages')
export class Language extends BaseEntity implements ILanguage {
  @PrimaryGeneratedColumn()
    id!: number;
  @Index()
  @Column({ type: 'varchar', length: 255 })
    name!: string;
  @Column({ type: 'varchar', length: 255, unique: true })
    code!: string;
  @Index()
  @CreateDateColumn()
    createdAt!: Date;
  @UpdateDateColumn()
    updatedAt!: Date;
}
