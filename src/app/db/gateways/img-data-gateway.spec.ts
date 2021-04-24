import { ImgDataGateway } from './img-data-gateway';

describe('validateValues', () => {
  it('throws on invalid data length', () => {
    const gateway = new ImgDataGateway();

    const data = ['foo', 'bar', 'baz'];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('passes', () => {
    const gateway = new ImgDataGateway();

    const data = ['file://asd', 'data:image/gif;base64,R0lG'];

    expect(() => gateway.validateValues(data)).not.toThrow();
  });

  it('throws on invalid file URI', () => {
    const gateway = new ImgDataGateway();

    const data = [123, 'data:image/gif;base64,R0lG'];

    expect(() => gateway.validateValues(data)).toThrow();
  });

  it('throws on invalid debug data URI', () => {
    const gateway = new ImgDataGateway();

    const data = ['file://asd', 123];

    expect(() => gateway.validateValues(data)).toThrow();
  });
});
