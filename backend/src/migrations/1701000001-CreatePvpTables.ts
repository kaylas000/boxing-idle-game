import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePvpTables1701000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // PvP Matches таблица
    await queryRunner.createTable(
      new Table({
        name: 'pvp_matches',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'player1Id',
            type: 'uuid',
          },
          {
            name: 'player2Id',
            type: 'uuid',
          },
          {
            name: 'winnerId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'rounds',
            type: 'int',
            default: 0,
          },
          {
            name: 'fightLog',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Foreign keys
    await queryRunner.createForeignKey(
      'pvp_matches',
      new TableForeignKey({
        columnNames: ['player1Id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pvp_matches',
      new TableForeignKey({
        columnNames: ['player2Id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
        onDelete: 'CASCADE',
      }),
    );

    // Indexes
    await queryRunner.query(
      `CREATE INDEX idx_pvp_matches_player1 ON pvp_matches("player1Id")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_pvp_matches_player2 ON pvp_matches("player2Id")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_pvp_matches_status ON pvp_matches(status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pvp_matches');
  }
}
