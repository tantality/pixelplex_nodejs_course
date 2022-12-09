import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MAX_STRING_LENGTH } from '../../validations/validations.constants';
import { Language } from '../languages/language.entity';
import { Card } from './card.entity';
import { IWord } from './types';

@Entity('words')
export class Word extends BaseEntity implements IWord {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Card, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'cardId',
  })
    card!: Relation<Card>;

  @Index()
  @Column()
    cardId!: number;

  @ManyToOne(() => Language)
  @JoinColumn({
    name: 'languageId',
  })
    language!: Relation<Language>;

  @Column()
    languageId!: number;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH })
    value!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
