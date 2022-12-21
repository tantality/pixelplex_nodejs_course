import normalizeEmail from 'normalize-email';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { SALT_ROUNDS } from '../modules/auth/auth.constants';
import { USER_ROLE } from '../modules/users/types';
dotenv.config();

const ADMIN = {
  NAME: 'admin',
  EMAIL: process.env.ADMIN_EMAIL as string,
  NORMALIZED_EMAIL: normalizeEmail(process.env.ADMIN_EMAIL as string),
  PASSWORD: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, SALT_ROUNDS),
  ROLE: USER_ROLE.ADMIN,
};

export class CreateAdmin1670524877384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "users" ("name", "email", "normalizedEmail", "role", "password") 
       VALUES ('${ADMIN.NAME}', '${ADMIN.EMAIL}', '${ADMIN.NORMALIZED_EMAIL}', '${ADMIN.ROLE}', '${ADMIN.PASSWORD}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "normalizedEmail"='${ADMIN.NORMALIZED_EMAIL}'`);
  }
}
