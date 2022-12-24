import normalizeEmail from 'normalize-email';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { SALT_ROUNDS } from '../modules/auth/auth.constants';
import { IUser, USER_ROLE } from '../modules/users/types';
dotenv.config();

const ADMIN: Pick<IUser, 'name' | 'email' | 'normalizedEmail' | 'password' | 'role'> = {
  name: 'admin',
  email: process.env.ADMIN_EMAIL as string,
  normalizedEmail: normalizeEmail(process.env.ADMIN_EMAIL as string),
  password: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, SALT_ROUNDS),
  role: USER_ROLE.ADMIN,
};

export class CreateAdmin1670524877384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "users" ("name", "email", "normalizedEmail", "role", "password") 
       VALUES ('${ADMIN.name}', '${ADMIN.email}', '${ADMIN.normalizedEmail}', '${ADMIN.role}', '${ADMIN.password}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "normalizedEmail"='${ADMIN.normalizedEmail}'`);
  }
}
