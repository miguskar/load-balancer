import LoadBalancer from '../../src/logic/loadBalancer';
import nock from 'nock';

describe('Load balancer', () => {
  let lb: LoadBalancer = new LoadBalancer();

  test('should be instantiated', () => {
    expect(lb).toBeDefined();
  });

  describe('when all servers work', () => {
    beforeAll(() => {
      for (const url of LoadBalancer.SERVER_URIS) {
        nock(`http://${url}:3000`)
          .post('/allocateStream')
          .reply(200, { url });
      }
      const firstUrl = LoadBalancer.SERVER_URIS[0];
      nock(`http://${firstUrl}:3000`)
        .post('/allocateStream')
        .reply(200, { url: firstUrl });
    });

    let returnedUrl;

    beforeEach(async () => {
      console.log('creating new LB');
      lb = new LoadBalancer();
      returnedUrl = await lb.getAvailableServerURL({ channelId: 'test' });
    });

    test('it should call the first url', () => {
      expect(returnedUrl).toEqual(LoadBalancer.SERVER_URIS[0]);
    });

    test('it should call the second url', () => {
      expect(returnedUrl).toEqual(LoadBalancer.SERVER_URIS[1]);
    });

    test('it should call the third url', () => {
      expect(returnedUrl).toEqual(LoadBalancer.SERVER_URIS[2]);
    });

    test('it should call the first url again', () => {
      expect(returnedUrl).toEqual(LoadBalancer.SERVER_URIS[0]);
    });
  });

  describe('when first server breaks');
});
