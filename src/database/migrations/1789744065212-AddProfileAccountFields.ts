import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileAccountFields1789744065212
  implements MigrationInterface
{
  name = 'AddProfileAccountFields1789744065212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD "username" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD "email" character varying(200)`,
    );
    await queryRunner.query(
      `UPDATE "profiles" p SET "username" = a."username", "email" = a."email" FROM "accounts" a WHERE a."id" = p."account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ALTER COLUMN "username" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "username"`);
  }
}
