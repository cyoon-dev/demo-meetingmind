import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';

export const requestTelemetryMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const span = trace.getSpan(context.active());
  const start = Date.now();

  if (span) {
    const body = req.body as { meetingId?: string; demo?: Record<string, boolean> };
    if (body?.meetingId) {
      span.setAttribute('meeting.id', body.meetingId);
    }
    if (body?.demo) {
      Object.entries(body.demo).forEach(([key, value]) => {
        span.setAttribute(`demo.${key}`, Boolean(value));
      });
    }
  }

  res.on('finish', () => {
    if (!span) {
      return;
    }
    span.setAttribute('duration_ms', Date.now() - start);
    span.setAttribute('http.status_code', res.statusCode);
    if (res.statusCode >= 500) {
      span.setStatus({ code: SpanStatusCode.ERROR });
    }
  });

  next();
};
