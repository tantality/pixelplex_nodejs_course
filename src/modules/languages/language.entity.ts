import { Entity, Column, Index, OneToMany, Relation } from 'typeorm';
import { CommonEntity } from '../../entities';
import { User } from '../users/user.entity';
import { MAX_NAME_LENGTH, MAX_CODE_LENGTH } from './languages.constants';

import { ILanguage } from './types';

@Entity('languages')
@Index(['createdAt'])
export class Language extends CommonEntity implements ILanguage {
  @Column({ type: 'varchar', length: MAX_NAME_LENGTH })
    name!: string;

  @Column({ type: 'varchar', length: MAX_CODE_LENGTH, unique: true })
    code!: string;

  @OneToMany(() => User, (user) => user.nativeLanguage)
    users!: Relation<User>[];
}
