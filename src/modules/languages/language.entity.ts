import { Entity, Column, Index } from 'typeorm';
import { CommonEntity } from '../../entities';
import { MAX_NAME_LENGTH, MAX_CODE_LENGTH } from './languages.constants';

import { ILanguage } from './types';

@Entity('languages')
@Index(['createdAt'])
export class Language extends CommonEntity implements ILanguage {
  @Column({ type: 'varchar', length: MAX_NAME_LENGTH })
    name!: string;

  @Column({ type: 'varchar', length: MAX_CODE_LENGTH, unique: true })
    code!: string;
}
