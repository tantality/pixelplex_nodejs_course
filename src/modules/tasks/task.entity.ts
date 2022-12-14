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
import { Word } from '../cards/word.entity';
import { User } from '../users/user.entity';
import { ITask, TASK_STATUS, TASK_TYPE } from './types';

@Entity('tasks')
export class Task extends BaseEntity implements ITask {
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

  @ManyToOne(() => Word, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'hiddenWordId',
  })
    hiddenWord!: Relation<Word>;

  @Column()
    hiddenWordId!: number;

  @Column({ type: 'enum', enum: TASK_TYPE })
    type!: string;

  @Index()
  @Column({ type: 'enum', enum: TASK_STATUS, default: TASK_STATUS.UNANSWERED })
    status!: string;

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH, array: true, nullable: true })
    correctAnswers!: string[];

  @Index()
  @Column({ type: 'varchar', length: MAX_STRING_LENGTH, nullable: true })
    receivedAnswer!: string;

  @Index()
  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
