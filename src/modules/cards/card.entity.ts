import { Entity, Column, Index, Relation, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../entities';
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';
import { ICard } from './types';

@Index(['createdAt'])
@Index(['nativeLanguageId', 'foreignLanguageId'])
@Entity('cards')
export class Card extends CommonEntity implements ICard {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
    user!: Relation<User>;

  @Index()
  @Column()
    userId!: number;

  @ManyToOne(() => Language)
  @JoinColumn({
    name: 'nativeLanguageId',
  })
    nativeLanguage!: Relation<Language>;

  @Column()
    nativeLanguageId!: number;

  @ManyToOne(() => Language)
  @JoinColumn({
    name: 'foreignLanguageId',
  })
    foreignLanguage!: Relation<Language>;

  @Column()
    foreignLanguageId!: number;
}
