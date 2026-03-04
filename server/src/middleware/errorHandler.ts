import { context, trace } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const span = trace.getSpan(context.active());
  span?.recordException(err);

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
};
