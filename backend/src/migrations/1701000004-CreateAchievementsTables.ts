import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAchievementsTables1701000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Player Achievements таблица
    await queryRunner.createTable(
      new Table({
        name: 'player_achievements',
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
            name: 'achievementId',
            type: 'varchar',
          },
          {
            name: 'unlockedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Foreign key
    await queryRunner.createForeignKey(
      'player_achievements',
      new TableForeignKey({
        columnNames: ['playerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
        onDelete: 'CASCADE',
      }),
    );

    // Indexes
    await queryRunner.query(
      `CREATE INDEX idx_player_achievements_player ON player_achievements("playerId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_player_achievements_unique ON player_achievements("playerId", "achievementId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('player_achievements');
  }
}
