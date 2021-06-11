var CronJob = require('cron').CronJob;
var job = new CronJob(
    '* */1 * * * *',
    function() {
        console.log('tratatta remove expired tokens');
    },
    null,
    true,
    'America/Los_Angeles'
);
