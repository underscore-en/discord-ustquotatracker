import { CronJob } from 'cron';
import { Resource, IResource } from '../ioc';
import { lazyInject } from '../ioc/decorators';
import { DiscordController } from '../controllers/DiscordController';
import { isProduction } from '../utils/env';
import { UstController } from '../controllers/UstController';

@Resource
export class CronJobResource implements IResource {
    @lazyInject("DiscordController") private readonly discordController!: DiscordController;
    @lazyInject("UstController") private readonly ustController!: UstController;

    private healthCheckCount = 0;

    public startup() {
        const timeZone = 'Asia/Hong_Kong';
        const { discordController: controller } = this;

        /**
         * The only job that runs in both env.
         */
        new CronJob({
            cronTime: '0 * * * *',
            onTick: async () => {
                await controller.run(
                    async () => { await this.discordController.healthCheck(this.healthCheckCount); },
                    "health check",
                );
                this.healthCheckCount++;
            },
            runOnInit: true,
        }).start();

        if (isProduction) {
            new CronJob({
                onTick: async () => {
                    await controller.run(
                        async () => { await this.discordController.weatherReport(); },
                        "weather report",
                    );
                },
                cronTime: '46 7 * * *',
                timeZone,
            }).start();

            new CronJob({
                cronTime: '0 1 * * *',
                onTick: async () => {
                    await controller.run(
                        async () => { await this.discordController.remindSleep(); },
                        "remind sleep first",
                    );
                },
                timeZone,
            }).start();

            new CronJob({
                cronTime: "*/5 * * * *",
                onTick: async () => {
                    await controller.run(
                        async () => { await this.ustController.update(); },
                        "ust check quota",
                        { ignoreSuccess: true },
                    );
                },
                timeZone,
            }).start();
        }
    }
}
