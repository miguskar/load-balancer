import { Router } from 'express';
import { allocate } from '../controllers/allocateStream';

const router = Router();

router.get('/', allocate);

export default router;
