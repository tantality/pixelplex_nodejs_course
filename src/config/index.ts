import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Language } from '../resources/languages/language.entity';
import { User } from '../resources/users/user.entity';

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
  entities: [Language, User],
};

export const config = {
  DEV: {
    PORT: 8080,
    DB,
  },
};
