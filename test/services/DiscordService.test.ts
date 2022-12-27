import { ChannelType, Collection, Message } from 'discord.js';
import { server } from '../../src/share';
import { DiscordService } from '../../src/services/DiscordService';
import { TConfigs } from '../../src/configs';

let service: DiscordService;
let config: TConfigs;

describe('DiscordService', () => {
    before(async () => {
        await server.start();
        service = server.container.get<DiscordService>("DiscordService");
        config = server.container.get<TConfigs>("Configs");
    });

    describe.skip("UstQuota management", async () => {
        /**
         * 1. genereate the channels
         * 2. add the k-v to configService
         * 3. add the subjectKey to UstController
         */
        it.skip("add subjects", async () => {
            const subjects: string[] = [
            ];
            for (const s of subjects) {
                const [prod, dev] = await service.createUstQuotaDevProdChannelPair(s);
                console.log(`${s}: ["${prod.id}", "${dev.id}"],`);
            }
        });
    });

    describe.skip("Message management", () => {
        it("delete all my messages", async () => {
            const guild = await service.discordResource.client.guilds.fetch("379506207041519616");
            const channels = await guild.channels.fetch();
            for (const [, channel] of channels) {
                if (channel === null) {
                    continue;
                }

                console.log(channel.name);
                if (channel.type === ChannelType.GuildText) {
                    try {
                        let before: string | undefined = undefined;
                        while (true) {
                            const messages: Collection<String, Message<boolean>> = before
                                ? await channel.messages.fetch({ limit: 100, before })
                                : await channel.messages.fetch({ limit: 100 });
                            console.log(messages.size);
                            await new Promise(res => setTimeout(() => res(1), 3000));

                            if (messages.size === 0) {
                                break;
                            }
                            for (const [mid, msg] of messages.entries()) {
                                if (msg.author.id === "321516585892315139" || msg.author.id === "587668060207579187") {
                                    console.log(new Date(msg.createdTimestamp), channel.name, msg.author.username, msg.content);
                                    await msg.delete();
                                    await new Promise(res => setTimeout(() => res(1), 3000));
                                }
                                before = mid.toString();
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }).timeout(1000000000000000000);
    });
});
