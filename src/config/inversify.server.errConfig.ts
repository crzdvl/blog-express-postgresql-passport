import chalk from 'chalk';
import * as express from 'express';
import { HttpError } from 'http-errors';
import ValidationError from '../error/ValidationError';

export const errConfig = (app: express.Application): void => {
    app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (err instanceof ValidationError) {
            return res.status(422).json({
                error: err.name,
                details: err.message,
            });
        }

        const status = err.status || 500;

        res.status(status);

        const message = err.message || 'INTERNAL_SERVER_ERROR';

        console.error(chalk.bold.red(err));

        return res.json({
            message,
        });
    });
};
