describe('Setting server urls', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('should set test variables if NODE_ENV=test', () => {
    // set the variables
    process.env.NODE_ENV = 'test';

    const expectedServerUrls = ['test1.example.com', 'test2.example.com'];
    const { SERVER_URLS } = require('../../src/config');

    expect(SERVER_URLS).toHaveLength(2);
    expect(SERVER_URLS[0]).toEqual(expectedServerUrls[0]);
    expect(SERVER_URLS[1]).toEqual(expectedServerUrls[1]);
  });

  describe('from environment variable', () => {

    test('should die if no servers are set', () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => { }) as () => never);
      const error_code = 1;

      process.env.NODE_ENV = 'production';
      delete process.env.SERVERS;

      const { SERVER_URLS } = require('../../src/config');

      expect(mockExit).toHaveBeenCalledWith(error_code);
      mockExit.mockRestore();
    });

    test('should set single url', () => {
      // set the variables
      process.env.NODE_ENV = 'production';
      const expectedUrl = 'test1.example.com';
      process.env.SERVERS = expectedUrl;

      const { SERVER_URLS } = require('../../src/config');

      expect(SERVER_URLS).toHaveLength(1);
      expect(SERVER_URLS[0]).toEqual(expectedUrl);
    });

    test('should set multiple urls', () => {
      // set the variables
      process.env.NODE_ENV = 'production';
      const expectedUrls = ['test1.example.com', 'test2.example.com'];
      process.env.SERVERS = expectedUrls.join(';');

      const { SERVER_URLS } = require('../../src/config');

      expect(SERVER_URLS).toHaveLength(2);
      expect(SERVER_URLS[0]).toEqual(expectedUrls[0]);
      expect(SERVER_URLS[1]).toEqual(expectedUrls[1]);
    });
  });

});