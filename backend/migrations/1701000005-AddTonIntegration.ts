import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTonIntegration1701000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавить ton_wallet_address к таблице players
    await queryRunner.query(`
      ALTER TABLE players
      ADD COLUMN ton_wallet_address VARCHAR(255) UNIQUE;
    `);

    // Создать таблицу ton_transactions
    await queryRunner.query(`
      CREATE TABLE ton_transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount VARCHAR(255),
        token VARCHAR(50) NOT NULL,
        to_address VARCHAR(255),
        from_address VARCHAR(255),
        tx_hash VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        confirmed_at TIMESTAMP,
        
        INDEX idx_ton_tx_player (player_id),
        INDEX idx_ton_tx_hash (tx_hash),
        INDEX idx_ton_tx_status (status)
      );
    `);

    // Создать индекс для быстрого поиска по адресу
    await queryRunner.query(`
      CREATE INDEX idx_players_ton_wallet ON players(ton_wallet_address);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ton_transactions;`);
    await queryRunner.query(`DROP INDEX idx_players_ton_wallet;`);
    await queryRunner.query(`ALTER TABLE players DROP COLUMN ton_wallet_address;`);
  }
}
