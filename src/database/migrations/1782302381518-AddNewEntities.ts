import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewEntities1782302381518 implements MigrationInterface {
  name = 'AddNewEntities1782302381518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop legacy tables that no longer exist as entities
    await queryRunner.query(`DROP TABLE IF EXISTS "product_colors" CASCADE`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f96cc94ab666a35b9144e4e0d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4dcd2cd0cf988da1681469a0f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_69a63e75de53e7cc4bcd029bed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e476a7b322a60d4c031601c48e"`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "full_name" character varying(100) NOT NULL, "phone" character varying(20), "address" text, "img" text, CONSTRAINT "UQ_48f07a756b8f321aa99b06aee11" UNIQUE ("account_id"), CONSTRAINT "REL_48f07a756b8f321aa99b06aee1" UNIQUE ("account_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "nib_type" character varying(50), "ink_type" character varying(30), "stock" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "descriptions" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_abbb591b1989c63fb0c240dfff" UNIQUE ("product_id"), CONSTRAINT "PK_a3fa8e2e94f3c37a8d731451de4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abbb591b1989c63fb0c240dfff" ON "product_details" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3adf5b430b0afca5143c1cc3ed" ON "product_details" ("ink_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b16537ac63f9c42eb6126cff6d" ON "product_details" ("is_active") `,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "nib_type"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "ink_type"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "brand_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "accounts" ADD "role_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_d39c53244703b8534307adcd073"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_7482082bf53fd0ba88a32e3de88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "PK_745d8f43d3af10ab8247465e450"`,
    );
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7482082bf53fd0ba88a32e3de8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP COLUMN "customer_id"`,
    );
    await queryRunner.query(`ALTER TABLE "addresses" ADD "customer_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2f7b823a21562eeca20e72b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "REL_b2f7b823a21562eeca20e72b00"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "order_id"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "order_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_b2f7b823a21562eeca20e72b006" UNIQUE ("order_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94133e8ed1285884ca224352cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_772d0ce0473ac2ccfa26060dbe"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "customer_id" uuid`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "address_id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6335813ef19bc35b8d866cc656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "PK_005269d8574e6fac0493715c308"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_145532db85752b29c57d2b7b1f"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "order_id"`);
    await queryRunner.query(`ALTER TABLE "order_items" ADD "order_id" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9263386c35b6b242540f9493b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" ADD "product_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a5f6868c96e0069e699f33e12"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "category_id" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_7482082bf53fd0ba88a32e3de8" ON "addresses" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2f7b823a21562eeca20e72b00" ON "payments" ("order_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_772d0ce0473ac2ccfa26060dbe" ON "orders" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94133e8ed1285884ca224352cd" ON "orders" ("customer_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_145532db85752b29c57d2b7b1f" ON "order_items" ("order_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9263386c35b6b242540f9493b0" ON "order_items" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6335813ef19bc35b8d866cc656" ON "order_items" ("order_id", "product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a5f6868c96e0069e699f33e12" ON "products" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1530a6f15d3c79d1b70be98f2b" ON "products" ("brand_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_48f07a756b8f321aa99b06aee11" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_7482082bf53fd0ba88a32e3de88" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_d39c53244703b8534307adcd073" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_details" ADD CONSTRAINT "FK_abbb591b1989c63fb0c240dfffb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_details" DROP CONSTRAINT "FK_abbb591b1989c63fb0c240dfffb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_d39c53244703b8534307adcd073"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_7482082bf53fd0ba88a32e3de88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_48f07a756b8f321aa99b06aee11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1530a6f15d3c79d1b70be98f2b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a5f6868c96e0069e699f33e12"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6335813ef19bc35b8d866cc656"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9263386c35b6b242540f9493b0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_145532db85752b29c57d2b7b1f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94133e8ed1285884ca224352cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_772d0ce0473ac2ccfa26060dbe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2f7b823a21562eeca20e72b00"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7482082bf53fd0ba88a32e3de8"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "category_id" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_9a5f6868c96e0069e699f33e12" ON "products" ("category_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "product_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9263386c35b6b242540f9493b0" ON "order_items" ("product_id") `,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "order_id"`);
    await queryRunner.query(`ALTER TABLE "order_items" ADD "order_id" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_145532db85752b29c57d2b7b1f" ON "order_items" ("order_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "PK_005269d8574e6fac0493715c308"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6335813ef19bc35b8d866cc656" ON "order_items" ("order_id", "product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "address_id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "address_id" integer`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "customer_id" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_772d0ce0473ac2ccfa26060dbe" ON "orders" ("customer_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94133e8ed1285884ca224352cd" ON "orders" ("customer_id", "status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "order_id"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "order_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "REL_b2f7b823a21562eeca20e72b00" UNIQUE ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2f7b823a21562eeca20e72b00" ON "payments" ("order_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "customers" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP COLUMN "customer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "customer_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7482082bf53fd0ba88a32e3de8" ON "addresses" ("customer_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "PK_745d8f43d3af10ab8247465e450"`,
    );
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "addresses" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_7482082bf53fd0ba88a32e3de88" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_d39c53244703b8534307adcd073" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "accounts" ADD "role_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "accounts" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brand_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "stock" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "ink_type" character varying(30)`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "nib_type" character varying(50)`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b16537ac63f9c42eb6126cff6d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3adf5b430b0afca5143c1cc3ed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_abbb591b1989c63fb0c240dfff"`,
    );
    await queryRunner.query(`DROP TABLE "product_details"`);
    await queryRunner.query(`DROP TABLE "brands"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_e476a7b322a60d4c031601c48e" ON "products" ("ink_type", "series") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69a63e75de53e7cc4bcd029bed" ON "products" ("category_id", "is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4dcd2cd0cf988da1681469a0f4" ON "products" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f96cc94ab666a35b9144e4e0d3" ON "products" ("ink_type") `,
    );
  }
}
