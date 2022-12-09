import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, Relation } from 'typeorm';
import { User } from '../users/user.entity';
import { MAX_CODE_LENGTH, MAX_NAME_LENGTH } from './languages.constants';
import { ILanguage } from './types';

@Entity('languages')
export class Language extends BaseEntity implements ILanguage {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: MAX_NAME_LENGTH })
    name!: string;

  @Column({ type: 'varchar', length: MAX_CODE_LENGTH, unique: true })
    code!: string;

  @Index()
  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @OneToMany(() => User, (user) => user.nativeLanguage)
    users!: Relation<User>[];
}
