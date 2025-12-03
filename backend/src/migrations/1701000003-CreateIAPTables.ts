import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateIAPTables1701000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Purchases таблица
    await queryRunner.createTable(
      new Table({
        name: 'purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'playerId',
            type: 'uuid',
          },
          {
            name: 'productId',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'currency',
            type: 'varchar',
          },
          {
            name: 'transactionId',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Foreign key
    await queryRunner.createForeignKey(
      'purchases',
      new TableForeignKey({
        columnNames: ['playerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
        onDelete: 'CASCADE',
      }),
    );

    // Indexes
    await queryRunner.query(
      `CREATE INDEX idx_purchases_player ON purchases("playerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_purchases_status ON purchases(status)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_purchases_transaction ON purchases("transactionId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchases');
  }
}
