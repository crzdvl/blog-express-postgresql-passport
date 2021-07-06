import 'dotenv/config';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

import './controllers/home.controller';
import './controllers/user.controller';
import './controllers/blogger.controller';
import './controllers/admin.controller';
import './controllers/auth.controller';
import './controllers/post.controller';
import './controllers/comment.controller';
import './controllers/like.controller';

import container from './inversify.config';
import { getDbConnection } from './config/db';
import { config } from './config/inversify.server.config';
import { errConfig } from './config/inversify.server.errConfig';

import expiredTokenCleaner from './jobs/expired-token-cleaner';

(async () => {
    await getDbConnection();

    const port = 3000;

    const app = new InversifyExpressServer(container);

    app
        .setConfig(config)
        .setErrorConfig(errConfig);

    const server = app.build();

    server.listen(port, () => {
        expiredTokenCleaner.start();

        console.log(`Server running at http://127.0.0.1:${port}/`);
    });
})();
