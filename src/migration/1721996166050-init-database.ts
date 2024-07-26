import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1721996166050 implements MigrationInterface {
  name = 'InitDatabase1721996166050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'active', "parentId" integer, CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "comparedPrice" numeric`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "stock" integer NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "images" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "product" ADD "tags" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" integer`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "description" text NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "description" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "comparedPrice"`
    );
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
