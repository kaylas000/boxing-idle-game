import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTournamentTables1701000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tournaments таблица
    await queryRunner.createTable(
      new Table({
        name: 'tournaments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'maxParticipants',
            type: 'int',
          },
          {
            name: 'entryFee',
            type: 'int',
          },
          {
            name: 'prizePool',
            type: 'int',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'registration'",
          },
          {
            name: 'startTime',
            type: 'timestamp',
          },
          {
            name: 'endTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'bracket',
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

    // Tournament Participants таблица
    await queryRunner.createTable(
      new Table({
        name: 'tournament_participants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tournamentId',
            type: 'uuid',
          },
          {
            name: 'playerId',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'placement',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'prize',
            type: 'int',
            default: 0,
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

    // Foreign keys
    await queryRunner.createForeignKey(
      'tournament_participants',
      new TableForeignKey({
        columnNames: ['tournamentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tournaments',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tournament_participants',
      new TableForeignKey({
        columnNames: ['playerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
        onDelete: 'CASCADE',
      }),
    );

    // Indexes
    await queryRunner.query(
      `CREATE INDEX idx_tournaments_status ON tournaments(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tournament_participants_tournament ON tournament_participants("tournamentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_tournament_participants_player ON tournament_participants("playerId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tournament_participants');
    await queryRunner.dropTable('tournaments');
  }
}
