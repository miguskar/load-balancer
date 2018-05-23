import LoadBalancer from '../../src/logic/loadBalancer';
import nock from 'nock';

describe('Load balancer', () => {
  const FAKE_URLS = ['test1.example.com', 'test2.example.com'];
  let lb: LoadBalancer = new LoadBalancer(FAKE_URLS);

  test('should be instantiated', () => {
    expect(lb).toBeDefined();
  });

  describe('when all servers work', () => {
    lb = new LoadBalancer(FAKE_URLS);

    // Function used for mocking an url
    const mockUrl = (url) =>
      nock(`http://${url}:3000`)
        .post('/allocateStream')
        .reply(200, { url });

    beforeAll(() => {
      for (const url of FAKE_URLS) {
        mockUrl(url);
      }
      // mock the first url so that we can test that it loops
      mockUrl(FAKE_URLS[0]);
    });

    let returnedUrl;

    beforeEach(async () => {
      returnedUrl = await lb.getAvailableServerURL({ channelId: 'test' });
    });

    test('it should try the first url', () => {
      expect(returnedUrl).toEqual(FAKE_URLS[0]);
    });

    test('it should try the second url', () => {
      expect(returnedUrl).toEqual(FAKE_URLS[1]);
    });

    test('it should try the first url again', () => {
      expect(returnedUrl).toEqual(FAKE_URLS[0]);
    });
  });

  describe('when first server breaks', () => {
    beforeAll(() => {
      const url = FAKE_URLS[0];
      nock(`http://${url}:3000`)
        .post('/allocateStream')
        .reply(500);
      lb = new LoadBalancer(FAKE_URLS);
    });

    test('it should try the next url', () => {});
  });
});
