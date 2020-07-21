describe('config', () => {
  it('contain application config', () => {
    const foo = (process.env.FOO = 'bar');
    const token = (process.env.BROKER_TOKEN = '1234');
    process.env.FOO_BAR = '$FOO/bar';

    const config = require('../../lib/config');

    expect(config.foo).toEqual(foo);
    expect(config.brokerToken).toEqual(token);
    expect(config.fooBar).toEqual('bar/bar');
  });
});
