import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Language } from '../modules/languages/language.entity';
import * as Migrations from '../migrations';
import { Card } from '../modules/cards/card.entity';
import { Word } from '../modules/cards/word.entity';
import { Task } from '../modules/tasks/task.entity';

dotenv.config();

export const DB: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'flashcards',
  synchronize: false,
  logging: false,
  entities: [Language, User, Card, Word, Task],
  migrations: Object.values(Migrations),
  migrationsRun: true,
};

export const config = {
  DEV: {
    PORT: 8080,
    DB,
  },
};
