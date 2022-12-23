import { Entity, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { CommonEntity } from '../../entities';
import { MAX_STRING_LENGTH } from '../../validations/validations.constants';
import { User } from '../users/user.entity';
import { IToken } from './types';

@Entity('users')
export class Token extends CommonEntity implements IToken {
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'userId',
  })
    user!: Relation<User>;

  @Column()
    userId!: number;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH })
    refreshToken!: string;
}
