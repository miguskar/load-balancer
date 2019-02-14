import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errors';

export function defaultErrorHandler(err: ValidationError, req: Request, res: Response, next: NextFunction) {
  // if headers have been sent, let express handle the error
  if (res.headersSent) {
    return next(err);
  }
  const { message, errors, status } = err;
  const body: any = { message };
  if (errors) {
    body.errors = errors;
  }
  if (status) {
    return res.status(status).json(body);
  }
  res.status(500).json(body);
}