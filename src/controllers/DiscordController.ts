import dayjs from 'dayjs';
import HKO from 'hko';
import { inject, injectable } from 'inversify';
import { DiscordService } from '../services/DiscordService';
import { MongoService } from '../services/MongoService';
import { isProduction } from '../utils/env';

/**
 * Controller logic related to Discord
 */
@injectable()
export class DiscordController {
    constructor(
        @inject("DiscordService") private discordService: DiscordService,
        private mongoService: MongoService,
    ) {
        // pass
    }

    /**
     * Logs a function execution and sends success or failure to "cron-logs"
     * @param logic the function that is executed
     * @param identifier log message ctx
     * @param opt.ignoreSuccess if true, doesn't log succcess
     */
    public async run(logic: () => Promise<void>, identifier: string, opt?: { ignoreSuccess: true }) {
        const ignoreSuccess = opt?.ignoreSuccess ?? false;
        const cronLogCh = await this.discordService.getGentsClubTextChannel("cronLogs");

        try {
            await logic();
            if (!ignoreSuccess) {
                await cronLogCh.send(`Success: ${identifier}`);
            }
        } catch (err) {
            await cronLogCh.send(`Failure: ${identifier}`);
        }
    }

    /**
     * Sends server status to "healthCheck channel"
     * @param count internal counter
     */
    public async healthCheck(count: number) {
        const channel = await this.discordService.getGentsClubTextChannel("healthCheck");

        if (count === 0) {
            await channel.send(`(isProduction:${isProduction}) I'm alive!\nServer:\`${dayjs().toDate()}\`\nUnix:\`${dayjs().unix()}\``);
        } else {
            await channel.send(`(isProduction:${isProduction}) Healthy for ~${count - 1}hrs.\nServer:\`${dayjs().toDate()}\`\nUnix:\`${dayjs().unix()}\``);
        }
    }

    /**
     * Sends weather to "bincarea",
     */
    public async weatherReport() {
        const channel = await this.discordService.getGentsClubTextChannel("hahaFunny");
        const forecast = Object.values(await new HKO("tc").localWeatherForecast()).join('\n');
        await channel.send(forecast);
    }

    /**
     * reminds people to sleep
     */
    public async remindSleep() {
        const channel = await this.discordService.getGentsClubTextChannel('hahaFunny');
        await channel.send("早啲訓啦～");
    }
}
