import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ProductIsVisible1723702659788 implements MigrationInterface {
  name = 'ProductIsVisible1723702659788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'isVisible',
        type: 'boolean',
        default: false
      })
    );

    await queryRunner.query(
      `UPDATE product SET "isVisible" = false WHERE "isVisible" IS NULL`
    );

    await queryRunner.changeColumn(
      'product',
      'isVisible',
      new TableColumn({
        name: 'isVisible',
        type: 'boolean',
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product', 'isVisible');
  }
}
