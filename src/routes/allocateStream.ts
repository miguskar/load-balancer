import { Router } from 'express';
import { body } from 'express-validator/check';
import { allocate } from '../controllers/allocateStream';
import { validator } from '../middlewares/validator';

const router = Router();

router.post('/', [body('channelId').exists()], validator, allocate);

export default router;
