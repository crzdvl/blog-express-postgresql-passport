import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { getDbConnection } from './config/db';
import './controllers/home';
import './controllers/user';

import { TYPES } from './services/types';
import { UserService } from './services/user.service';

(async () => {
  await getDbConnection();

  const port = 3000;
  const container = new Container();

  container.bind<UserService>(TYPES.UserService).to(UserService);

  const app = new InversifyExpressServer(container);

  const server = app.build();

  server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
  });
})();
