import { inject } from "inversify";
import { TConfigs } from "../configs";
import { Service } from "../ioc";
import { isProduction } from "../utils/env";

@Service
export class ConfigService {
    constructor(
        @inject('Configs') public readonly configs: TConfigs,
    ) {
        // pass
    }

    /**
     * gets the channelId
     * @param key subject name
     * @returns channelId
     */
    public getUstChannelId(key: keyof TConfigs["discord"]["ustChIds"]) {
        return this.configs.discord.ustChIds[key][isProduction ? 0 : 1];
    }

    /**
     * gets the channelId
     * @param key channel handle
     * @returns channelId
     */
    public getChannelId(key: keyof TConfigs["discord"]["channelIds"]) {
        return this.configs.discord.channelIds[key][isProduction ? 1 : 0];
    }
}
