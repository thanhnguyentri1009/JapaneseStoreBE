import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColorCountToSize1789881795430
  implements MigrationInterface
{
  name = 'RenameColorCountToSize1789881795430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_details" RENAME COLUMN "color_count" TO "size"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1ef703e183431b480a981a589" ON "product_details" ("size") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1ef703e183431b480a981a589"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_details" RENAME COLUMN "size" TO "color_count"`,
    );
  }
}
