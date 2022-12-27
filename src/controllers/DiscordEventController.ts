import { Guild, Message } from 'discord.js';
import { lazyInject } from '../ioc/decorators';
import { Service } from '../ioc';
import { MongoService } from '../services/MongoService';
import { ConfigService } from '../services/ConfigService';
import { DiscordService } from '../services/DiscordService';
import { isProduction } from '../utils/env';

/**
 * handles different discord events
 */
@Service
export class DiscordEventController {
    // separator of message component interaction

    @lazyInject(MongoService) mongoService!: MongoService;
    @lazyInject("DiscordService") discordService!: DiscordService;

    constructor(
        private configService: ConfigService,
    ) {
        // pass
    }

    /**
     * Only allow development instance to handle interactions in development instance;
     * Only allow production instance to handle interactions in eric's server.
     */
    private async withNsfwGuildPartition(
        guild: Guild,
        callback: () => Promise<void>,
    ) {
        const { guildIds } = this.configService.configs.discord;

        if (
            (isProduction && guild.id === guildIds.gentsClub)
            || (!isProduction && guild.id === guildIds.monitor)
        ) {
            await callback();
        }
    }

    /**
     * Handles messages.
     */
    public async handleMessage(msg: Message) {
        // prevents recursion
        if (msg.author.bot) {
            return;
        }

        // don't care about stuff that is not related with a guild
        const { guild } = msg;
        if (!guild) {
            return;
        }

        // Ensures only the 2 relevant guilds responds to the nsfw logic.
        await this.withNsfwGuildPartition(
            guild,
            async () => {
                const { content, channel, author } = msg;

                // smiley
                const smileyResponse: string[] = [];
                if (content.includes(':)')) {
                    await msg.channel.send(":)");
                } else if (content.includes(':(')) {
                    await msg.channel.send(":(");
                }

                // bitch ass
                if ( author.id === "blah" && content.toLowerCase().includes("rigged")) {
                    await channel.send("Cry about it.");
                }

                // best thing ever
                const regex = /^[0-9]{6}$/g;
                const match = content.match(regex);
                if (match) {
                    const id = +match[0];
                    await msg.channel.send(`https://nhentai.net/g/${id}`);
                }
            },
        );
    }
}
