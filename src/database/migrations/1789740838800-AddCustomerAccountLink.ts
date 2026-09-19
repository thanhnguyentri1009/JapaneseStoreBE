import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerAccountLink1789740838800
  implements MigrationInterface
{
  name = 'AddCustomerAccountLink1789740838800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" ADD "account_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_customers_account_id" UNIQUE ("account_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_customers_account_id" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "is_registered" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "is_registered"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_customers_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_customers_account_id"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "account_id"`);
  }
}
