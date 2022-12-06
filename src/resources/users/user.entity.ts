import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Language } from '../languages/language.entity';
import { IUser } from './user.interface';
import { USER_ROLE } from './types';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Language, (language) => language.users)
  @JoinColumn({
    name: 'nativeLanguageId',
  })
    nativeLanguage!: Relation<Language>;

  @Column()
    nativeLanguageId!: number;

  @Column({ type: 'varchar', length: 257 })
    name!: string;

  @Column({ type: 'varchar', length: 255 })
    email!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
    normalizedEmail!: string;

  @Column({ type: 'varchar', length: 255 })
    password!: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
    role!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    refreshToken!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
