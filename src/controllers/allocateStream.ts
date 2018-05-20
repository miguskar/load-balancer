import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';

import LoadBalancer from '../logic/loadBalancer';
import { HttpError } from '../utils/errors';

export async function allocate(req: Request, res: Response, next: NextFunction) {
  const lb = new LoadBalancer();
  const body: { channelId: string } = req.body;
  try {
    const url = await lb.getAvailableServerURL(body);
    res.json({ url });
  } catch (err) {
    next(new HttpError(err.message, 500));
  }
}
