import { ActivityType, Client, IntentsBitField, Message } from 'discord.js';
import { Resource, IResource } from '../ioc';
import { DiscordEventController } from '../controllers/DiscordEventController';
import { ConfigService } from '../services/ConfigService';
import { lazyInject } from '../ioc/decorators';

@Resource
export class DiscordResource implements IResource {
    // test case need to access client directly
    public readonly client = new Client({
        intents: [
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.GuildEmojisAndStickers,
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.MessageContent,
        ],
    });

    // lazy injected controller for callbacks
    @lazyInject(DiscordEventController) eventController!: DiscordEventController;

    constructor(
        private readonly configService: ConfigService,
    ) {
        //
    }

    public async startup() {
        await this.client.login(this.configService.configs.bot.token);

        /**
         * register event listeners
         * once ready
         * on message create
         * on interaction create
         * on presence update
         */
        this.client.once('ready', async () => {
            // eslint-disable-next-line no-console
            await this.client.user!.setActivity({ type: ActivityType.Watching, name: 'your every move' });
        });

        this.client.on('messageCreate', async (msg: Message) => {
            await this.eventController.handleMessage(msg);
        });
    }
}
