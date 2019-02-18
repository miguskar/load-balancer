import request, { SuperTest, Test } from 'supertest';
import nock from 'nock';

import app from '../../src/app';
import { SERVER_URLS } from '../../src/config';

describe('Allocate Stream API', () => {
  describe('POST', () => {
    let req: SuperTest<Test>;

    beforeEach(() => {
      req = request(app);
    });

    test('should respond with 400 if channelId is not set', () => {
      return req
        .post('/allocateStream')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Bad request');
          expect(res.body.errors).toMatchObject([
            { location: 'body', param: 'channelId', msg: 'Invalid value' }
          ]);
        });
    });

    describe('when a server works', () => {
      const firstUrl = SERVER_URLS[0];
      beforeAll(() => {
        nock(`http://${firstUrl}`)
          .post('/allocateStream')
          .reply(200, { url: firstUrl });
      });

      test('should respond with 200 and url', () => {
        return req
          .post('/allocateStream')
          .send({ channelId: 'svt1' })
          .set('Accept', 'application/json')
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body.url).toEqual(firstUrl);
            expect(res.body.secret).toBeUndefined();
          });
      });
    });

    describe('when no servers work', () => {
      beforeAll(() => {
        for (const url of SERVER_URLS) {
          nock(`http://${url}`)
            .post('/allocateStream')
            .reply(500);
        }
      });

      test('should respond with 500 and error', () => {
        return req
          .post('/allocateStream')
          .send({ channelId: 'svt1' })
          .set('Accept', 'application/json')
          .then((res) => {
            expect(res.status).toEqual(500);
          });
      });
    });
  });
});
