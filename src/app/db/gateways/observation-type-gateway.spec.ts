import { ObservationTypeGateway } from './observation-type-gateway';

describe('ObservationTypeGateway', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new ObservationTypeGateway();

      const data = ['foo', 'bar', 'baz'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new ObservationTypeGateway();

      const data = ['LANDSCAPE', 'landscape.svg'];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid name', () => {
      const gateway = new ObservationTypeGateway();

      const data = [123, 'landscape.svg'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid file name', () => {
      const gateway = new ObservationTypeGateway();

      const data = ['LANDSCAPE', 123];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });
});
