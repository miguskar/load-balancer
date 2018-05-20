import request, { SuperTest, Test } from 'supertest';

import app from '../../src/app';
import LoadBalancer from '../../src/logic/loadBalancer';
jest.mock('../../src/logic/loadBalancer');

describe('Allocate Stream API', () => {
    describe('POST', () => {
        let req: SuperTest<Test>;
        const mock = (LoadBalancer as jest.Mock<LoadBalancer>);

        beforeEach(() => {
            req = request(app);
            mock.mockClear();
        });

        test('should respond with 400 if channelId is not set', () => {
            return req.post('/allocateStream')
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toEqual(400);
                    expect(res.body.message).toEqual('\'channelId\' is required');
                });
        });

        test('should respond with 200 and url', () => {
            const fakeURL = 'http://fake-uri.example.com';
            // mock load balancer to return a url
            mock.mockImplementation(() => {
                return {
                    getAvailableServerURL: () => {
                        return Promise.resolve(fakeURL);
                    },
                };
            });
            return req.post('/allocateStream')
                .send({ channelId: 'svt1' })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toEqual(200);
                    expect(res.body.url).toEqual(fakeURL);
                    expect(res.body.secret).toBeUndefined();
                });
        });

        test('should respond with 500 and error', () => {
            const fakeError = new Error('No available servers');
            // mock load balancer to return a url
            mock.mockImplementation(() => {
                return {
                    getAvailableServerURL: () => {
                        return Promise.reject(fakeError);
                    },
                };
            });
            return req.post('/allocateStream')
                .send({ channelId: 'svt1' })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toEqual(500);
                });
        });
    });
});