import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import { ValidationError } from '../utils/errors';

export function validator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next(new ValidationError(errors.array()));
}
