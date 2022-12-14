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
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';
import { ICard } from './types';

@Index(['nativeLanguageId', 'foreignLanguageId'])
@Entity('cards')
export class Card extends BaseEntity implements ICard {
  @PrimaryGeneratedColumn()
    id!: number;

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

  @Index()
  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
