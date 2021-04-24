import { ObservationGateway } from './observation-gateway';

describe('validateValues', () => {
  it('throws on invalid data length', () => {
    const gateway = new ObservationGateway();

    const data = ['foo', 'bar', 'baz'];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('passes', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 1, 2, 3];

    expect(() => gateway.validateValues(data)).not.toThrow();
  });

  it('throws on invalid title', () => {
    const gateway = new ObservationGateway();

    const data = [123, 'Lorem ipsum', '2021-04-25', 1, 2, 3];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid description', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 123, '2021-04-25', 1, 2, 3];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid date', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 'Lorem ipsum', '2021-20-60', 1, 2, 3];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid type ID', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 'asd', 2, 3];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid map location ID', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 1, 'asd', 3];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid img data ID', () => {
    const gateway = new ObservationGateway();

    const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 1, 2, 'asd'];

    expect(() => gateway.validateValues(data)).toThrow();
  });
});
