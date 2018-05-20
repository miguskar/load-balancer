import { Router } from 'express';
import allocateStream from './allocateStream';

const router = Router();

// Specify express routes here
router.use('/allocateStream', allocateStream);

export default router;
