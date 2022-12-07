import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, Relation } from 'typeorm';
import { User } from '../users/user.entity';
import { ILanguage } from './types';

@Entity('languages')
export class Language extends BaseEntity implements ILanguage {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255 })
    name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
    code!: string;

  @Index()
  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @OneToMany(() => User, (user) => user.nativeLanguage)
    users!: Relation<User>[];
}
