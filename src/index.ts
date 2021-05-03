import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { getDbConnection } from './config/db';
import './controllers/home.controller';
import './controllers/user.controller';
import './controllers/blogger.controller';
import './controllers/admin.controller';

import { TYPES } from './services/types';
import { UserService } from './services/user.service';

import { configFn } from './config/inversify.server.config';
import { errConfigFn } from './config/inversify.server.errConfig';

(async () => {
  await getDbConnection();

  const port = 3000;
  const container = new Container();

  container.bind<UserService>(TYPES.UserService).to(UserService);

  const app = new InversifyExpressServer(container);

  app.setConfig(configFn).setErrorConfig(errConfigFn);

  const server = app.build();

  server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
  });
})();
