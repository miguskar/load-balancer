import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';

import LoadBalancer from '../logic/loadBalancer';
import { HttpError } from '../utils/errors';
import { MEDIA_SERVER_URLS } from '../config';

const lb = new LoadBalancer(MEDIA_SERVER_URLS);
export async function allocate(req: Request, res: Response, next: NextFunction) {
  const body: { channelId: string } = req.body;
  try {
    const url = await lb.getAvailableServerURL(body);
    res.json({ url });
  } catch (err) {
    next(new HttpError(err.message, 500));
  }
}
