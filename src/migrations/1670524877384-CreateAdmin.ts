import { MigrationInterface, QueryRunner } from 'typeorm';
import { ADMIN } from '../modules/auth/auth.constants';

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
