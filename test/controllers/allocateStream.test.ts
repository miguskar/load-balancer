import request from 'supertest';
import app from '../../src/app';

describe('Allocate Stream API', () => {
    describe('POST', () => {
        test('should return 501 not implemented', () => {
            return request(app).get('/allocateStream').then(res => {
                expect(res.status).toEqual(501);
                expect(res.body.message).toEqual('Not Implemented');
            });
        });
    });
});