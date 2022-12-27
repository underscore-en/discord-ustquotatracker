import { injectable } from 'inversify';
import { ChannelType, TextChannel } from 'discord.js';
import { DiscordResource } from '../resources/DiscordResource';
import { TChannelKey, TConfigs } from '../configs';
import { ConfigService } from './ConfigService';

/**
 * Binded to controller with string literal "DiscordService"
 */
@injectable()
export class DiscordService {
    constructor(
        public discordResource: DiscordResource,
        public readonly configService: ConfigService,
    ) {
        // 
    }

    public async getChannel(channelId: string) {
        return this.discordResource.client.channels.fetch(
            channelId,
            { force: true },
        );
    }

    public async getChannelCategory(channelId: string) {
        const channel = await this.getChannel(channelId);
        if (channel?.type !== ChannelType.GuildCategory) {
            throw new Error("Channel does not exists or is not of type GUILD_CATEGORY");
        }
        return channel;
    }

    /**
     * For initial config use
     */
    public async createUstQuotaDevProdChannelPair(subjectKey: string): Promise<[prod: TextChannel, dev: TextChannel]> {
        const guild = await this.discordResource.client.guilds.fetch("940857138115387423");
        const categoryChIds: [prod: string, dev: string] = [
            "940857138115387424",
            "940864267975016488",
        ];
        const channels: [TextChannel, TextChannel] = [null, null] as any;
        for (let i = 0; i < 2; i++) {
            const category = await this.getChannelCategory(categoryChIds[i]);
            channels[i] = await guild.channels.create<ChannelType.GuildText>({
                name: subjectKey,
                parent: category,
                type: ChannelType.GuildText,
            });
        }
        return channels;
    }

    /**
     * Maybe find a way to remove such duplication?
     */
    public async getUstTextChannel(subjectKey: keyof TConfigs["discord"]["ustChIds"]): Promise<TextChannel> {
        const channelId = await this.configService.getUstChannelId(subjectKey);
        const channel = await this.getChannel(channelId);
        if (!channel) {
            throw new Error("Channel ID corresponds to nothing.");
        }
        if (!(channel instanceof TextChannel)) {
            throw new Error(`Requested is not instance of text channel, actual: ${typeof channel}`);
        }
        if (channel.type !== ChannelType.GuildText) {
            throw new Error("Requested channel type of not GUILD_TEXT.");
        }
        return channel;
    }

    public async getGentsClubTextChannel(channelKey: TChannelKey): Promise<TextChannel> {
        const channelId = this.configService.getChannelId(channelKey);
        const channel = await this.getChannel(channelId);
        if (!channel) {
            throw new Error("Channel ID corresponds to nothing.");
        }
        if (!(channel instanceof TextChannel)) {
            throw new Error(`Requested is not instance of text channel, actual: ${typeof channel}`);
        }
        if (channel.type !== ChannelType.GuildText) {
            throw new Error("Requested channel type of not GUILD_TEXT.");
        }
        return channel;
    }
    // #endregion
}
