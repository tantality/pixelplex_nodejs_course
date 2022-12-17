import { Entity, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { CommonEntity } from '../../entities';
import { MAX_STRING_LENGTH } from '../../validations/validations.constants';
import { MAX_NAME_LENGTH } from '../auth/auth.constants';
import { Language } from '../languages/language.entity';
import { IUser, USER_ROLE } from './types';

@Entity('users')
export class User extends CommonEntity implements IUser {
  @ManyToOne(() => Language, (language) => language.users)
  @JoinColumn({
    name: 'nativeLanguageId',
  })
    nativeLanguage!: Relation<Language>;

  @Column()
    nativeLanguageId!: number;

  @Column({ type: 'varchar', length: MAX_NAME_LENGTH })
    name!: string;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH })
    email!: string;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH, unique: true })
    normalizedEmail!: string;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH })
    password!: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
    role!: string;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH, nullable: true })
    refreshToken!: string | null;
}
