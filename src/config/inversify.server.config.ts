import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';

export const configFn = (app: express.Application): void => {
  app.use(cors());

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(bodyParser.json());
};
