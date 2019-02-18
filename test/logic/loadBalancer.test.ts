import LoadBalancer from '../../src/logic/loadBalancer';
import nock from 'nock';
import { HttpError } from '../../src/utils/errors';

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
      nock(`http://${url}`)
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
      nock(`http://${FAKE_URLS[0]}`)
        .post('/allocateStream')
        .reply(500);
      nock(`http://${FAKE_URLS[1]}`)
        .post('/allocateStream')
        .reply(200, { url: FAKE_URLS[1] });
      lb = new LoadBalancer(FAKE_URLS);
    });

    test('it should try the next url', async () => {
      const returnedUrl = await lb.getAvailableServerURL({ channelId: 'test' });
      expect(returnedUrl).toEqual(FAKE_URLS[1]);
    });
  });

  describe('when first server is too slow to respond', () => {
    beforeAll(() => {
      const url = FAKE_URLS[0];
      nock(`http://${FAKE_URLS[0]}`)
        .post('/allocateStream')
        .replyWithError({ code: 'ETIMEDOUT' });
      nock(`http://${FAKE_URLS[1]}`)
        .post('/allocateStream')
        .reply(200, { url: FAKE_URLS[1] });
      lb = new LoadBalancer(FAKE_URLS);
    });

    test('it should try the next url', async () => {
      const returnedUrl = await lb.getAvailableServerURL({ channelId: 'test' });
      expect(returnedUrl).toEqual(FAKE_URLS[1]);
    });
  });

  describe('when all servers break', () => {
    // Function used for mocking an url
    const mockUrl = (url) =>
      nock(`http://${url}`)
        .post('/allocateStream')
        .reply(500);

    beforeAll(() => {
      for (const url of FAKE_URLS) {
        mockUrl(url);
      }
      lb = new LoadBalancer(FAKE_URLS);
    });

    test('it should throw 500', async () => {
      await expect(lb.getAvailableServerURL({ channelId: 'test' })).rejects.toThrow(HttpError);
    });
  });
});
