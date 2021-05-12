import cors from 'cors';
import express from 'express';
import * as bodyParser from 'body-parser';

export const config = (app: express.Application): void => {
    app.use(cors());

    app.use(
        bodyParser.urlencoded({
            extended: true,
        }),
    );

    app.use(bodyParser.json());
};
