import chalk from 'chalk';
import { CronJob } from 'cron';
import { getConnection } from 'typeorm';

import { Tokens } from '../entities/tokens';

const job = new CronJob(
    '*/5 * * * *', // every 5 minutes
    (async () => {
        console.log(chalk.bgGreen(chalk.black('meow:')), chalk.green('remove expired tokens'));

        const tokenRepository = getConnection('default').getRepository(Tokens);

        tokenRepository.createQueryBuilder()
            .delete()
            .where('finished_at <= :currentDate', { currentDate: new Date() })
            .execute();
    }),
    null,
    true,
    'America/Los_Angeles',
);

export default job;
