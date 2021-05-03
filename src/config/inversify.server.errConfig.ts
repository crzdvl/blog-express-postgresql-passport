import * as express from 'express';
import { HttpError } from 'http-errors';

export const errConfigFn = (app: express.Application): void => {
  app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.status ? err.status : 500;

    res.status(status);

    const message = status >= 500 ? 'INTERNAL_SERVER_ERROR' : err.message;

    console.error(err);

    return res.json({
      message,
    });
  });
};
