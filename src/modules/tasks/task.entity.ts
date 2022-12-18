import { Entity, Column, Index, Relation, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../entities';
import { MAX_STRING_LENGTH } from '../../validations/validations.constants';
import { Word } from '../cards/word.entity';
import { User } from '../users/user.entity';
import { ITask, TASK_STATUS, TASK_TYPE } from './types';

@Index(['createdAt'])
@Entity('tasks')
export class Task extends CommonEntity implements ITask {
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

  @Column({ type: 'varchar', length: MAX_STRING_LENGTH, nullable: true })
    receivedAnswer!: string;
}
