import { LastMigrationGateway } from './last-migration-gateway';

describe('LastMigrationGateway', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new LastMigrationGateway();

      const data = ['foo', 'bar', 'baz'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new LastMigrationGateway();

      const data = [1];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid last migration ID', () => {
      const gateway = new LastMigrationGateway();

      const data = ['asd'];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });
});
