import LoadBalancer from '../../src/logic/loadBalancer';

describe('Load balancer', () => {
    let lb: LoadBalancer;
    beforeEach(() => {
        lb = new LoadBalancer();
    });

    test('should be instantiated', () => {
        expect(lb).toBeDefined();
    });
});