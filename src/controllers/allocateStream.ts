import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';

import LoadBalancer from '../logic/loadBalancer';
import { HttpError } from '../utils/errors';
import { SERVER_URLS } from '../config';

// Create a load balancer that keeps track of what server to call
const lb = new LoadBalancer(SERVER_URLS);

/**
 * Returns the next available media server
 * @param req The request
 * @param res The response
 * @param next The next middleware
 */
export async function allocate(req: Request, res: Response, next: NextFunction) {
  const body: { channelId: string } = req.body;
  try {
    const url = await lb.getAvailableServerURL(body);
    res.json({ url });
  } catch (err) {
    next(new HttpError(err.message, 500));
  }
}
