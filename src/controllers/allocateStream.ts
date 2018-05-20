import { Request, Response } from 'express';

export function allocate(req: Request, res: Response) {
  res.status(501).json({ message: 'Not Implemented' });
}
