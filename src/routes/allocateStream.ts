import { Router } from 'express';
import { allocate } from '../controllers/allocateStream';

const router = Router();

router.post('/', allocate);

export default router;
