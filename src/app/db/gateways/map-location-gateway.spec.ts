import { MapLocationGateway } from './map-location-gateway';

describe('MapLocationGateway', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new MapLocationGateway();

      const data = ['foo', 'bar', 'baz', 'quux'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 12.3456, 78.9012];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('passes - name is null', () => {
      const gateway = new MapLocationGateway();

      const data = [null, 12.3456, 78.9012]

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid name', () => {
      const gateway = new MapLocationGateway();

      const data = [123, 12.3456, 78.9012];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid latitude', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 'asd', 78.9012];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid longitude', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 12.3456, 'asd'];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });
});
