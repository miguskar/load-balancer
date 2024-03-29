import { Router } from 'express';
import allocateStream from './allocateStream';
import { defaultErrorHandler } from './defaultErrorHandler';

const router = Router();

// Specify express routes here
router.get('/', (req, res, next) => res.send('Hello :)'));
router.use('/allocateStream', allocateStream);


// handle errors
router.use(defaultErrorHandler);

export default router;
